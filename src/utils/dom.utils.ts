export class DOMUtils {

    /*
    *   
    * 
    */

    public static append_div( height: number, container: HTMLDivElement ): HTMLDivElement {

        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = `${height}px`;
        
        container.append( wrapper );

        return wrapper;
    }

    public static add_scrollable_wrapper( container: HTMLDivElement ): HTMLDivElement {
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';

        const scrollableWrapper = document.createElement('div');
        scrollableWrapper.style.position = 'absolute';
        scrollableWrapper.style.width = '100%';
        scrollableWrapper.style.height = '100%';
        scrollableWrapper.style.top = '0px';
        scrollableWrapper.style.left = '0px';
        scrollableWrapper.style.overflowY = 'scroll';


        // appending
        container.append( wrapper );
        wrapper.append( scrollableWrapper );

        return scrollableWrapper;

    }
}