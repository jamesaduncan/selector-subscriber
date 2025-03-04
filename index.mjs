self._selectorReg = {};

class SelectorSubscriber {

    static contentHasLoaded = false;

    static {
        const observer = new MutationObserver( function( mutationList, observer ) {
            const registry  = self._selectorReg;
            const selectors = Object.keys( self._selectorReg );
            for ( const mutation of mutationList ) {
                if ( mutation.addedNodes.length > 0 ) {
                    mutation.addedNodes.forEach( (node) => {
                        for ( const selector of selectors ) {                            
                            if (node.matches && node.matches( selector )) {
                                for ( const cb of registry[ selector ] ) {
                                    cb( node, selector );
                                }      
                            }
                        }
                    });
                }
            }
        });
        observer.observe(document.querySelector('body').parentNode, { childList: true, subtree: true });
    }

    static customElementRoots () {
        const customElements = Array.from( document.getElementsByTagName('*') ).filter( (e) => {        
            return !!self.customElements.get(e.nodeName.toLowerCase());
        });
        return customElements.map( e => e.shadowRoot );        
    }

    static subscribe ( selector, callback ) {
        const registry = self._selectorReg;
        if ( registry[ selector ] ) {
            registry[ selector ].push( callback );
        } else {
            registry[ selector ] = [ callback ];
        }

        /* whenever a selector is subscribed to, we need to check and see if a match is already going */
        const shadows = this.customElementRoots();
        const nodes = Array.from( [document, ...shadows].map( e => Array.from( e.querySelectorAll( selector ) ) ) ).flat();
        for ( const node of nodes ) {
            for ( const cb of registry[ selector ] ) {
                cb( node, selector );
            }      
        }
    };    

}



export default SelectorSubscriber;