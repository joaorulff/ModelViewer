// sections
import { MatrixSection } from '../sections/temporalModelViewer/matrix.section';

// utils
import { ChartUtils } from "../utils/chart.utils";


export class TemporalModelViewer {

    // elements
    public svg!: d3.Selection<any,any,any,any>;

    // sections
    public matrixSection!: MatrixSection;
    
    constructor( public container: HTMLDivElement, public callbacks: { [callbackName: string]: any } = {} ) {

        if( !this.svg ) this.initialize_chart();
    }

    private initialize_chart(): void {  

        // creating svg
        this.svg = ChartUtils.create_svg( this.container );

        this.matrixSection = new MatrixSection();
        this.matrixSection.initialize_section( this.svg );

    }

    public update( data: any, selectedTimestamp: number | null ): void {

        this.matrixSection.update( data, selectedTimestamp, this.callbacks );

    }

}