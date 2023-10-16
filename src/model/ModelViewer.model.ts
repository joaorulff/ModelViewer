import { IData } from "../interfaces/interfaces";
import * as d3 from 'd3';
import { ChartUtils } from "../utils/chart.utils";
import { METAWIDTH, ROWHEIGHT, TEXTWIDTH } from "../constants/chart-constants";


export class ModelViewer {

    // scales
    public verticalScale!: d3.ScaleBand<any>;
    public horizontalScale!: d3.ScaleLinear<any, any>;
    public colorScale!: d3.ScaleSequential<any>;
    public metaScale!: d3.ScaleLinear<any, any>;

    // elements
    public svg!: d3.Selection<any,any,any,any>;

    // groups
    
    constructor( public container: HTMLDivElement ) {

        if( !this.svg ) this.initialize_chart();
    }

    private initialize_chart(): void {
        this.svg = ChartUtils.create_svg( this.container );
    }

    public update( data: IData ): void {

        // calculate scales
        this.verticalScale = d3.scaleBand()
            .domain( data.labels.map( entry => entry.name  ) )
            .range( [0, this.container.offsetHeight] );

        this.horizontalScale = d3.scaleLinear()
            .domain( [0, data.labels[0].values.length] )
            .range( [0, this.container.offsetWidth - TEXTWIDTH - METAWIDTH ]);

        this.metaScale = d3.scaleLinear()
            .domain( [0, 1] )
            .range( [0, METAWIDTH/2 ]);

        this.colorScale = d3.scaleSequential( d3.interpolateBlues ).domain([0,1]);

        const cellSize: number = this.horizontalScale(1) - this.horizontalScale(0);
        const gap: number = 2;


        // this.update_meta_info( data );
        this.update_matrix( data, gap, cellSize );
        this.update_text_labels( data );
        this.update_meta_info( data );
        
    }

    private update_matrix( data: IData, gap: number, cellSize: number ): void {

        // appending row groups
        const rowGroups = this.svg
            .selectAll('.row-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'row-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + TEXTWIDTH + ',' + this.verticalScale( row.name ) + ')' ),
                (update: any) => update.attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + TEXTWIDTH + ',' + this.verticalScale( row.name ) + ')' ),
                (exit: any) => exit.remove()
            )

        // appending cells
        const cells = rowGroups
                .selectAll('.cell')
                .data(  ( data: { name: string, values: number[] } ) => data.values )
                .join( 
                    enter => enter.append('rect')
                            .attr('class', 'cell')
                            .attr('x', ( value: number, index: number ) => this.horizontalScale(index) )
                            .attr('y', 0)
                            .attr('fill', ( value: number, index: number ) => this.colorScale(value) )
                            .attr('width', cellSize - gap)
                            .attr('height', ROWHEIGHT),
                    (update: any) => update
                            .attr('fill', ( value: number, index: number ) => this.colorScale(value) )
                            .attr('x', ( value: number, index: number ) => this.horizontalScale(index) )
                            .attr('width', cellSize - gap)

                )
    }

    private update_meta_info( data: IData ): void {

        // appending name groups
        const metaGroups = this.svg
            .selectAll('.meta-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'meta-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + (this.container.offsetWidth - METAWIDTH)  + ',' + this.verticalScale( row.name ) + ')' ),
                (update: any) => update.attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + (this.container.offsetWidth - METAWIDTH)  + ',' + this.verticalScale( row.name ) + ')' ),
                (exit: any) => exit.remove()
        )

        const confidenceElements = metaGroups
                .selectAll('.confidence')
                .data(  ( data: { name: string, values: number[], coverage: number, confidence: number } ) =>  [data.confidence] )
                .join(
                    (enter: any) => enter
                        .append('rect')
                        .attr('class', 'confidence')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', ( value: number ) => this.metaScale( value ) )
                        .attr('height', ROWHEIGHT)
                        .attr('fill', ( value: number ) => this.colorScale( value ) ),
                    (update: any) => update
                        .attr('width', ( value: number ) => this.metaScale( value ) )
                        .attr('fill', ( value: number ) => this.colorScale( value ) ),
                    (exit: any) => exit.remove()
                )

        const coverageElements = metaGroups
            .selectAll('.coverage')
            .data(  ( data: { name: string, values: number[], coverage: number, confidence: number } ) =>  [data.coverage] )
            .join(
                (enter: any) => enter
                    .append('rect')
                    .attr('class', 'coverage')
                    .attr('x', METAWIDTH/2 )
                    .attr('y', 0)
                    .attr('width', ( value: number ) => this.metaScale( value ) )
                    .attr('height', ROWHEIGHT)
                    .attr('fill', ( value: number ) => this.colorScale( value ) ),
                (update: any) => update 
                    .attr('width', ( value: number ) => this.metaScale( value ) )
                    .attr('fill', ( value: number ) => this.colorScale( value ) ),
                (exit: any) => exit.remove()
            )

    }

    private update_text_labels( data: IData ): void {

        // appending name groups
        const nameGroups = this.svg
            .selectAll('.name-group')
            .data( data.labels )
            .join( 
                (enter: any) => enter
                    .append('g')
                    .attr('class', 'name-group')
                    .attr('transform', ( row: { name: string, values: number[] }, index: number ) => 'translate(' + 0 + ',' + this.verticalScale( row.name ) + ')' )
            )

        // appending name texts
        const labelNames = nameGroups
            .selectAll('.label-name')
            .data(  ( data: { name: string, values: number[] } ) =>  [data.name] )
            .join( 
                enter => enter.append('text')  
                            .attr('class', 'label-name')
                            .attr('y', ROWHEIGHT/2)
                            .attr('alignment-baseline', 'middle')
                            .text( ( label: string ) => label )
        )  


    }

}