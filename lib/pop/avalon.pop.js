define(["avalon",'../mmAnimate/mmAnimate','../trans/trans'], function(avalon) {
    var widget = avalon.ui.pop =  function(element, data, vmodels) {
        var options = data.popOptions;
        var vmodel =  avalon.define({
            $id: data.popId,
            toggle:false,
            $init:function  () {   
              //element.setAttribute("ms-visible", 'toggle');
              element.setAttribute("ms-css-width", options.width);
              element.setAttribute("ms-css-height", options.height);
              element.setAttribute("ms-class", options.className);
              //element.setAttribute("ms-class-1", "in:toggle");
              element.setAttribute("ms-css-margin-left", -options.width/2);
              element.setAttribute("ms-css-margin-top", -options.height/2);
              avalon.scan(element, [vmodel].concat(vmodels)); //连接模块
            }
          })

          avalon.bind(element,avalon.tranEnd,function  () {
            if (vmodel.toggle == false) {
              avalon(element).css('display','none');
            }           
          })
            
            vmodel.$watch("toggle", function(){
              if (vmodel.toggle == false) {
                avalon(element).removeClass('in');
                if (avalon.tranEnd == '') {                  
                  avalon(element).css('display','none');
                }else {
                  
                }
              }else {    
              
                avalon(element).css('display','block');
                avalon(element).width();
                avalon(element).addClass('in');                                      


               
               
              }
            })
        
        return vmodel

    }

    widget.vertion = 1.0
    widget.defaults = {
        width: 200,
        height: 160,
        className: "pop"
    }
    return avalon
})