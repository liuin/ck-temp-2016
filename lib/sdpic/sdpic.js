define(["avalon",'css!./sdpic.css','text!./sdpic.html','../mmAnimate/mmAnimate.js'], function(avalon,css,temp) {
    var temp = avalon.parseHTML(temp);
    var widget = avalon.ui.sdpic =  function(element, data, vmodels) {
        var options = data.sdpicOptions;
        var vmodel =  avalon.define({
            $id: data.sdpicId,
            bigimg: options.bigimg,
            smallpic: options.smallpic,
            loading: false,
            current:0,
            effect:true,
            duringTime:30,
            fadeIn:1,
            animated:true,
            fadeOut:0,
            cloneimg:'',
            easing:'easeInOut',
            changebig:function  (i) {         
              if (vmodel.current == i) {
                return 
              }
              var $this = this;
              vmodel.current = i;
              if (avalon(this).data('isload') == true) {
                animate(i);
              }else {
                var img = new Image();                
                img.src = vmodel.smallpic[i].bigsrc;
                vmodel.loading = true;
                img.onload = function  () {
                  avalon($this).data('isload','true');
                  animate(i);
             
                }
              }
              
              
            },
            $init:function  () {              
              element.appendChild(temp);
              resetPic(vmodel.current);

              avalon.scan(element.parentNode, [vmodel].concat(vmodels)); //连接模块
            }
          })
        function animate(number) {
          if (vmodel.animated == false) {
            return;
          }
          vmodel.effect = true;
          vmodel.bigimg = vmodel.smallpic[vmodel.current].bigsrc;
          go();
        }

        function resetPic(i) {
          vmodel.bigimg = vmodel.smallpic[i].bigsrc;
          vmodel.cloneimg = vmodel.bigimg;
          vmodel.fadeOut = 0;
          vmodel.fadeIn = 1;
          vmodel.effect = false;
          vmodel.loading = false;
        }

        currentTime = 0;
        var go = function() {
          vmodel.animated = false;
          ;
          vmodel.fadeIn = Tween(vmodel.easing, currentTime, 0, 1, vmodel.duringTime); 
          vmodel.fadeOut = 1 - vmodel.fadeIn;
          if (currentTime < vmodel.duringTime) {
            currentTime += 1
            requestAnimationFrame(go)
            vmodel.animated = true
          }else {
            resetPic(vmodel.current);
            currentTime=0;
            vmodel.animated = true
          }
        }

        /**
         * 逐帧动画
         * @param callback {Function} 动画函数
         */
        function requestAnimationFrame(callback) { //requestAnimationFrame 兼容
            if(window.requestAnimationFrame){
                return window.requestAnimationFrame(callback)
            } else{
                return window.setTimeout(callback, 10)
            }
        }
        
      /**
       * 缓动函数
       * @param eatingType {String} 缓动类型
       * @param curTime {String} 当前时间
       * @param startPos {String} 开始位置
       * @param distance {String} 移动距离
       * @param duration {String} 持续时间
       */
      function Tween(eatingType, curTime, startPos, distance, duration){
        switch(eatingType){
          case "linear":
            return distance * curTime / duration + startPos
          case "easeIn":
            return distance * (curTime /= duration) * curTime + startPos
          case "easeOut":
            return -distance * (curTime /= duration) * (curTime - 2) + startPos
          case "easeInOut":
            if ((curTime /= duration / 2) < 1) {
              return distance / 2 * curTime * curTime + startPos
            } else{
              return -distance / 2 * ((--curTime) * (curTime - 2) - 1) + startPos
            }
          default:break;
        }
      }
         
        return vmodel
    }

    widget.defaults = {
      bigimg:'',
      smallpic:[]
    }
    return avalon
})