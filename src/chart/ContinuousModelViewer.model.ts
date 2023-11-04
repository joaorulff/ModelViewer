// sections
import { MainSection } from "../sections/continuousModelViewer/main.section";

// utils
import { ChartUtils } from "../utils/chart.utils";

// interfaces
import { IContinuosModelData } from '../interfaces/interfaces';

export class ContinuousModelViewer {

    // elements
    public svg!: d3.Selection<any,any,any,any>;

    // sections
    public mainSection!: MainSection;
    
    constructor( public container: HTMLDivElement, public callbacks: { [callbackName: string]: any } = {} ) {

        if( !this.svg ) this.initialize_chart();
    }

    private initialize_chart(): void {  

        // creating svg
        this.svg = ChartUtils.create_svg( this.container );

        // initializing sections
        this.mainSection = new MainSection();
        this.mainSection.initialize_section( this.svg );

    }

    public update( data: IContinuosModelData['ids'], selectedTimestamp: number | null ): void {

        // updating sections
        this.mainSection.update( data, selectedTimestamp, this.callbacks );

    }

}