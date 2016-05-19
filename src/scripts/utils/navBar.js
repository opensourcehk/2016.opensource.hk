'use strict';

import TicketButton from '../apps/TicketButton';
import { render } from 'react-dom';

export default function () {

  !function () {
    let $navbar = $('.navbar-front');
    if ($navbar.length === 0) return;
    let drop = $('#navbar-collapse', $navbar);
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


    render(<TicketButton />, document.getElementById('ticket'));
  }(jQuery);
}