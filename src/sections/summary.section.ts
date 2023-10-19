// utils
import { ChartUtils } from "../utils/chart.utils";

// constants
import { LABELSECTIONWIDTHRATIO, MATRIXSECTIONWIDTHRATIO, SUMMARYSECTIONMARGINS, SUMMARYSECTIONWIDTHRATIO } from "../constants/chart-constants";

// interfaces
import { IData } from "../interfaces/interfaces";

// external
import * as d3 from 'd3';

export class SummarySection {

    // section group
    private confidenceGroup!: d3.Selection<any, any, any, any>;
    private coverageGroup!: d3.Selection<any, any, any, any>;

    private localMargin: number = 5;

    private width!: number;
    private height!: number;

    // scales
    private verticalScale!: d3.ScaleBand<any>;
    private horizontalScale!: d3.ScaleLinear<any,any>;
    private colorScale!: d3.ScaleSequential<any,any>;

    public initialize_section( svg: d3.Selection<any, any, any, any> ): void {

        // calculating section width
        this.width = ( parseInt( svg.attr('width') )*SUMMARYSECTIONWIDTHRATIO ) - SUMMARYSECTIONMARGINS.left - SUMMARYSECTIONMARGINS.right;
        this.height = parseInt( svg.attr('height') ) - SUMMARYSECTIONMARGINS.top - SUMMARYSECTIONMARGINS.bottom ;

        // adding section group
        const groupLeft: number = parseInt( svg.attr('width') )*(LABELSECTIONWIDTHRATIO+MATRIXSECTIONWIDTHRATIO);
        this.confidenceGroup = ChartUtils.create_group( svg, { top: SUMMARYSECTIONMARGINS.top, left: groupLeft, bottom: 0, right: 0 } );
        this.coverageGroup = ChartUtils.create_group( svg, { top: SUMMARYSECTIONMARGINS.top, left: groupLeft + this.width/2, bottom: 0, right: 0 } );

        this.update_labels();

    }

    private update_labels(): void{

        // TODO: add labels
        console.log('TODO: Add confidence and coverage labels');
        // this.confidenceGroup
        //     .append('text')
        //     .text('Confidence')
        //     .attr('transform', 'translate( '+ this.width/4 +' , '+ -10 +'),'+ 'rotate(-45)');

        // this.coverageGroup
        //     .append('text')
        //     .text('Coverage')
        //     .attr('transform', 'translate( '+ this.width/4 +' , '+ -10 +'),'+ 'rotate(-45)');

    }


    private update_scales( data: IData ): void {

        const labels: string[] = data.labels.map( 
            ( label: { name: string, values: number[], confidence: number, coverage: number } ) => label.name );

        this.verticalScale = d3.scaleBand().domain( labels ).range( [0, this.height] ).paddingInner(0.1);
        this.horizontalScale = d3.scaleLinear().domain( [0, 1] ).range( [0, this.width/2 - this.localMargin] );
        this.colorScale = d3.scaleSequential( d3.interpolateBlues ).domain([0,1]);
    }



    public update( data: IData ): void {

        // updating scales
        this.update_scales( data );

        // appending name groups
        const confidenceGroups = this.confidenceGroup
            .selectAll('.meta-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'meta-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' +  0  + ',' + this.verticalScale( row.name ) + ')' ),
                (update: any) => update.attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0  + ',' + this.verticalScale( row.name ) + ')' ),
                (exit: any) => exit.remove()
        )

        // appending name groups
        const coverageGroups = this.coverageGroup
            .selectAll('.meta-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'meta-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate('  + 0 + ',' + this.verticalScale( row.name ) + ')' ),
                (update: any) => update.attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row.name ) + ')' ),
                (exit: any) => exit.remove()
            )


        const confidenceElements = confidenceGroups
            .selectAll('.confidence-bar')
            .data(  ( data: { name: string, values: number[], coverage: number, confidence: number } ) =>  [data.confidence] )
            .join(
                (enter: any) => enter
                    .append('rect')
                    .attr('class', 'confidence-bar')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', ( value: number ) => this.horizontalScale( value ) )
                    .attr('height', this.verticalScale.bandwidth() )
                    .attr('fill', ( value: number ) => this.colorScale( value ) ),
                (update: any) => update
                    .attr('width', ( value: number ) => this.horizontalScale( value ) )
                    .attr('fill', ( value: number ) => this.colorScale( value ) ),
                (exit: any) => exit.remove()
            )

        
        const coverageElements = coverageGroups
            .selectAll('.coverage-bar')
            .data(  ( data: { name: string, values: number[], coverage: number, confidence: number } ) =>  [data.coverage] )
            .join(
                (enter: any) => enter
                    .append('rect')
                    .attr('class', 'coverage-bar')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', ( value: number ) => this.horizontalScale( value ) )
                    .attr('height', this.verticalScale.bandwidth() )
                    .attr('fill', ( value: number ) => this.colorScale( value ) ),
                (update: any) => update
                    .attr('width', ( value: number ) => this.horizontalScale( value ) )
                    .attr('fill', ( value: number ) => this.colorScale( value ) ),
                (exit: any) => exit.remove()
            )

    }

}

