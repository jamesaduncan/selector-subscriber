self._selectorReg = {};

class SelectorSubscriber {

    static {
        document.addEventListener('DOMContentLoaded', async() => {
            const registry = self._selectorReg;    
        
            const customElements = Array.from( document.getElementsByTagName('*') ).filter( (e) => {        
                return !!self.customElements.get(e.nodeName.toLowerCase());
            });
            const shadows = customElements.map( e => e.shadowRoot );
        
            const selectors = Object.keys( self._selectorReg );
            for ( const selector of selectors ) {
                const nodes = Array.from( [document, ...shadows].map( e => Array.from( e.querySelectorAll( selector ) ) ) ).flat();
                for ( const node of nodes ) {
                    for ( const cb of registry[ selector ] ) {
                        cb( node, selector );
                    }      
                }    
            }
            
            const observer = new MutationObserver( function( mutationList, observer ) {
                const registry  = self._selectorReg;
                const selectors = Object.keys( self._selectorReg );
                for ( const mutation of mutationList ) {
                    if ( mutation.addedNodes.length > 0 ) {
                        mutation.addedNodes.forEach( (node) => {
                            for ( const selector of selectors ) {
                                if (node.matches( selector )) {
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
        });        
    }

    static subscribe ( selector, callback ) {
        const registry = self._selectorReg;
        if ( registry[ selector ] ) {
            registry[ selector ].push( callback );
        } else {
            registry[ selector ] = [ callback ];
        }
    };    

}



export default SelectorSubscriber;