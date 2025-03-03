self._selectorReg = {};

function registerSelector ( selector, callback ) {
    const registry = self._selectorReg;
    if ( registry[ selector ] ) {
        registry[ selector ].push( callback );
    } else {
        registry[ selector ] = [ callback ];
    }
};

document.addEventListener('DOMContentLoaded', async() => {
    const registry = self._selectorReg;    
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
                        if ( !node.querySelectorAll ) break;
                        const nodes = node.querySelectorAll( selector );                        
                        for ( const cbnode of nodes ) {
                            for ( const cb of registry[ selector ] ) {
                                cb( cbnode, selector );
                            }      
                        }	     
                    }
                });
            }
        }
    });
    
    observer.observe(document.querySelector('body').parentNode, { childList: true, subtree: true });
});


export default registerSelector;