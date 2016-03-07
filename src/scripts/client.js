!function () {
  'use strict';
  var $navbar = $('.navbar-front'), drop = $('#navbar-collapse', $navbar);
  $navbar.affix({
    offset: {
      top: $('.jumbotron').height() + $navbar.height()
    }
  });
  $navbar.on('affixed.bs.affix', function () {
    drop.removeClass('dropup');
  });
  $navbar.on('affixed-top.bs.affix', function () {
    drop.addClass('dropup');
  });

}(window.jQuery);