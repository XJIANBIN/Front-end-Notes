;
(function(global, $, undefined) {
    "use strict"
    var _global,
        dropFlower = {};
    var snowflakeURl = [
        'http://static.mukewang.com/img/55adde120001d34e00410041.png',
        'http://static.mukewang.com/img/55adde2a0001a91d00410041.png',
        'http://static.mukewang.com/img/55adde5500013b2500400041.png',
        'http://static.mukewang.com/img/55adde62000161c100410041.png',
        'http://static.mukewang.com/img/55adde7f0001433000410041.png',
        'http://static.mukewang.com/img/55addee7000117b500400041.png'
    ]


    ///////
    //飘雪花 //
    ///////
    dropFlower.snowflake = function() {
        // 雪花容器
        var $flakeContainer = $('#snowflake');

        // 随机六张图
        function getImagesName() {
            return snowflakeURl[[Math.floor(Math.random() * 6)]];
        }
        // 创建一个雪花元素
        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll');
        }
        // 开始飘花
        setInterval(function() {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1,
                endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity: randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            // setTimeout(function() {
            //     $flake.css({
            //         'top': endPositionTop,
            //         'left': endPositionLeft,
            //         'transition': 'top ' + duration + 'ms ease-out, left ' + duration + 'ms ease-out'
            //     });

            //     $flake.on('transitionend', function() {
            //         $(this).remove();
            //     })
            // }, 16)



            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            });

        }, 200);
    }



    // 最后将插件对象暴露给全局对象
    _global = (function() { return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = dropFlower;
    } else if (typeof define === "function" && define.amd) {
        define(function() { return dropFlower; });
    } else {
        !('dropFlower' in _global) && (_global.dropFlower = dropFlower);
    }

}(window, jQuery));