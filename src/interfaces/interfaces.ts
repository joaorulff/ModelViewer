export interface IData {

    // TODO: Finish interface type definition
    name: string,
    labels: { 
        name: string, 
        values: number[], 
        timestamps: number[],
        colors?: string[],
        confidence: number, 
        coverage: number }[],

}

export interface ITemporalData {
    labels: { [label: string | number]: { value: string | number, timestamp: number}[] }
}

export interface IContinuosModelData {
    ids: { [id: string ]: { step: number, timestamp: number, error: boolean }[] }
}