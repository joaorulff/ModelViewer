// sections
import { MatrixSection } from '../sections/matrix.section';
import { LabelSection } from '../sections/label.section';
import { SummarySection } from '../sections/summary.section';

// utils
import { ChartUtils } from "../utils/chart.utils";

// interfaces
import { IData } from '../interfaces/interfaces';

export class ModelViewer {

    // elements
    public svg!: d3.Selection<any,any,any,any>;

    // sections
    public labelSection!: LabelSection;
    public matrixSection!: MatrixSection;
    public summarySection!: SummarySection;
    
    constructor( public container: HTMLDivElement, public callbacks: { [callbackName: string]: any } = {} ) {

        if( !this.svg ) this.initialize_chart();
    }

    private initialize_chart(): void {  

        // creating svg
        this.svg = ChartUtils.create_svg( this.container );

        // initializing sections
        this.labelSection = new LabelSection();
        this.labelSection.initialize_section( this.svg );

        this.matrixSection = new MatrixSection();
        this.matrixSection.initialize_section( this.svg );

        this.summarySection = new SummarySection();
        this.summarySection.initialize_section( this.svg );

    }

    public update( data: IData, index: number | null, timeExtent: number[] = [] ): void {

        // updating sections
        this.labelSection.update( data, index );
        this.matrixSection.update( data, index, timeExtent, this.callbacks );
        this.summarySection.update( data );

    }

}