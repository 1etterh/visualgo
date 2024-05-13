import ast
import astor
from collections import defaultdict
from Types import Data

class Tracker(ast.NodeTransformer):
    def __init__(self, code:str):
        self.ast = ast.parse(code)
        self.variables = defaultdict(lambda:None)
        self.loop_variables = defaultdict(lambda:None)
        self.functions = {}
        self.classes = {}
    def visit_Assign(self, node):
        node_id = self.generic_visit(node)
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.variables[target.id]
        return node_id
    
    def visit_For(self, node):
        self.generic_visit(node)
        loop_var = astor.to_source(node.target).strip()
        self.loop_variables[loop_var]
        new_body = [ast.parse(f"print('Loop iteration with {loop_var} =', {loop_var})").body[0]]
        new_body.append(ast.parse(f"tracker.loop_variables['{loop_var}']={loop_var}"))
        for stmt in node.body:
            new_body.append(stmt)
            if isinstance(stmt, ast.Assign) or isinstance(stmt, ast.AugAssign):
                targets=stmt.targets if isinstance(stmt,ast.Assign) else [stmt.target]
                for target in targets:
                    if isinstance(target, ast.Name):
                        print_stmt = ast.parse(f"tracker.variables['{target.id}'] = {target.id}").body[0]
                        new_body.append(print_stmt)
        node.body = new_body
        return node

    def visit_While(self, node):
        # Instrument While loops similarly
        self.generic_visit(node)
        print_stmt = ast.parse("print('While loop iteration')").body
        new_body = [print_stmt[0]]
        for stmt in node.body:
            new_body.append(stmt)
            if isinstance(stmt, ast.Assign):
                for target in stmt.targets:
                    if isinstance(target, ast.Name):
                        print_stmt = ast.parse(f"tracker.variables[{target.id}]={target.id}").body[0]
                        new_body.append(print_stmt)
        node.body = new_body
        return node
    def visit_FunctionDef(self, node):
        node_id = self.generic_visit(node)
        function_code = astor.to_source(node)
        self.functions[node.name] = function_code.strip()
        return node_id

    def visit_ClassDef(self, node):
        node_id = self.generic_visit(node)
        class_code = astor.to_source(node)
        self.classes[node.name] = class_code.strip()
        return node_id

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
'''

tracker = Tracker(code)
tracker.analyze()
exec(astor.to_source(tracker.ast))
print(tracker.variables)
print(tracker.functions)
print(tracker.classes)
print(tracker.loop_variables)