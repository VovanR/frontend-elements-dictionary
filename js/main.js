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

    /**
     * @param {String} link
     */
    function renderExample(link) {
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
    function initialize() {
        $list = $('#dictionary-list');
        $example = $('#dictionary-example');
        $sample = $('#dictionary-sample');

        $list.html(marked(readmeTemplate));
        $list.on('click', 'ul a', function (e) {
            renderExample($(this).attr('href'));

            e.preventDefault();
        });

        // Show first example on page load
        $list.find('ul a:first').trigger('click');
    }

    return {
        initialize: initialize,
    };

});
