import * as d3 from 'd3';

export class ChartUtils {

    public static create_div( container: HTMLElement, zindex: number = 1 ): d3.Selection<any,any,any,any> {

        // container dimensions
        const width: number = container.clientWidth;
        const height: number = container.clientHeight;

        // creating svg
        return d3.select(container)
            .append('div')
            .attr('width', width)
            .attr('height', height)
            .style('z-index', zindex);
    }

    public static create_svg( container: HTMLElement, zindex: number = 1 ): d3.Selection<any,any,any,any> {

        // container dimensions
        const width: number = container.clientWidth;
        const height: number = container.clientHeight;

        // creating svg
        return d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('z-index', zindex);
    }

    public static create_group( svgselection: any, margins: { top: number, bottom: number, left: number, right: number } ){
        return svgselection.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
    }

    // scales
    public static create_linear_scale(domain: [any, any], range: [number, number]): d3.ScaleLinear<any, any> {
        return d3.scaleLinear().domain(domain).range(range);
    }
}