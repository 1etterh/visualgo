export interface TestCase{
    name:string
    selected?:boolean
    txt?:string
}

export interface State {
    pyodide:{
        loadPackage(packages:Array<string>):void
        runPythonAsync(script:String):void
        runPython(script:String):void
        globals:any
    } | null
    code: string;
    results: Record<string,any>;
    variables: Record<string, any>;
    classes: Record<string, any>;
    functions: Record<string, any>;
    timeComplexity: Record<string, any>;
    testCases?:TestCase //optional property
    errorMsg:string|null
    pyodideLoaded:boolean    

    // You can add methods to process, add, or manipulate the code and track details here.
}
