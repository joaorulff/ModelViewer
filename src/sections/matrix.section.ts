// constaints
import { LABELSECTIONWIDTHRATIO, MATRIXSECTIONMARGINS, MATRIXSECTIONWIDTHRATIO } from "../constants/chart-constants";

// interfaces
import { IData } from "../interfaces/interfaces";

// utils
import { ChartUtils } from "../utils/chart.utils";

// external
import * as d3 from 'd3';

export class MatrixSection {

    // section group
    private group!: d3.Selection<any, any, any, any>;

    // axis group
    private axisGroup!: d3.Selection<any, any, any, any>;
    private localMargin: number = 5;

    private width!: number;
    private height!: number;

    // scales
    private verticalScale!: d3.ScaleBand<any>;
    private horizontalScale!: d3.ScaleLinear<any,any>;
    private colorScale!: d3.ScaleSequential<any,any>;
    private timeScale!: d3.ScaleLinear<any,any>;

    public initialize_section( svg: d3.Selection<any, any, any, any> ): void {
        
        // calculating section width
        this.width = (parseInt( svg.attr('width') )*MATRIXSECTIONWIDTHRATIO) - MATRIXSECTIONMARGINS.left - MATRIXSECTIONMARGINS.right;
        this.height = parseInt( svg.attr('height') ) - MATRIXSECTIONMARGINS.top - MATRIXSECTIONMARGINS.bottom;

        // adding section group
        const groupLeft: number = parseInt( svg.attr('width') )*LABELSECTIONWIDTHRATIO;
        this.group = ChartUtils.create_group( svg, { top: MATRIXSECTIONMARGINS.top, left: groupLeft, bottom: 0, right: 0 } );
        this.axisGroup = ChartUtils.create_group( svg, { top: this.height + MATRIXSECTIONMARGINS.top + this.localMargin, left: groupLeft, bottom: 0, right: 0 } )

    }

    private update_scales( data: IData ): void {

        const labels: string[] = data.labels.map( 
            ( label: { name: string, values: number[], confidence: number, coverage: number } ) => label.name );
        
        this.verticalScale = d3.scaleBand().domain( labels ).range( [0, this.height] ).paddingInner(0.1);
        this.horizontalScale = d3.scaleLinear().domain( [0, data.labels[0].values.length] ).range( [0, this.width] );
        this.colorScale = d3.scaleSequential( d3.interpolateBlues ).domain([0,1]);

    }

    private update_axis( data: IData, timeExtent: number[] = [] ): void {

        if( timeExtent.length !== 0 ){
            this.timeScale = d3.scaleLinear().domain( timeExtent ).range( [0, this.width] );
            this.axisGroup.call( 
                d3.axisBottom(this.timeScale ).tickFormat( (miliseconds: any) => { 
                   
                    const totalSeconds: number = miliseconds / 1000;
                    const minutes: number = Math.floor( totalSeconds/60 );
                    const seconds: number = totalSeconds % 60;

                    return `${minutes}m${seconds}s`;

            }));
        }

    }

    public update( data: IData, selectedIndex: number | null, timeExtent: number[] = [], callbacks: { [callbackName: string]: any } ): void {

        // updating scales
        this.update_scales( data );

        // updating axis
        this.update_axis( data, timeExtent );

        // appending row groups
        const rowGroups = this.group
            .selectAll('.row-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'row-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row.name ) + ')' ),
                (update: any) => update.attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row.name ) + ')' ),
                (exit: any) => exit.remove()
            )

        // appending cells
        const cells = rowGroups
                .selectAll('.cell')
                .data(  ( data: { name: string, values: number[] } ) => data.values.map( (value: number, index: number) => { return { value, index } } ) )
                .join( 
                    (enter: any) => enter.append('rect')
                            .attr('class', 'cell')
                            .attr('x', ( value: {value: number, index: number}, index: number ) => this.horizontalScale(index) )
                            .attr('y', 0 )
                            .attr('fill', ( value: {value: number, index: number}, index: number ) => this.colorScale(value.value) )
                            .attr('width', this.horizontalScale(1) - this.horizontalScale(0) )
                            .attr('height', this.verticalScale.bandwidth() )
                            .attr('opacity', ( value: {value: number, index: number}, index: number ) => this.pick_opacity(index, selectedIndex) )
                            .style('cursor', 'pointer')
                            .on( 'mouseover', ( event: MouseEvent, value: {value: number, index: number}, index: number, a: any ) => { 
                                this.fire_callback( 'mouseover', callbacks, value.index );
                            })
                            .on( 'mouseout', ( event: MouseEvent, value: {value: number, index: number}, index: number, a: any ) => { 
                                this.fire_callback( 'mouseout', callbacks, null );
                            }),
                    (update: any) => update
                            .attr('fill', ( value: {value: number, index: number}, index: number ) => this.colorScale(value.value) )
                            .attr('x', ( value: {value: number, index: number}, index: number ) => this.horizontalScale(index) )
                            .attr('width', this.horizontalScale(1) - this.horizontalScale(0) )
                            .transition(100)
                            .attr('opacity', ( value: {value: number, index: number}, index: number ) => this.pick_opacity(index, selectedIndex) ),
                    (exit: any) => exit.remove()
                )
    }


    private fire_callback( callbackName: string, callbacks: { [callbackName: string]: any }, index: number | null ): void {

        if( callbackName in callbacks ){
            callbacks[callbackName](index);
        }

    }

    private pick_opacity( cellIndex: number, selectedIndex: number | null ): number {

        if( selectedIndex === null || selectedIndex === undefined ){
            return 1;
        }

        if( selectedIndex === cellIndex ){
            return 1;
        }

        return 0.2;

    }

}