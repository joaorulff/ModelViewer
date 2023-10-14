import { IData } from "./interfaces/interfaces";
import { ModelViewer } from "./model/ModelViewer.model";

export class TemporalViewer {

    public scrollableContainer!: HTMLDivElement;
    public modelViewer!: ModelViewer;

    constructor( public container: HTMLDivElement ){
        this.modelViewer = new ModelViewer( this.container );
    }

    public render( data: IData ){
        this.modelViewer.update( data );
    }

}