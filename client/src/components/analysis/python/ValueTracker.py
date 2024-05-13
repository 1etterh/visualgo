import ast
import astor

class ValueTracker(ast.NodeTransformer): #extend ast.NodeTransformer
    def __init__(self, code):
        self.ast = ast.parse(code)
    
    def visit_Assign(self, node):
        # Instrument variable assignments
        self.generic_visit(node)  # Visit all other child nodes first
        print_statements = []
        
        for target in node.targets:
            print_stmt = ast.parse(f"print('Variable: {target.id} updated to =', {astor.to_source(node.value).strip()})").body
            print_statements.extend(print_stmt)
        return [node] + print_statements


    def visit_For(self, node):
        # Instrument For loops to print each iteration
        self.generic_visit(node)  # Process the loop body first to capture internal changes
        loop_var = astor.to_source(node.target).strip()
        # Create a print statement to capture the state of all variables updated within the loop
        new_body = [ast.parse(f"print('Loop iteration with {loop_var} =', {loop_var})").body[0]]
        for stmt in node.body:
            new_body.append(stmt)
            if isinstance(stmt, ast.Assign) or isinstance(stmt, ast.AugAssign):
                targets=stmt.targets if isinstance(stmt,ast.Assign) else [stmt.target]
                for target in targets:
                    if isinstance(target, ast.Name):
                        print_stmt = ast.parse(f"print('During loop, {target.id} =', {target.id})").body[0]
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
                        print_stmt = ast.parse(f"print('During loop, {target.id} =', {target.id})").body[0]
                        new_body.append(print_stmt)
        node.body = new_body
        return node
    
    def analyze(self):
        self.visit(self.ast)
# Example Python code to instrument
code = """
def compute(x, y):
    result = x + y
    return result

class Example:
    def method(self):
        pass
x=0
for i in range(5):
    compute(i, i+1)
    x+=i
"""

# Parse the code to an AST

tracker = ValueTracker(code)
tracker.analyze()
# Convert the modified AST back to source code and execute it
instrumented_source = astor.to_source(tracker.ast)
# print(instrumented_source)  # Optionally print the modified code to see the changes
exec(instrumented_source)
# print(ast.dump(parsed_code, indent = 4))
