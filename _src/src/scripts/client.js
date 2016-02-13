
// if on frontpage
if (location.pathname == "/") {
  $('.navbar').affix({
    offset: {
      top: $('.jumbotron').height()+$('.navbar').height()
    }
  });
}
