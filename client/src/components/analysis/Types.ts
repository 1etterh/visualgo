export interface TestCase{
    name:string
    selected?:boolean
    txt?:string
}

export interface State {
    pyodide:any
    code: string;
    results: JSON;
    variables: Record<string, any>;
    classes: Record<string, any>;
    functions: Record<string, any>;
    timeComplexity: Record<string, any>;
    testCases?:TestCase //optional property
    errorMsg:string|null
    pyodideLoaded:boolean    }