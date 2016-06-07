'use strict';

var largeScreen = screen.width > 993;

export default function () {
  let $navbar = $('.navbar-front');
  if ($navbar.length === 0) return;
  let drop = $('#navbar-collapse', $navbar);
  if (!largeScreen)
    drop.removeClass('dropup');

  $navbar.affix({
    offset: {
      top: $('.jumbotron').height() + $navbar.height()
    }
  }).on('affixed.bs.affix', function () {
    if (largeScreen)
      drop.removeClass('dropup');
  }).on('affixed-top.bs.affix', function () {
    if (largeScreen)
      drop.addClass('dropup');
  });

  $(window).resize(function () {
    largeScreen = screen.width > 993;
  });
}
