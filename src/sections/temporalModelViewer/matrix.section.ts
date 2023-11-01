// constaints
import { TEMPORALMATRIXSECTIONMARGINS } from "../../constants/chart-constants";

// interfaces
import { IData, ITemporalData } from "../../interfaces/interfaces";

// utils
import { ChartUtils } from "../../utils/chart.utils";

// external
import * as d3 from 'd3';

export class MatrixSection {

    // section group
    private group!: d3.Selection<any, any, any, any>;

    // axis group
    // private axisGroup!: d3.Selection<any, any, any, any>;
    // private localMargin: number = 5;

    private timeAxisGroup!: d3.Selection<any, any, any, any>;
    private idAxisGroup!: d3.Selection<any, any, any, any>;

    private width!: number;
    private height!: number;

    // scales
    private verticalScale!: d3.ScaleBand<any>;
    private horizontalScale!: d3.ScaleLinear<any,any>;
    private colorScale!: d3.ScaleOrdinal<any,any>;

    public initialize_section( svg: d3.Selection<any, any, any, any> ): void {
        
        // calculating section width
        this.width = parseInt(svg.attr('width')) - TEMPORALMATRIXSECTIONMARGINS.left - TEMPORALMATRIXSECTIONMARGINS.right;
        this.height = parseInt( svg.attr('height')) - TEMPORALMATRIXSECTIONMARGINS.bottom - TEMPORALMATRIXSECTIONMARGINS.top;

        // adding section group
        this.group = ChartUtils.create_group( svg, { top: TEMPORALMATRIXSECTIONMARGINS.top, left: TEMPORALMATRIXSECTIONMARGINS.left, bottom: 0, right: 0 } );

        // axes groups
        this.timeAxisGroup = ChartUtils.create_group( svg, { top: this.height + TEMPORALMATRIXSECTIONMARGINS.top, left: TEMPORALMATRIXSECTIONMARGINS.left, bottom: 0, right: 0 } );
        this.idAxisGroup = ChartUtils.create_group( svg, { top: TEMPORALMATRIXSECTIONMARGINS.top, left: TEMPORALMATRIXSECTIONMARGINS.left, bottom: 0, right: 0 } );
    }

    private update_scales( data: { [label: string | number]: { value: string | number, timestamp: number}[] } ): void {

        const timeExtent: number[] | [undefined, undefined] = d3.extent( Object.values(data).flat(), ( row: {value: string | number, timestamp: number } ) => row.timestamp );
        
        this.verticalScale = d3.scaleBand().domain( Object.keys( data ) ).range( [0, this.height] ).paddingInner(0.1);
        this.horizontalScale = d3.scaleLinear().domain( <number[]>timeExtent ).range( [0, this.width] );

        const labels: string[] = Array.from( new Set(Object.values(data).flat().map( (entry: any) => entry.value )) )
        this.colorScale = d3.scaleOrdinal( d3.schemeCategory10 ).domain(labels);

    }

    private update_axes( data: { [label: string | number]: { value: string | number, timestamp: number}[] } ): void {

        const timeExtent: number[] | [undefined, undefined] = d3.extent( Object.values(data).flat(), ( row: {value: string | number, timestamp: number } ) => row.timestamp );

        this.timeAxisGroup.call(
            d3.axisBottom( this.horizontalScale ).tickFormat( (miliseconds: any) => { 
                   
                const totalSeconds: number = (miliseconds - <number>timeExtent[0]) / 1000;
                const minutes: number = Math.floor( totalSeconds/60 );
                const seconds: number = totalSeconds % 60;

                return `${minutes}m${seconds.toFixed(2)}s`;
        
        }).ticks(4));

        this.idAxisGroup.call( d3.axisLeft(this.verticalScale ) );

    }

    public update( data: { [label: string | number]: { value: string | number, timestamp: number}[] }, selectedTimestamp: number | null, callbacks: { [callbackName: string]: any } ): void {

        // updating scales
        this.update_scales( data );

        // updating axis
        this.update_axes( data );

        // appending row groups
        const rowGroups = this.group
            .selectAll('.row-group')
            .data( Object.keys( data ) )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'row-group')
                    .attr('transform', ( row: string, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row ) + ')' ),
                (update: any) => update.attr('transform', ( row: string, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row ) + ')' ),
                (exit: any) => exit.remove()
            )

        // appending cells
        const cells = rowGroups
            .selectAll('.cell')
            .data(  ( rowIndex: any ) => data[rowIndex] )
            .join( 
                (enter: any) => enter.append('rect')
                        .attr('class', 'cell')
                        .attr('x', ( value: {value: string | number, timestamp: number }, index: number ) => {
                            return this.horizontalScale( value.timestamp );
                        })
                        .attr('y', 0 )
                        .attr('fill', ( value: {value: string | number, timestamp: number }, index: number ) => {
                            return this.colorScale( value.value );
                        })
                        .attr('width', 2 )
                        .attr('height', this.verticalScale.bandwidth() )
                        .attr('opacity', ( value: {value: string | number, timestamp: number }, index: number ) => this.pick_opacity( value.timestamp, selectedTimestamp ))
                        .style('cursor', 'pointer')
                        .on( 'mouseover', ( event: MouseEvent, value: {value: string | number, timestamp: number }, index: number, a: any ) => { 
                            this.fire_callback( 'mouseover', callbacks, value.timestamp );
                        })
                        .on( 'mouseout', ( event: MouseEvent, value: {value: string | number, timestamp: number }, index: number, a: any ) => { 
                            this.fire_callback( 'mouseout', callbacks, null );
                        }),
                (update: any) => update
                        .attr('fill', ( value: {value: string | number, timestamp: number }, index: number ) => {
                            return this.colorScale(value.value)    
                        })
                        .attr('x', ( value: {value: string | number, timestamp: number }, index: number ) => this.horizontalScale( value.timestamp ) )
                        .attr('height', this.verticalScale.bandwidth() )
                        .transition(100)
                        .attr('opacity', ( value: { value: string | number, timestamp: number }, index: number ) => this.pick_opacity(value.timestamp, selectedTimestamp) ),
                (exit: any) => exit.remove()
            )
    }


    private fire_callback( callbackName: string, callbacks: { [callbackName: string]: any }, timestamp: number | null ): void {

        if( callbackName in callbacks ){
            callbacks[callbackName](timestamp);
        }

    }

    private pick_opacity( cellTimestamp: number, selectedTimestamp: number | null ): number {

        if( selectedTimestamp === null || cellTimestamp === undefined ){
            return 0.5;
        }

        if( selectedTimestamp === cellTimestamp ){
            return 1;
        }

        return 0.1;

    }

}