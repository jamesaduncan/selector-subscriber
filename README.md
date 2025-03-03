# selector-subscriber

This little module allows you to subscribe to selectors in your document, so if
the situation occurs that a DOM element appears that matches your selector subscription,
then your code gets executed.

      document.registerSelector('p', ( aParagraphElement ) => {
          /* ... gets called for every paragraph element in your document, now or in the future ... */
      });



