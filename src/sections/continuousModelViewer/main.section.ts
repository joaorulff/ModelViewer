// utils
import { ChartUtils } from "../../utils/chart.utils";

// constants
import { CONTINUOUSMAINSECTIONMARGINS } from "../../constants/chart-constants";

// interfaces
import { IContinuosModelData } from "../../interfaces/interfaces";

// external
import * as d3 from 'd3';

export class MainSection {

    // elements
    private group!: d3.Selection<any, any, any, any>;

    private width!: number;
    private height!: number;

    // scales
    private verticalScale!: d3.ScaleLinear<any, any>;
    private horizontalScale!: d3.ScaleLinear<any,any>;
    private lineColorScale!: d3.ScaleOrdinal<any, any>;    

    // axes
    private leftAxis: any;
    private bottomAxis: any;

    constructor(){}

    public initialize_section( svg: d3.Selection<any, any, any, any> ): void {

        // // calculating section width
        this.width = parseInt( svg.attr('width') ) - CONTINUOUSMAINSECTIONMARGINS.left - CONTINUOUSMAINSECTIONMARGINS.right;
        this.height = parseInt( svg.attr('height') ) - CONTINUOUSMAINSECTIONMARGINS.top - CONTINUOUSMAINSECTIONMARGINS.bottom;

        // adding section group
        this.group = ChartUtils.create_group( svg, { top: CONTINUOUSMAINSECTIONMARGINS.top, left: CONTINUOUSMAINSECTIONMARGINS.left, bottom: 0, right: 0 } );
        this.leftAxis = ChartUtils.create_group( svg, { top: CONTINUOUSMAINSECTIONMARGINS.top, left: CONTINUOUSMAINSECTIONMARGINS.left - 5, bottom: 0, right: 0 } );
        this.bottomAxis = ChartUtils.create_group( svg, { top: this.height + CONTINUOUSMAINSECTIONMARGINS.top + 10, left: CONTINUOUSMAINSECTIONMARGINS.left, bottom: 0, right: 0 } )
        
    }

    private update_scales( data: IContinuosModelData['ids'] ): void {


        const values: { step: number, timestamp: number }[] = Object.values(data).flat();

        const yValues: number[] | [undefined, undefined] = d3.extent( values, ( (entry: {step: number, timestamp: number}) => entry.step ) );
        const xValues: number[] | [undefined, undefined] = d3.extent( values, ( (entry: {step: number, timestamp: number}) => entry.timestamp ));

        this.verticalScale = d3.scaleLinear().domain( <number[]>yValues ).range( [this.height, 0] )
        this.horizontalScale = d3.scaleLinear().domain( <number[]>xValues ).range( [0, this.width] );
        this.lineColorScale = d3.scaleOrdinal( d3.schemeCategory10 ).domain(Object.keys(data));

    }

    private update_axes( data: IContinuosModelData['ids'] ): void {

        const values: { step: number, timestamp: number }[] = Object.values(data).flat();
        const timeExtent: number[] | [undefined, undefined] = d3.extent( values, ( entry: { step: number, timestamp: number } ) => entry.timestamp );
        const steps: number[] = Array.from( new Set( values.map( d => d.step )) );

        this.leftAxis.call( 
            d3.axisLeft( this.verticalScale ).tickValues(steps).tickFormat( (step: any) => {
                return 'Step ' + `${step}`.split('.')[0];
            })    
        )
        .attr('stroke-width', 0)
        .attr('font-family', 'Open Sans regular', 'Open Sans')
        .attr('font-size', `16px`)
        .attr('color', '#636363')

        this.bottomAxis.call( 
            d3.axisBottom( this.horizontalScale ).tickFormat( (miliseconds: any) => { 
                   
                const totalSeconds: number = (miliseconds - <number>timeExtent[0]) / 1000;
                const minutes: number = Math.floor( totalSeconds/60 );
                const seconds: number = totalSeconds % 60;

                return `${minutes}m${seconds.toFixed(0)}s`;
        
        }).ticks(4))
        .attr('stroke-width', 0.5)
        .attr('font-family', 'Open Sans regular', 'Open Sans')
        .attr('font-size', `12px`)
        .attr('color', '#636363');

    }

    public update( data: IContinuosModelData['ids'], selectedTimestamp: number | null, callbacks: { [callbackName: string]: any } ): void {

        // updating scales
        this.update_scales( data );

        // update axes
        this.update_axes( data );

        // creating line generator
        const line = d3.line()
            .x( (d: any) => this.horizontalScale(d.timestamp) )
            .y( (d: any) => <number>this.verticalScale(d.step) )
            .curve(d3.curveBumpX);

        // appending line groups
        const lineGroups = this.group
            .selectAll('.line-group')
            .data( Object.keys( data ) )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'line-group')
                    .attr('transform', ( id: string, index: number ) => 'translate(' + 0 + ',' + 0 + ')' )
                    .attr('fill', ( id: string, index: number ) => this.lineColorScale(id) )
                    .attr('stroke', ( id: string, index: number ) => this.lineColorScale(id) ),
                (update: any) => update
                    .attr('fill', ( id: string, index: number ) => this.lineColorScale(id) )
                    .attr('stroke', ( id: string, index: number ) => this.lineColorScale(id) ),
                (exit: any) => exit.remove()
        )

        // appending points
        const lines = lineGroups
            .selectAll('.line')
            .data( ( lineID: string ) =>  [data[lineID]] )
            .join(
                (enter: any) => enter.append('path')
                    .attr('class', 'line')
                    .attr("d", ( entries: any ) => line( entries ))
                    .attr("fill", "none")
                    .attr("stroke-width", 1.5)
                    .attr('opacity', ( id: string, index: number ) => {
                        if( selectedTimestamp ) return 0.3;
                        return 0.7;
                    } ),
                (update: any) => update
                    .attr("d", ( entries: any ) => line( entries ))
                    .attr('opacity', ( id: string, index: number ) => {
                        if( selectedTimestamp ) return 0.3;
                        return 0.7;
                    } ),
                (exit: any) => exit.remove()
            )

        this.update_steps( lineGroups, data, selectedTimestamp, callbacks );
    }


    private update_steps( groups: d3.Selection<any, any, any, any>, data: IContinuosModelData['ids'], selectedTimestamp: number | null, callbacks: { [callbackName: string]: any } ): void {

        // appending points
        const idPoints = groups
            .selectAll('.step-point')
            .data( ( lineID: string ) =>  data[lineID] )
            .join(
                (enter: any) => enter.append('circle')
                    .attr('class', 'step-point')
                    .attr('cx', ( entry: { step: number, timestamp: number } ) => this.horizontalScale( entry.timestamp ))
                    .attr('cy', ( entry: { step: number, timestamp: number } ) => this.verticalScale( entry.step ) )
                    .attr('r', 2)
                    .attr('opacity', ( entry: { step: number, timestamp: number } ) => this.pick_opacity( entry.timestamp, selectedTimestamp ) )
                    .style('cursor', 'pointer')
                    .on('mouseover', ( event: MouseEvent, value: { timestamp: number, step: number, error: boolean }, index: number, a: any ) => {
                        this.fire_callback( 'mouseover', callbacks, value.timestamp ) 
                    })
                    .on('mouseout', ( event: MouseEvent, value: { timestamp: number, step: number, error: boolean }, index: number, a: any ) => {
                        this.fire_callback( 'mouseout', callbacks, null ) 
                        }),
                (update: any) => update
                    .attr('opacity', ( entry: { step: number, timestamp: number } ) => this.pick_opacity( entry.timestamp, selectedTimestamp ) )    
                    .attr('cx', ( entry: { step: number, timestamp: number } ) => this.horizontalScale( entry.timestamp ))
                    .attr('cy', ( entry: { step: number, timestamp: number } ) => this.verticalScale( entry.step )),
                (exit: any) => exit.remove()
        ) 

    }

    private pick_opacity( pointTimestamp: number, selectedTimestamp: number | null ): number {

        if( selectedTimestamp === null || selectedTimestamp === undefined ){
            return 0.1;
        }

        if( selectedTimestamp === pointTimestamp ){
            return 1;
        }

        return 0;

    }

    private fire_callback( callbackName: string, callbacks: { [callbackName: string]: any }, index: number | null ): void {

        if( callbackName in callbacks ){
            callbacks[callbackName](index);
        }

    }


}