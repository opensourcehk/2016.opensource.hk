!function () {
  'use strict';
  // if on frontpage
  if (location.pathname == "/") {
    var $navbar = $('.navbar');
    $navbar.affix({
      offset: {
        top: $('.jumbotron').height() + $navbar.height()
      }
    });
  }

  var
    footerFix = $('<div></div>')
      .css({
        'position': 'fixed',
        'bottom': 0,
        'width': '100%',
        'background': '#f2f2f2',
        'font-size': '12px',
        'line-height': '20px',
        'text-align': 'center',
        'z-index': 1000
      })
      .text(
        'This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 Hong Kong License.' +
        'Logos and trademarks belong to their respective owners.');

  $(document.body).append(footerFix);
}(window.jQuery);