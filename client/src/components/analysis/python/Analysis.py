from ValueTracker import ValueTracker
from AlgorithmTracker import AlgorithmTracker
import ast, astor
class Analyzer:
    def __init__(self,algorithm:AlgorithmTracker,value:ValueTracker):
        self.variables=algorithm.variables
        self.functions = algorithm.functions
        self.classes=algorithm.classes
        self.ast = value.ast
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

tracker = ValueTracker(code)
tracker.analyze()
exec(astor.to_source(tracker.ast))

algorithmTracker = AlgorithmTracker(code)
algorithmTracker.analyze()

