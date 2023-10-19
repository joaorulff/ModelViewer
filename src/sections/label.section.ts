// interfaces
import { IData } from "../interfaces/interfaces";

// constants
import { LABELSECTIONMARGINS, LABELSECTIONWIDTHRATIO } from "../constants/chart-constants";

// utils
import { ChartUtils } from "../utils/chart.utils";

// external
import * as d3 from 'd3';

export class LabelSection {

    // section group
    private group!: d3.Selection<any, any, any, any>;

    private width!: number;
    private height!: number;

    // scales
    private verticalScale!: d3.ScaleBand<any>;
    private horizontalScale!: d3.ScaleLinear<any,any>;

    constructor(){}

    public initialize_section( svg: d3.Selection<any, any, any, any> ): void {
        
        // adding section group
        this.group = ChartUtils.create_group( svg, LABELSECTIONMARGINS );

        // calculating section width
        this.width = (parseInt( svg.attr('width') )*LABELSECTIONWIDTHRATIO) - LABELSECTIONMARGINS.left - LABELSECTIONMARGINS.right;
        this.height = parseInt( svg.attr('height') ) - LABELSECTIONMARGINS.top - LABELSECTIONMARGINS.bottom;

    }

    private update_scales( data: IData ): void {

        const labels: string[] = data.labels.map( 
            ( label: { name: string, values: number[], confidence: number, coverage: number } ) => label.name );
        
        this.verticalScale = d3.scaleBand().domain( labels ).range( [0, this.height] ).paddingInner(0.1);
        this.horizontalScale = d3.scaleLinear().domain( [0,1] ).range( [0, this.width] );
    }   

    public update( data: IData, index: number | null ): void {

        // updating scales
        this.update_scales( data );

        // appending name groups
        const nameGroups = this.group
            .selectAll('.name-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'name-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row.name ) + ')' ),
                (update: any) => update
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row.name ) + ')' ),
                (exit: any) => exit.remove()
        )


        // appending confidence bars
        const confidenceBars = nameGroups
            .selectAll('.confidence-bar')
            .data( ( data: { name: string, values: number[] } ) =>  { 
                if( index !== null ){
                    return [data.values[index]];
                }
                return [0]
            })
            .join(
                (enter: any) => enter
                    .append('rect')
                    .attr('class', 'confidence-bar')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', ( value: number ) => this.horizontalScale(value) )
                    .attr('height', this.verticalScale.bandwidth() )
                    .attr('fill', '#fdbf6f')
                    .style('opacity', 0.8),
            (update: any) => update
                .transition(100)
                .attr('width', ( value: number ) => this.horizontalScale(value) ),
            (exit: any) => exit.remove()
        )


        // appending name texts
        const labelNames = nameGroups
            .selectAll('.label-name')
            .data(  ( data: { name: string, values: number[] } ) =>  [data.name] )
            .join( 
                (enter: any) => enter
                            .append('text')  
                            .attr('class', 'label-name')
                            .attr('y', this.verticalScale.bandwidth() / 2 )
                            .attr('alignment-baseline', 'middle')
                            .text( ( label: string ) => label ),
                (update: any) => update
                            .text( ( label: string ) => label ),
                (exit: any) => exit.remove()
        )  

    }




}