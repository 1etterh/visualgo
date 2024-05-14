<template>
    <div>
      <Codemirror
        v-model:value="state.code"
        :options="cmOptions"
        border
        placeholder="Enter your code here..."
        :height="400"
        ref="cm"
        id="code-editor"
      />
      <button @click="runCode" :disabled="!state.pyodideLoaded || !state.astorLoaded">Run</button>
      <p v-if="!state.pyodideLoaded">Loading Pyodide. Please wait...</p>
      <div v-if="state.errorMsg" class="error">{{ state.errorMsg }}</div>
      <pre v-if="state.results">{{ JSON.stringify(state.results, null, 2) }}</pre>
    </div>
  </template>
  
  <script lang="ts">
  import Codemirror from 'codemirror-editor-vue3';
  import 'codemirror/mode/python/python.js';
  import 'codemirror/theme/material-ocean.css';
  import 'codemirror/addon/display/placeholder.js';
  import { defineComponent, onMounted, reactive } from 'vue';
  import type { State } from './Types';

  const state: State = reactive({
        pyodide: null,
        code: `
import ast
import astor
import js
import json
from collections import defaultdict

class Data:
    def __init__(self, loop_info, variables):
        self.loop_info = loop_info
        self.variables = variables

    def to_dict(self):
        return {
            "loop_info": self.loop_info,
            "variables": self.variables
        }

    def __repr__(self):
        return f"Data(loop_info={self.loop_info}, variables={self.variables})"

class Tracker(ast.NodeTransformer):
    def __init__(self, code: str):
        self.ast = ast.parse(code)
        self.variables = defaultdict(lambda: None)
        self.loop_variables = defaultdict(lambda: None)
        self.functions = {}
        self.classes = {}
        self.datas = []

    def visit_Assign(self, node):
        self.generic_visit(node)
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.variables[target.id]
        return node
    
    def visit_For(self, node):
        self.generic_visit(node)
        loop_var = astor.to_source(node.target).strip()
        self.loop_variables[loop_var]
        new_body = [ast.parse(f"print('Loop iteration with {loop_var} =', {loop_var})").body[0]]
        new_body.append(ast.parse(f"tracker.loop_variables['{loop_var}'] = {loop_var}").body[0])
        for stmt in node.body:
            new_body.append(stmt)
            if isinstance(stmt, ast.Assign) or isinstance(stmt, ast.AugAssign):
                targets = stmt.targets if isinstance(stmt, ast.Assign) else [stmt.target]
                for target in targets:
                    if isinstance(target, ast.Name):
                        print_stmt = ast.parse(f"tracker.variables['{target.id}'] = {target.id}").body[0]
                        new_body.append(print_stmt)

        # Create and append data instance
        data_code = f"data = Data(loop_info={{'for': {loop_var}}}, variables=dict(tracker.variables))"
        new_body.append(ast.parse(data_code).body[0])
        new_body.append(ast.parse("tracker.datas.append(data)").body[0])
        node.body = new_body
        return node

    def visit_While(self, node):
        self.generic_visit(node)
        loop_condition = astor.to_source(node.test).strip()

        # Initialize loop variables for the while loop
        if loop_condition not in self.loop_variables:
            self.loop_variables[loop_condition] = 0

        # Debug print statement for each iteration
        print_stmt = ast.parse(f"print('While loop iteration with condition ({loop_condition})')").body[0]
        
        new_body = [print_stmt]
        for stmt in node.body:
            new_body.append(stmt)
            # Check and append print statements for variable assignments
            if isinstance(stmt, (ast.Assign, ast.AugAssign)):
                targets = stmt.targets if isinstance(stmt, ast.Assign) else [stmt.target]
                for target in targets:
                    if isinstance(target, ast.Name):
                        print_stmt = ast.parse(f"tracker.variables['{target.id}'] = {target.id}").body[0]
                        new_body.append(print_stmt)

        # Create and append data instance at the end of each loop iteration
        data_code = f"data = Data(loop_info={{'while': '{loop_condition}', 'iteration': tracker.loop_variables['{loop_condition}']}}, variables=dict(tracker.variables))"
        new_body.append(ast.parse(data_code).body[0])
        new_body.append(ast.parse("tracker.datas.append(data)").body[0])

        # Increment the while loop counter
        increment_code = f"tracker.loop_variables['{loop_condition}'] += 1"
        new_body.append(ast.parse(increment_code).body[0])

        node.body = new_body
        return node

    
    def visit_FunctionDef(self, node):
        self.generic_visit(node)
        function_code = astor.to_source(node)
        self.functions[node.name] = function_code.strip()
        return node

    def visit_ClassDef(self, node):
        self.generic_visit(node)
        class_code = astor.to_source(node)
        self.classes[node.name] = class_code.strip()
        return node

    def analyze(self):
        self.visit(self.ast)
    def sendData(self):
        return self.datas

# Sample code for analysis
code = '''
class Math:
    def add(self, x, y):
        return x + y

def compute(x, y):
    result = x + y
    return result

x = 0
for i in range(5):
    compute(i, i + 1)
    x += i
cnt = 0
while cnt<5:
    x+=cnt
    cnt+=1
'''

tracker = Tracker(code)
tracker.analyze()
exec(astor.to_source(tracker.ast))
result = json.dumps([data.to_dict() for data in tracker.datas], indent=4)
        `,
        results: JSON.parse('{}'),
        variables: {},
        classes: {},
        functions: {},
        timeComplexity: {},
        testCases: undefined,
        errorMsg: null,
        pyodideLoaded: false,
        astorLoaded:false
      });
  
  export default defineComponent({
    name: 'CodeEditor',
    components: {
      Codemirror,
    },
    setup(props,{emit}) {
      
      onMounted(async () => {
        try {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          document.head.appendChild(script);
          script.onload=async()=>{
          state.pyodide = await window.loadPyodide();
          state.pyodideLoaded = true;
          await importAstor();
          }
        } catch (error:any) {
          state.errorMsg = 'Failed to load Pyodide: ' + error.message;
        }
      });
  
      const runCode = async () => {
        if (state.pyodide && state.pyodideLoaded) {
          try {
            await state.pyodide.runPythonAsync(state.code);
            state.results =await state.pyodide.globals.get("result"); // Storing results in a generic format
            console.log(state.results);
            emit('code-executed',state.results);
          } catch (error:any) {
            state.errorMsg = 'Error running Python code: ' + error.message;
          }
        }
      };
      const importAstor=async()=>{
        try{
          await state.pyodide.loadPackage('micropip');
            const micropip = state.pyodide.pyimport("micropip");
            await micropip.install('astor');
            state.astorLoaded=true;
        }
        catch(err:any){
          state.errorMsg=err
        }
      }
      const cmOptions = {
        styleActiveLine: true,
        lineNumbers: true,
        mode: "text/x-python",
        theme: "material-ocean",
      };
  
      return { state, runCode, cmOptions };
    },
  });
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  