function setup() {
  $('.collapse').each(function(idx) {
    collapser = $(this);
    toggler = collapser.prev();
    toggler.wrapInner('<a href="#">');
    toggle_marker = $('<span class="togglemarker"></span>');
    toggle_marker.appendTo(toggler);
    toggler.click(function() {
      collapser.toggle();
      if (toggle_marker.hasClass('closed')) {
        toggle_marker.html(' &blacktriangledown;');
        toggle_marker.removeClass('closed');
        localStorage['closed'] = 'false';
      } else {
        toggle_marker.html(' &blacktriangleright;');
        toggle_marker.addClass('closed');
        localStorage['closed'] = 'true';
      }
      return false;
    });
    if (localStorage['closed'] === undefined) {
      localStorage['closed'] = 'true';
    }
    if (localStorage['closed'] === 'true') {
      toggle_marker.html(' &blacktriangleright;');
      toggle_marker.addClass('closed');
      collapser.hide();
    } else {
      toggle_marker.html(' &blacktriangledown;');
    }
  });
}

$(document).ready(function() {
  setup();
});
