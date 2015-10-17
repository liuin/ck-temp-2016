/*-- 
  anchor:cuki13
  use:ck-scroll
  come form:iscoll
 --*/

+(function($) {
  'use strict';
  var selectString = '[ckscroll]';

  //rAF动画函数
  var rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60);};

  //浏览器相关
  var borws = {};
  function trans() {    
    var _elementStyle = document.createElement('div').style;
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
      transform,
      i = 0,
      l = vendors.length;
    for ( ; i < l; i++ ) {
      transform = vendors[i] + 'ransform';
      if ( transform in _elementStyle ) return (vendors[i].substr(0, vendors[i].length-1));
    }
    return false;
  }

  borws.tran = trans();
  //获取当前时间
  borws.getTime = Date.now || function getTime () { return new Date().getTime(); };

  var evenType ={  
    touchstart: 1,
    touchmove: 1,
    touchend: 1,

    mousedown: 2,
    mousemove: 2,
    mouseup: 2,

    pointerdown: 3,
    pointermove: 3,
    pointerup: 3,

    MSPointerDown: 3,
    MSPointerMove: 3,
    MSPointerUp: 3    
  }
  borws = $.extend({},borws,evenType);  

  function ckScroll(obj,options) {
    this.obj = obj;
    this.scroller = $(obj[0].children[0]);
    var defualts = {
      startX: 0,
      startY: 0,
      scrollY: true,
      momentum: true,
      bounce: true,
      bounceTime: 600,
      moved : false
    };
    $.extend(this,defualts,options);

    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;

    this.init();
  }
  
  ckScroll.prototype.init = function  () {
    var $this = this;
    this.obj.on('touchstart',function  (e) {
      $this.start(e);
    })
    this.obj.on('touchmove',function  (e) {
      $this.move(e);
      e.preventDefault();
    })
    this.obj.on('touchend',function  (e) {
      $this.end(e);
    })
    //this.scroller.on('touchmove',this.move())
    //this.scroller.on('touchend',this.end())
  }


  ckScroll.prototype.start = function  (e) {
    e = e.originalEvent;
    var point = e.touches ? e.touches[0] : e;    
    this.startX    = this.x;
    this.startY    = this.y;
    this.absStartX = this.x;
    this.absStartY = this.y;
    this.pointX    = point.pageX;
    this.pointY    = point.pageY;
    this.moved = true;
    this.obj.trigger('scrollStart');     
  }

  ckScroll.prototype.move = function  (e) {
    if (this.moved == false) {
      return
    }    
    
    e = e.originalEvent;    
    var point		= e.touches ? e.touches[0] : e,
        deltaX		= point.pageX - this.pointX,
        deltaY		= point.pageY - this.pointY,
        timestamp	= borws.getTime(),
        newX, newY,
        absDistX, absDistY;
      
      this.pointX		= point.pageX;
      this.pointY		= point.pageY;
      //console.log(deltaX,deltaY,this.pointX);

      absDistX		= Math.abs(deltaX);
      absDistY		= Math.abs(deltaY);

      // 必须移动10px才生效
      if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
        return;
      }

      newX = this.x + deltaX;
      newY = this.y + deltaY;
    
    this.translate(newX, newY);
    this.obj.trigger('scroll');
  }

  ckScroll.prototype.end = function  () {
    this.moved = false;
    this.obj.trigger('scrollEnd');
  }

  ckScroll.prototype.translate = function  (x,y) {
    var style = {
      'transform' : 'translate(' + x + 'px,' + y + 'px)'
    };

    this.scroller.css(style);
    this.x = x;
    this.y = y;
  }



  $(document).ready(function() {
    $(selectString).each(function () {
       //callsome
       $(selectString).data('ckScroll',new ckScroll($(this)));
    })      
  })
  



})(jQuery);
