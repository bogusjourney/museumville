
/**
* MuseumVille Page Handlers
*/
var pageHandlers = {

  index: exhibitHandler,

  exhibit: exhibitHandler,

  search: function () {

    $('.itemlist > li > a[href]').click(function () {
      var $it = $(this);
      var exhibitSlug = window.parent.location.pathname;
      if (exhibitSlug == window.location.pathname) {
        exhibitSlug = prompt('Add to exhibit:', "/bill/exhibit/0");
      }
      if (exhibitSlug) {
        var item = {
          subject: $it.attr('href'),
          label: {"en": $('span', $it).text()},
          thumbnail: $('img', $it).attr('src')
        };
        $.post(exhibitSlug, item, function (data) {
          window.parent.location.reload();
        });
      }
      return false;
    });

  }

};

$(function() {
  $('.editable').inlineEdit({
    buttons: ""
  });
});

function exhibitHandler() {

    $("a[rel=lightbox]").fancybox({
      height: 500,
      width: 700,
      type: "iframe",
      showNavArrows: false,
      scrolling: "no",
      autoDimensions: false
    });

}

$(function () {
  var pageId = $('body').attr('id');
  var pageHandler = pageHandlers[pageId];
  if (pageHandler) { pageHandler(pageId); }
});

