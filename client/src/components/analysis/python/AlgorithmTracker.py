import ast
import astor
from collections import deque

class AlgorithmTracker(ast.NodeVisitor):
    def __init__(self, code):
        self.ast = ast.parse(code)
        self.variables = deque()
        self.loop_variables = deque()
        self.functions = {}
        self.classes = {}
    
    def visit_Assign(self, node):
        node_id = self.generic_visit(node)
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.variables.append(target.id)
        return node_id
    
    def visit_For(self, node):
        node_id = self.generic_visit(node)
        loop_var = astor.to_source(node.target).strip()
        self.loop_variables.append(loop_var)
        return node_id

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


# print("Variables:", analyzer.variables)
# print("Loop Variables:", analyzer.loop_variables)
# print("Functions:", analyzer.functions)
# print("Classes:", analyzer.classes)
