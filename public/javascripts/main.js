
/**
* MuseumVille Page Handlers
*/
var pageHandlers = {

  exhibit: function () {

    $("a[rel=lightbox]").fancybox({
      height: 500,
      width: 700,
      type: "iframe",
      showNavArrows: false,
      scrolling: "no",
      autoDimensions: false
    });

  },

  search: function () {

    $(function () {
      $('.itemlist > li > a[href]').click(function() {
        var $it = $(this);
        // TODO: user from session...
        var exhibitSlug = prompt('Add to exhibit:', "/ted/exhibit/0");
        if (exhibitSlug) {
          var item = {
            subject: $it.attr('href'),
            label: {"en": $('span', $it).text()},
            thumbnail: $('img', $it).attr('src')
          };
          $.post(exhibitSlug, item, function () {}, "json");
        }
        return false;
      });
    });

  }

};

$(function () {
  var pageId = $('body').attr('id');
  var pageHandler = pageHandlers[pageId];
  if (pageHandler) { pageHandler(pageId); }
});

