define(["avalon",'css!./sdpic.css','text!./sdpic.html','../mmAnimate/mmAnimate.js'], function(avalon,css,temp) {
    var temp = avalon.parseHTML(temp);
    var widget = avalon.ui.sdpic =  function(element, data, vmodels) {
        var options = data.sdpicOptions;
        var vmodel =  avalon.define({
            $id: data.sdpicId,
            bigimg: options.bigimg,
            smallpic: options.smallpic,
            zoomsrc: "",
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
              var img = new Image();                
              img.src = vmodel.smallpic[i].bigsrc;
              if (avalon(this).data('isload') == true || img.complete) {
                img = null;
                animate(i);
              }else {                
                vmodel.loading = true;
                img.onload = function  () {
                  avalon($this).data('isload','true');
                  animate(i);
                  
                }
              }
              vmodel.zoomsrc = vmodel.smallpic[vmodel.current].zoomsrc;
              getZoom();
            },
            spter: false,
            spterTop:0,
            spterLeft:0,
            spterHeight:0,
            spterWidth:0,
            imgZoom:false,
            zoomImgLeft:0,
            zoomImgTop:0,
            zoomRd:0,
            getZoom:function  () {
              var img = new Image();
              img.src = vmodel.zoomsrc;
              
              
              
              if (img.complete) {
                var getObjWidth = avalon(document.getElementById('imgZoom')).width();
                var zoom = 424/getObjWidth;
                vmodel.zoomRd = zoom;           
                vmodel.spterWidth = 400*(vmodel.zoomRd);
                vmodel.spterHeight = 400*(vmodel.zoomRd);                     
              }else {
                img.onload = function  () {
                  var getObjWidth = avalon(document.getElementById('imgZoom')).width();
                  
                  var zoom = 424/getObjWidth;
                  vmodel.zoomRd = zoom;   
                  vmodel.spterWidth = 400*(vmodel.zoomRd);
                  vmodel.spterHeight = 400*(vmodel.zoomRd);                  
                }                
              }

              

              
            },
            showZoom:function  (e) {              
              vmodel.imgZoom = true;              
              vmodel.spter = true;              
              var $offset = avalon(this).offset();
              var spLeft = e.clientX - $offset.left - vmodel.spterWidth/2;
              var spTop = e.clientY - $offset.top - vmodel.spterHeight/2;
              if (spLeft < 0) {
                spLeft = 0;
              }else {
                if (spLeft > (424 - vmodel.spterWidth)) {
                  spLeft = 424 - vmodel.spterWidth;
                }
              }
              if (spTop < 0) {
                spTop = 0;
              }else {
                if (spTop > (286 - vmodel.spterWidth)) {
                  spTop = 286 - vmodel.spterWidth;                  
                }
              }

              vmodel.spterTop = spTop;
              vmodel.spterLeft = spLeft;              
              vmodel.zoomImgLeft = -spLeft*(1/vmodel.zoomRd);
              vmodel.zoomImgTop = -spTop*(1/vmodel.zoomRd);
            },    
            hideZoom:function  () {
              vmodel.imgZoom = false;
              vmodel.spter = false;
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
          vmodel.zoomsrc = vmodel.smallpic[i].zoomsrc;
          vmodel.cloneimg = vmodel.bigimg;
          vmodel.fadeOut = 0;
          vmodel.fadeIn = 1;
          vmodel.effect = false;
          vmodel.loading = false;
          vmodel.getZoom();
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