/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
  "use strict";

  $(function(){

    var $document = $(document);
    var $body = $(document.body);
    var $content = $('.content', $body);

    function pageInit() {
      $(".post-content").fitVids();

      // Calculates Reading Time
      $('.post-content').readingTime({
        readingTimeTarget: '.post-reading-time',
        wordCountTarget: '.post-word-count',
      });

      // Creates Captions from Alt tags
      $(".post-content img").each(function() {
        // Let's put a caption if there is one
        if($(this).attr("alt")) {
          $(this).wrap('<figure class="image"></figure>')
          .after('<figcaption>'+$(this).attr("alt")+'</figcaption>');
        }
      });
    };

    pageInit();

    // PJax bindings
    // =================
    if ($.support.pjax) {
      $document.on('pjax:start', function() {
        NProgress.start();
        $body.scrollTop(0);
      });

      $document.on('pjax:end', function() {
        pageInit();
        if(typeof ga === 'function') {
          ga('set', 'location', window.location.href);
          ga('send', 'pageview');
        }

        if(typeof DISQUS === 'object' && $('#disqus_thread').length) {
          DISQUS.reset({
            reload: true,
            config: function () {
              this.page.identifier = disqus_identifier;
            }
          });
        }

        if(typeof DISQUSWIDGETS === 'object') {
          DISQUSWIDGETS.getCount();
        }

        $('[data-load-image]', $content).each(function() {
          //ImageLoader.load($(this));
        });

        NProgress.done();
      });

      var _pjaxOptions = {
        container: '[data-pjax-container]',
        fragment: '[data-pjax-container]'
      };

      $document.pjax('a[data-pjax]', _pjaxOptions);

      $document.on('submit', 'form[data-pjax]', function(e) {
        $.pjax.submit(e, _pjaxOptions);
      });
    }

  });

}(jQuery));
