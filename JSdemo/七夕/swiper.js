/**
 * [swiper description]
 * @param {[string]} container 页面容器节点
 * @param {[string]} options  参数
 */

function Swiper(container){
	//获取第一个子节点
	var element = container.find(':first');
    //滑动对象
    var swiper  = {};
    //获取滑动li
   
    var sliders = element.find(">");
    //获取容器尺寸
    var width = container.width();
    var height = container.height();
    // 设置li容器的宽度
    element.css({
      width: (sliders.length * width) + 'px',
      height: height +'px'
    });
    $.each(sliders,function(index){
       var slide = sliders.eq(index);
       slide.css({
       	width: width + 'px',
       	height: height + 'px'
       });
    });
    


    var isComplete = false;
    var timer;
    var callbacks = {}; //注册回调
    //动画结束后通知事件
    container[0].addEventListener('transitionend',function(){
      isComplete = true;
      // callbacks.complete();
    },false)

    //循环获取坐标
    function monitorOffset(element){
      tiemr = setTimeout(function(){
        if (isComplete) {
          clearTimeout(timer);
          return;
        }
        callbacks.move(element.offset().left);
        monitorOffset(element)
      },500)
    }
    swiper.watch = function(eventName,callback){
      callbacks[eventName] = callback;
    }


    //移动
    swiper.scrollTo = function(x, speed){
    	element.css({
    		'transition-timing-function': 'linear',
    		'transition-duration' : speed +'ms',
    		'transform': 'translate3d(-'+ x +'px,0px,0px)'
    	});
    	return this;
    }
    return swiper;
} 