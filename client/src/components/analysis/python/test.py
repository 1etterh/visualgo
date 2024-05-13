import ast
import astor
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

# Convert all Data instances in tracker.datas to dictionaries and save to JSON file
with open('datas.json', 'w') as file:
    json.dump([data.to_dict() for data in tracker.datas], file, indent=4)

print("Data saved to datas.json.")
