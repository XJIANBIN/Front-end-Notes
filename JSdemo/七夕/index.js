$(function() {

    var container = $("#content");
        visualWidth = container.width(),
        visualHeight = container.height();

    // 获取数据
    var getValue = function(className) {
        var $elem = $('' + className + '')
        // 走路的路线坐标
        return {
            height: $elem.height(),
            top: $elem.position().top
        };
    };
 
      // 检测动画监听事件
      var animationEnd = (function() {
            var explorer = navigator.userAgent;
            if (~explorer.indexOf('WebKit')) {
                return 'webkitAnimationEnd';
            }
            return 'animationend';
        })();

    //时间设置(时间毫秒）
    var setTime = {
        walkToThird  : 6000, //走第一段路，1/3屏幕宽度所用的时间，走完毕背景动
        walkToMiddle : 6500, //走第二段路，1/2屏幕宽度所用的时间，走到商店
        walkToEnd    : 6500, //走第三段路，走到桥
        
        walkTobridge : 2000, //上桥
        bridgeWalk   : 2000, //桥上走路到中间

        walkToShop   : 1000, //进商店时间
        walkOutShop  : 1000, //出商店时间
        
        openDoorTime : 800, //开门时间
        shutDoorTime : 500, //关门时间
        
        waitRotate   : 850,//男女等待转身的时间
        waitFlower   : 1200 //模拟取花的等待时间
    }

    //背景音乐
    var audio1 = Hmlt5Audio('./music/happy.wav');
    audio1.end(function() {
        Hmlt5Audio('./music/circulation.wav', true);
    })


    //背景音乐 

    function Hmlt5Audio(url, isloop) {
        var audio = new Audio(url);
        audio.autoPlay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function(callback) {
                audio.addEventListener('ended', function() {
                    callback();
                }, false);
            }
        };
    }

    var swipe = Swiper(container);

        function scrollTo(time, proportionX) {
            var disX = container.width() * proportionX;
            swipe.scrollTo(disX, time);
        }

    // 桥的Y轴
    var bridgeY = function() {
        var data = getValue('.c_background_middle');
        return data.top;
    }();

    // 修正小女孩位置
    var girl = {
        elem: $('.girl'),
        getHeight: function() {
            return this.elem.height();
        },
        getWidth: function() {
            return this.elem.width();
        },
        getOffset: function() {
            return this.elem.offset();
        },
        // 转身动作
        rotate: function() {
            this.elem.addClass('girl-rotate');
        },
        setOffset: function() {
            this.elem.css({
                left: $("#content").width() / 2,
                top: bridgeY - this.getHeight()
            });
        },
        rotate: function() {
            this.elem.addClass('girl-rotate');
        }
    }

    // 飞鸟动画
    var bird = {
        elem: $(".bird"),
        fly: function() {
            this.elem.addClass('birdFly');
            this.elem.css({
                'right': container.width(),
                'transition': 'right 15000ms linear'
            })
        }
    };

    //loge动画 
    var logo = {
        elem: $('.logo'),
        run: function() {
            this.elem.addClass('logolightSpeedIn')
                .on(animationEnd, function() {
                    $(this).addClass('logoshake').off();
                });
        }
    };


    var instanceX;
    /*
     * 小男孩走路接口
     * 
     */
    var boy = boyWalk();
    boy.walkTo(setTime.walkToThird, 0.6)
        .then(function() {
            //开始滚动页面
            scrollTo(setTime.walkToMiddle, 1)
            return boy.walkTo(setTime.walkToMiddle, 0.5)
        }).then(function() {
            //飞鸟
            bird.fly();
        }).then(function() {
            //暂停走路
            boy.stopWalk();
            //进入商店买花以及出来动画
            return BoyToShop(boy);
        }).then(function() {
            //修正小女孩的坐标
            girl.setOffset();
            //页面继续滚动到结束
            scrollTo(setTime.walkToEnd, 2);
            //人物往回走到1/10处
            return boy.walkTo(setTime.walkToEnd, 0.1);
        }).then(function() {
            //上桥//
            return boy.walkTo(setTime.walkTobridge, 0.25, (bridgeY - girl.getHeight()) / visualHeight)
        }).then(function() {
            var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
            //桥上走路
            return boy.walkTo(setTime.bridgeWalk, proportionX)
        }).then(function() {
            //复位初始状态
            boy.resetOriginal();
            //增加转身动作
            setTimeout(function() {
                girl.rotate();
                boy.rotate(function() {
                    //开始logo动画
                    logo.run();
                    //如果转身完毕
                     dropFlower.snowflake();
                })
            }, setTime.waitRotate)
        });

    function boyWalk() {
        var container = $('#content'),
            //页面可视区域
            visualWidth = container.width(),
            visualHeight = container.height();

        var swiper = Swiper(container);
        //获取元素位置
        var getLocationValue = function(className) {
            var $elem = $('.' + className + '');
            return {
                height: $elem.height(),
                top: $elem.position().top
            };
        }

        //获取路的中心轴位置
        var pathY = function() {
            var data = getLocationValue('a_background_middle');
            return data.top + data.height / 2;
        }();

        //纠正小男孩的位置
        var $boy = $('#boy');
        var boyHeight = $boy.height();
        $boy.css({
            'top': pathY - boyHeight + 25 + 'px'
        });
        ////////////////////////////////////////////////////////
        //===================动画处理============================ //
        ////////////////////////////////////////////////////////

        // 恢复走路
        function restoreWalk() {
            $boy.removeClass('pauseWalk');
        }
        // 暂停走路
        function pauseWalk() {
            $boy.addClass('pauseWalk');
        }
        // css3的动作变化
        function slowWalk() {
            $boy.addClass('slowWalk');
        }

        
        // 用transition做运动
        function stratRun(options, runTime) {
            var dfdPlay = $.Deferred();
            // 恢复走路
            restoreWalk();
            //应用transition的属性

            // var all =  '';
            // for(var key in options){
            //     all += key + ' ' + runTime + 'ms linear, '
            // }
            // options.transition =  all.slice(0, all.length-2); //'all ' + runTime + 'ms linear'
            // setTimeout(function(){
            //     $boy.css(options);
            // },16);
            // $boy.off('transitionend').on('transitionend', function() {
            //    
            //     dfdPlay.resolve();
            // })


            // {
            //     'left': options.left,
            //     'top': options.top,
            //     'transition': 'left ' + runTime + 'ms linear, top ' + runTime + 'ms linear'
            // }
            // $boy.on('webkitTransitionEnd', function() {
            //     dfdPlay.resolve();
            // })

            // document.getElementById('boy').addEventListener('webkitTransitionEnd', function() {dfdPlay.resolve(); }, false);
            // document.getElementById('boy').addEventListener('transitionend', function() {dfdPlay.resolve(); }, false);

            $boy.transition(
               options,
               runTime,
               'linear',
               function() {
                   dfdPlay.resolve(); // 动画完成
               });
            return dfdPlay;
        }
        // 开始走路
        function walkRun(time, dist, disY) {
            time = time || 3000;
            // 脚动作
            slowWalk();
            // 开始走路
            var d1 = stratRun({
                'left': dist + 'px',
                'top': disY ? disY + 'px' : undefined
            }, time);
            return d1;
        }
        //走进商店动画
        function walkShop() {
            var defer = $.Deferred();
            var $door = $('.door');
            var $boy = $('#boy');
            //门的坐标
            var offsetDoor = $door.offset();
            var doorOffsetLeft = offsetDoor.left;
            //小孩的坐标
            var offBoy = $boy.offset();
            var boyOffsetLeft = offBoy.left;
            //当前需要移动的坐标
            instanceX = (doorOffsetLeft + $door.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
            // 开始走路
            var walkPlay = stratRun({
                transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
                opacity: 0
            }, 2000);
            // 走路完毕
            walkPlay.done(function() {
                $boy.css({
                    opacity: 0.009
                })
                defer.resolve();
            })
            return defer;
        }
        // 等待取花
        function talkFlower() {
            var defer = $.Deferred();
            setTimeout(function() {
                $boy.addClass('slowFlolerWalk');
                defer.resolve()
            }, 1000);
            return defer;
        }

        // 走出店
        function walkOutShop(runTime) {
            var defer = $.Deferred();
            restoreWalk();
            //开始走路
            var walkPlay = stratRun({
                transform: 'translateX(' + instanceX + 'px)',
                opacity: 1
            }, runTime);
            walkPlay.done(function() {
                defer.resolve();
            });
            return defer;
        }

        // 计算移动距离
        function calculateDist(direction, proportion) {
            return (direction == "x" ?
                visualWidth : visualHeight) * proportion;
        }

        return {
            //走路
            walkTo: function(time, proportionX, proportionY) {
                var distX = calculateDist('x', proportionX);
                var distY = calculateDist('y', proportionY);
                return walkRun(time, distX, distY);
            },
            //进入商店
            toShop: function() {
                return walkShop.apply(null, arguments);
            },
            // 走出商店
            outShop: function() {
                return walkOutShop.apply(null, arguments);
            },
            //停止走路
            stopWalk: function() {
                pauseWalk();
            },
            // 取花
            talkFlower: function() {
                return talkFlower();
            },
            // 获取男孩的宽度
            getWidth: function() {
                return $boy.width();
            },
            // 复位初始状态
            resetOriginal: function() {
                this.stopWalk();
                // 恢复图片
                $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
            },
            // 转身动作
            rotate: function(callback) {
                restoreWalk();
                $boy.addClass('boy-rotate');
                // 监听转身完毕
                if (callback) {
                    $boy.on(animationEnd, function() {
                        callback();
                        $(this).off();
                    })
                }
            },
            setFlolerWalk: function() {
                $boy.addClass('slowFlolerWalk');
            }
        }
    }


    //进入商店动画
    var BoyToShop = function(boyObj) {
        var $door = $('.door');
        var $doorLeft = $('.door-left');
        var $doorRight = $('.door-right');
        var defer = $.Deferred();
        //开门动画
        function doorAction(deg, time) {
            var defer = $.Deferred();
            var count = 2;
            //等待开门完成
            var complete = function() {
                if (count == 1) {
                    defer.resolve();
                    return;
                }
            }
            $doorLeft.css({
                // 'left': left,
                'transform': 'rotateY(' + deg + 'deg)',
                'transform-origin': '0 50%',
                'transition': 'transform ' + time + 'ms linear'
            });
            $doorRight.css({
                // 'left': right,
                'transform': 'rotateY(' + deg + 'deg)',
                'transform-origin': '100% 50%',
                'transition': 'transform ' + time + 'ms linear'
            });
            // $doorLeft.on('webkitTransitionEnd', function() {
            //     defer.resolve();
            // });
            $doorLeft.on('transitionend', function() {
                defer.resolve();
            });
            // $doorRight.on('webkitTransitionEnd', function() {
            //     defer.resolve();
            // });
            $doorRight.on('transitionend', function() {
                defer.resolve();
            });

            return defer;
        }
        //开门
        function openDoor(time) {
            // doorAction('-50%', '100%', 2000);
            return doorAction(55, time);
        }
        // 关门
        function offDoor(time) {
            // doorAction('0%', '50%', 2000);
            return doorAction(0, time);
        }

        function talkFlower() {
            //增加延时等待效果
            var defer = $.Deferred();
            //取花
            boyObj.talkFlower(); //增加类，让小男孩拿花
            setTimeout(function() {
                defer.resolve();
            }, setTime.waitFlower)
            return defer;
        }

        // 灯动画
        var lamp = {
            elem: $('.b_background'),
            bright: function() {
                this.elem.addClass('lamp-bright')
            },
            dark: function() {
                this.elem.removeClass('lamp-bright')
            }
        };

        //开门动作
        var waitOpen = openDoor(setTime.openDoorTime)

        //等待开门 执行一些列动作

        waitOpen.then(function() {
            lamp.bright();
            //进入商店
            return boyObj.toShop($door, setTime.walkToShop)
        }).then(function() {
            //取花
            return talkFlower();
        }).then(function() {
            return boyObj.outShop(setTime.walkOutShop)
        }).then(function() {
            offDoor(setTime.shutDoorTime);
            lamp.dark();
            defer.resolve();
        });
        return defer;
    }


})