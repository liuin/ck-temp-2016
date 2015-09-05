define(["avalon",,'../mmAnimate/mmAnimate'], function(avalon) {
    var widget = avalon.ui.pop =  function(element, data, vmodels) {
        var options = data.popOptions;
        var vmodel =  avalon.define({
            $id: data.popId,
            toggle:false,
            $init:function  () {   
             
              element.setAttribute("ms-css-width", options.width);
              element.setAttribute("ms-css-height", options.height);
              element.setAttribute("ms-class", options.className);
              element.setAttribute("ms-css-margin-left", -options.width/2);
              element.setAttribute("ms-css-margin-top", -options.height/2);
              avalon.scan(element, [vmodel].concat(vmodels)); //连接模块
            }
          })
            
            vmodel.$watch("toggle", function(){
              if (vmodel.toggle == false) {
                avalon(element).stop(true,true).fadeOut();
              }else {
                avalon(element).stop(true,true).fadeIn();                
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