function setup_collapse() {
  $('.collapse').each(function(idx) {
    collapser = $(this);
    toggler = collapser.prev();
    toggler.wrapInner('<a class="toggleheader" href="#">');
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

function asame(a1, a2) {
  if (a1.length != a2.length) {
    return false;
  }
  for (i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}

function set_special_topline() {
  COLUMBIA_ADMIT = [3, 29];
  BOAT_RACE = [3, 31];
  today_date = new Date();
  today = [today_date.getMonth()+1, today_date.getDate()];
  if (asame(today, COLUMBIA_ADMIT)) {
    $('html').css('border-color', '#75B2DD');
  } else if (asame(today, BOAT_RACE)) {
    $('html').css('border-color', '#A3C1AD');
  }
}

$(document).ready(function() {
  set_special_topline();
  setup_collapse();
});
