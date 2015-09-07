define(["avalon",'../trans/trans'], function(avalon) {
    var widget = avalon.ui.pop =  function(element, data, vmodels) {
        var options = data.popOptions;
        var elemParent = element.parentNode;
        var parentstr = avalon.parseHTML('<div class="pop-wrap"  ms-on-click="hidePop($event)" id="' + data.popId + '"></div>').firstChild;
        var closeBtn = avalon.parseHTML('<span ms-click="hidePop()" class="close">X</span>').firstChild;
        var vmodel =  avalon.define({
            $id: data.popId,
            toggle:false,
            stopUp:function  (e) {  //阻止冒泡
              e.stopPropagation();
            },
            hidePop:function  (e) {
              vmodel.toggle = false;
            },
            $init:function  () {
              //element.setAttribute("ms-visible", 'toggle');                        
              
              elemParent.insertBefore(parentstr,element)
              parentstr.appendChild(element);
              element.appendChild(closeBtn);
              //parentstr.setAttribute('ms-visible','toggle');
              element.setAttribute("ms-on-click", 'stopUp($event)');
              element.setAttribute("ms-css-width", options.width);
              element.setAttribute("ms-css-height", options.height);
              element.setAttribute("ms-class", options.className);
              element.setAttribute("ms-css-margin-left", -options.width/2);
              element.setAttribute("ms-css-margin-top", -options.height/2);
              avalon.scan(parentstr, [vmodel].concat(vmodels)); //连接模块
            }
          })

          avalon.bind(parentstr,avalon.tranEnd,function  () {
            if (vmodel.toggle == false) {
              avalon(parentstr).css('display','none');
            }
          })
            
            vmodel.$watch("toggle", function(){
              if (vmodel.toggle == false) {
                avalon(parentstr).removeClass('in');
                if (avalon.tranEnd == '') {     
                  avalon(parentstr).css('display','none');
                }else {
                }
              }else {
                avalon(parentstr).css('display','block');
                avalon(parentstr).width();
                avalon(parentstr).addClass('in');                                      
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