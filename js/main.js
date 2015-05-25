require.config({
    paths: {
        jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        marked: 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min',
        text: 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text',
        hljs: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min',
    },
});

require(['app'], function (App) {

    'use strict';

    App.initialize();

});

define('app', [
    'jquery',
    'marked',
    'text!../README.md',
    'hljs',
], function (
    $,
    marked,
    readmeTemplate,
    hljs
) {

    'use strict';

    var $list;
    var $example;
    var $sample;
    var $panelExample;

    /**
     * @param {String} link
     */
    function renderExample(link) {
        window.location.hash = link;
        link = link.split('#L');
        var file = link[0];
        var line = link[1];

        require(['text!../' + file], function (fileTemplate) {
            $sample.html(fileTemplate);
            $example.html(hljs.highlight('html', fileTemplate).value)
        });
    }

    /**
     */
    function checkHash() {
        var hash = window.location.hash;
        hash = hash.slice(1);
        if (!hash) {
            return;
        }

        var isRendered = false;
        $list.find('a').each(function () {
            var href = $(this).attr('href');
            if (hash === href) {
                renderExample(href);
                isRendered = true;

                return false;
            }
        });

        return isRendered;
    }

    /**
     */
    function examplePanelReposition() {
        var offsetTop = 50; // header block height and margins
        var scrollTop = $(window).scrollTop() - offsetTop;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        $panelExample.css('marginTop', scrollTop + 'px');
    }

    /**
     */
    function initialize() {
        $list = $('#dictionary-list');
        $example = $('#dictionary-example');
        $sample = $('#dictionary-sample');
        $panelExample = $('.js-panel-example');

        $list.html(marked(readmeTemplate));
        $list.on('click', 'ul a', function (e) {
            examplePanelReposition();
            renderExample($(this).attr('href'));

            e.preventDefault();
        });

        // Show example from location hash
        if (!checkHash()) {
            // Show first example on page load
            $list.find('ul a:first').trigger('click');
        }
    }

    return {
        initialize: initialize,
    };

});
