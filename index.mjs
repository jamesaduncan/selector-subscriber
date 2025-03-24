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
                            // we want to test the node and its children
                            let runWithNode;
                            if ( node.matches && node.matches( selector )) runWithNode = node;
                            else {
                                if ( node.querySelector && node.querySelector(selector )) runWithNode = node.querySelector( selector );
                            } 
                            

                            if ( runWithNode ) {
                                for ( const cb of registry[ selector ] ) {
                                    cb( runWithNode, selector );
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
        const shadows = this.customElementRoots() || [];
        const nodes = Array.from( [document, ...shadows].filter( e => !!e ).map( e => {
            const queryResults = e.querySelectorAll( selector );
            return Array.from( queryResults );
        }) ).flat();
        for ( const node of nodes ) {
            for ( const cb of registry[ selector ] ) {
                cb( node, selector );
            }      
        }
    };    

}



export default SelectorSubscriber;