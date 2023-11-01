export interface IData {

    // TODO: Finish interface type definition
    name: string,
    labels: { 
        name: string, 
        values: number[], 
        colors?: string[],
        confidence: number, 
        coverage: number }[],

}


export interface ITemporalData {

    labels: { [label: string | number]: { value: string | number, timestamp: number}[] }

}