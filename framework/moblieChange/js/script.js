$(document).ready(function() {
  //定义app 全局变量
  var myApp = new Framework7({});
  var mainView = myApp.addView('.container-view', {});
  
  //加载回调函数页面
  myApp.onPageInit('index', function (page) {
    if ($('.pages .page[data-page="index"]').data('build') != true) {
      homeLoad();
    }
    $('.pages .page[data-page="index"]').data('build',true);
  });

  myApp.onPageInit('page3', function (page) {
    
  });
  
  //预加载某页
  var ajurl = 'indoor-page.html';
  mainView.router.load({
    //url : ajurl,
    //animatePages:true
  });

  //左边目录
  var getpanhd = $(window).height()- $('.panel-login').outerHeight() - $('.panel-bottom').outerHeight();
  $('.panel-list-block').height(getpanhd);

  var panelListBlock = new IScroll('#panel-list-block', { 
    scrollX: true, 
    freeScroll: false,
    bounce:false,
    scrollbars:true
  });

  $('.open-panel').on('tap',function  (e) {
    
    $('body').addClass('open-panel');
    setTimeout(
      function(){
        $('.panel-overlay').css('z-index','20');
        $('.panel.panel-left').css('z-index','25');  
        $('.panel-overlay').one('tap',function  (e) {
          e.stopPropagation();          
          $('.panel.panel-left').css('z-index','');  
          setTimeout(
            function(){
              $('body').removeClass('open-panel');    
              setTimeout(
                function(){
                  $('.panel-overlay').css('z-index','');
                }, 500)
            }, 200)
        })
      }, 500)
  })
  
  //点击事件
  $(document).on('tap', 'a', handleClicks);
  function handleClicks(e) {

    /*jshint validthis:true */
    var clicked = $(this);
     
    var url = clicked.attr('href');
    
    var isLink = clicked[0].nodeName.toLowerCase() === 'a';        
    // Check if link is external 
    if (isLink) {
        if (clicked.is(mainView.params.externalLinks) || url && url.indexOf('javascript:') >= 0) {
            if(url && clicked.attr('target') === '_system') {
                e.preventDefault();
                window.open(url, '_system');
            }
            return;
        }
    }    
    if (isLink) {
      e.preventDefault();
    }   
    var options = {
      url : url,
      animatePages:true
    }

    if (clicked.hasClass('back')){
      mainView.router.back(options)
    }else{
      mainView.router.load(options);
    }          
  }

  //首页变量
  var tagPageArr = [0];
  var tagSection = [];
  var ininfPage = 10;
  var refreshPro = false;
  var refreshY = 0;
  var currentPos = {
    x:0,
    y:0,
    dir:false
  }

  function homeLoad () {
    //tagPage
     tagPageArr = [0];
     tagSection = [];
     ininfPage = 10;
     refreshPro = false;
     refreshY = 0;
    currentPos = {
      x:0,
      y:0,
      dir:false,
      long:30
    }

    //滚动条目录
    var headWidth = 0;
    $('.tag-head-inner > a').each(function () {
      headWidth += $(this).width() + 70
    })
    $('.tag-head-inner,.tag-swpier').width(headWidth);
    
    /*
    var myScroll = new IScroll('#tag-head', { 
      scrollX: true, 
      freeScroll: false,
      bounce:false
    });
    */

    $('.tag-wrap-inner').width( 640 * ($('.tag-wrap-inner > .tag-section').length));
     return false;
    $('.tag-wrap-inner,.tag-section').height($(window).height() - 132);
    
    var tagScroll = new IScroll('#tag-wrap', {
      scrollX: true,
      scrollY: false,
      preventDefault:false,
      momentum: false,
      snap: true,
      bounce:false,
      scrollbars:false,
      mouseWheelSpeed:100
    });

        
   
    $('.tag-section').each(function (i) { 
      tagSection[i] = new IScroll('.tag-section:nth-child('+ (i+1)+')', {
        scrollX: false,
        scrollY: true,
        preventDefault:true,
        scrollbars:true,
        bounce:true,
        probeType:2,
        mouseWheel: false,
        invertWheelDirection:true
      })
    })

    tagSection[0].refresh();
    
    tagScroll.on('scrollEnd',function  (page) {
      var currentPageIndex = tagScroll.currentPage.pageX; 
      var currentPage = $('.tag-head-inner > a').eq(currentPageIndex);
      if(!(currentPage.hasClass('active'))){                
        currentPage.addClass('active').siblings().removeClass('active');
        var pageObj = $('#tag-wrap .tag-section').eq(currentPageIndex);
        var ajaxUrl = pageObj.data('ajaxurl');
        loadAjax(ajaxUrl,pageObj,ajaxBeforeCallback,ajaxAfterSuccess);
      }
    })

    tagScroll.on('scroll',function  (page) {
        if (currentPos.dir == 'y') {          
          tagScroll.x = currentPos.x;
          currentPos.y = this.y;
          return false;
        }        
    })
    
    for (var i = 0;  i<tagSection.length ; i++) {

     

      tagSection[i].on('scrollStart',function  () {
        currentPos.x = tagScroll.x;
        currentPos.y = this.y;      
        currentPos.dir = false;
        
      })
      tagSection[i].on('scroll',function  () {        

        var curentPage = '';
        
        
        if (tagPageArr.length < 2) {
          curentPage = tagPageArr[0];
        }else {
          curentPage = tagPageArr[1];
        }
        var obj = $('.tag-section').eq(curentPage).find('.refresh-tag');
        if (this.y > 80) {          
          obj.html('松开刷新');
        }else {
          obj.html('下拉刷新');
        }
        
        refreshPro = this.y;
        if (currentPos.dir == 'x') {
          this.y = currentPos.y;
          currentPos.x = tagScroll.x;
          return false;
        }
        if (currentPos.dir == 'y') {          
          tagScroll.x = currentPos.x;
          currentPos.y = this.y;          
          return false;
        }        

        
        var lbx = Math.abs(Math.abs(currentPos.x) - Math.abs(tagScroll.x));
        var lby = Math.abs(Math.abs(currentPos.y) - Math.abs(this.y));
        if ((lbx > lby) && (lbx > currentPos.long) ) {
          currentPos.dir = 'x';
          this.y = currentPos.y;
        }else {
          if ((lbx < lby) && (lby > currentPos.long)) {                     
            currentPos.dir = 'y';
            tagScroll.x = currentPos.x;
          }
        }
        

      })

      tagSection[i].on('scrollEnd',function  () { 
        var curentPage = '';
        if (tagPageArr.length < 2) {
          curentPage = tagPageArr[0];
        }else {
          curentPage = tagPageArr[1];
        }
        if (Math.abs(this.y - this.maxScrollY) < 200) {
          //滚动加载
          ininfeData($('.tag-section').eq(curentPage).data('ajaxurl'),$('.tag-section').eq(curentPage).find('.tag-section-inner'));          
        }
        //下拉刷新        
        if (refreshPro > 80) {
          refreshTag($('.tag-section').eq(curentPage).data('ajaxurl'),$('.tag-section').eq(curentPage).find('.tag-section-inner'))
        }

        
        
      })
    }      
     

  
    $('.tag-head-inner a').on('tap',function  (e) {
      if ($(this).hasClass('active')) {
        return false;
      }
      var getInd = $(this).index();

      e.stopPropagation();
      tagScroll.goToPage(getInd, 0, 0);

      if (tagPageArr[0] == getInd) {
        $('#tag-wrap .tag-section').eq(getInd).hide().fadeIn();
        tagPageArr.reverse();
      }else {
        var getPage = $('#tag-wrap .tag-section').eq(getInd);
        loadAjax(getPage.data('ajaxurl'),getPage,ajaxBeforeCallback,ajaxAfterSuccess);            
      }
      $(this).addClass('active').siblings().removeClass('active');    
      
    })

    function ajaxBeforeCallback(obj) {
      if (!(obj.data('isload') == true)) {              
        if (tagPageArr.length <2) {
          tagPageArr.push(obj.index());
        }else {
          $('#tag-wrap .tag-section').eq(tagPageArr[0]).find('.tag-section-inner .tag-section-info').empty();
          $('#tag-wrap .tag-section').eq(tagPageArr[0]).data('isload',false);
          obj.find('.load-tag').show();
          tagPageArr.shift();
          tagPageArr.push(obj.index());
        }
      }else {
        tagPageArr.reverse();
      }
    }

    function ajaxAfterSuccess(obj,data) {
      if (!(obj.data('isload') == true)) {
        obj.find('.tag-section-inner .tag-section-info').empty().hide().html(data).fadeIn();
        obj.data('isload',true).find('.load-tag').hide();
        for (var i = 0;  i<tagSection.length ; i++) {
          tagSection[i].refresh();
        }
      }
    }

    $('[data-linkto]').on('tap',function  () {
      var getUrl = $(this).data('linkto');
      mainView.router.load({
        url : getUrl,
        animatePages:true
      });
    }).on('touchstart',function  () {
      $(this).addClass('tsec-bk1-active');
    }).on('touchend',function  () {
      $(this).removeClass('tsec-bk1-active');      
    })

    $(window).load(function  () {
        
      tagSection[0].refresh();
    })
    $('.pages .page[data-page="index"]').data('build',true);
  }
  homeLoad();

  //下拉刷新
  function refreshTag(url,obj) {
    var $this = obj;
    
    loadAjax(url,obj,function  () {
      //before
      $this.next('.load-tag').show();
    },function  (obj,data) {
      var $data = $(data);
      $data.prependTo($this).hide().fadeIn('slow');
      
      for (var i = 0;  i<tagSection.length ; i++) {
        tagSection[i].refresh();
      }
      
      $this.next('.load-tag').hide();
    });
  }

  //滚动加载函数
  function ininfeData(url,obj) {
    var $this = obj;
    loadAjax(url,obj,function  (obj) {
      //before
     
      $this.next('.load-tag').show();
    },function  (obj,data) {
      //after
      $this.find('.tag-section-info').append(data);

      for (var i = 0;  i<tagSection.length ; i++) {
        tagSection[i].refresh();
      }
      
      $this.next('.load-tag').hide();
    })
  }

  function loadAjax (url,obj,beforeCallback,afterSuccess) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'text',
        success: function(data){
          if (afterSuccess) {
            afterSuccess(obj,data);
          }
        },
        error:function  () {
          alert('加载错误，请刷新页面');
        },
        beforeSend:function  () {
          if (beforeCallback) {
            beforeCallback(obj);
          }
        }
    });
  }


})