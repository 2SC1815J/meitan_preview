// ==UserScript==
// @name        meitan_preview
// @description 東京大学明治新聞雑誌文庫所蔵検索システム検索結果サムネイルのプレビュー
// @author      2SC1815J
// @released    2017-05-21
// @license     MIT License
// @namespace   https://github.com/2SC1815J
// @homepageURL https://github.com/2SC1815J/meitan_preview
// @include     http://www.meitan.j.u-tokyo.ac.jp/*
// @require     https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @version     0.1.1
// ==/UserScript==

(function ($) {
    waitForKeyElements(
        '#resultList',
        resultListCallbackFunction
    );
    function resultListCallbackFunction() {
        var elems = document.evaluate(
            '//img[../../../@id="resultList"][../@class="pull-left"]',
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        for (var i = 0; i < elems.snapshotLength; i++) {
            var elem = elems.snapshotItem(i);
            var link = $('<a>').attr('href', elem.src).addClass('gm-preview');
            $(elem).wrapAll($(link));
        }
        $('a.gm-preview').hover(
            function (e) {
                var preview = $('<div>').attr('id', 'gm-preview').addClass('img-thumbnail').css({
                    'position': 'absolute',
                    'z-index': 9999,
                    'box-shadow': '0px 0px 5px #666666'
                });
                var preview_img = $('<img>').attr('src', this.href).css('max-width', '500px');
                var caption = $(this).parent().next('div').find('span.btn-link').text();
                var capttion_div = $('<div>').addClass('caption').text(caption);
                $(preview).append($(preview_img));
                $(preview).append($(capttion_div));
                $('body').append($(preview));

                var offsetX = 10;
                $('#gm-preview').css({
                    'top': $(window).scrollTop() + ($(window).height() - $('#gm-preview').height()) / 2,
                    'left': $(this).offset().left + $(this).width() + offsetX
                });
            },
            function () {
                $('#gm-preview').remove();
            }
        );
    }
})(jQuery);
