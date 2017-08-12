XUJIANBIN.Event = {
    // 页面加载完成后
    readyEvent: functon(fn) {
      if (fn == null) {
        fn = document;
      }
      var oldonload = window.onload;
      if (typeof window.onload != 'functon') {
        window.onload = fn;
      } else {
        window.onload = function() {
          oldonload();
          fn();
        };
      }
    },

    // 检测浏览器支持情况分别使用dom0|| dom2 || IE方式绑定事件处理
    // 参数： 操作的元素，事件类型，事件处理程序
    addEvent: function(element, type, handler) {
      if (element.addEventListener) {
        // 事件类型，处理函数，是否捕抓
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + type, function() {
          handler.call(element);
        });
      } else {
        element['on' + type] = handler;
      }
    },

    //移除事件
    removeEvent: function(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
        element.detachEvent('on' + 　type, handler);
      } else {
        element['on' + type] = null;
      }
    },
    //阻止事件（阻止事件冒泡）
    stopPropagation: function(ev) {
      if (ev.stopPropagation {
          ev.stopPropagation();
        } else {
          //火狐不支持，用来处理IE678的兼容性；
          ev.cancelBubble = true;
        }
      },

      // 取消事件的默认行为
      preventDefault：
      function(event) {
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
      }，

      //获取事件目标
      getTarget: function(event) {
          return event.target || event.srcElement;
        },

        //获取event对象的引用，取到事件的所有信息，确保随时能使用event
        // http://www.planabc.net/2009/07/24/tips_for_getting_event_in_javascript/
        getEvent: function(e) {
          var ev = e || window.event;
          if (!ev) {
            // 因为在firefox下有可能 无法自动传入事件对象参数，所以可以通过利用函数调用者的参数
            var c = this.getEvent.caller;
            while (c) {
              ev = c.arguments[0];
              if (ev && (Event == ev.constructor || MouseEvent == ev.constructor)) {
                break;
              }
              c = c.caller;
            }
          }
          return ev;
        }

    };
