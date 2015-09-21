//define(["avalon",'css!./select-ui.css'], function(avalon) {
//    var widget = avalon.ui.selectck =  function(element, data, vmodels) {
//        var options = data.selectckOptions;
//        var elemParent = element.parentNode;
//        var parentstr = avalon.parseHTML('<span ms-class="selectstyle"   id="' + data.selectckId + '"></span>').firstChild;
//        var valbt = avalon.parseHTML('<span ms-click="gettext()" class="val">{{selectText}}</span>').firstChild;
//        var getOption = avalon.parseHTML('<option ms-repeat="option" ms-value="el.val">{{el.text}}</option>').firstChild;
//        var vmodel =  avalon.define({
//            $id: data.selectckId,
//            selectVal:options.defVal,
//            selectText:options.defText,
//            option:options.option,
//            $init:function  () {
//              //element.setAttribute("ms-visible", 'toggle');   
//              element.setAttribute("ms-duplex",'selectVal');
//              elemParent.insertBefore(parentstr,element)
//              parentstr.appendChild(element);
//              element.appendChild(getOption);
//              parentstr.appendChild(valbt);
//              avalon.scan(parentstr, [vmodel].concat(vmodels)); //连接模块
//            }
//          })
//          
//            vmodel.$watch("selectVal", function(){              
//              for (var i = 0;  i < vmodel.option.length; i++) {
//                if (vmodel.option[i].val == vmodel.selectVal) {                  
//                  vmodel.selectText = vmodel.option[i].text;
//                }
//              }
//            })
//         
//        return vmodel
//    }
//
//    widget.vertion = 1.0
//    widget.defaults = {
//      defVal:'0',
//      option:[
//        {val:'0',text:'select0'},
//        {val:'1',text:'select1'},
//        {val:'2',text:'select2'},
//        {val:'3',text:'select3'}                
//      ],
//      defText:'select0'
//    }
//    return avalon
//})


define(["avalon",'css!./select-ui.css','text!./select.html'], function(avalon,css,html) {
  var temp = html;
  var ckvm = '';
  avalon.component("ms:ckselect", {
      a: 1,
      $replace: 1,
      selectText:0,
      selectVal:0,
      $ready: function () {
      },
      $template: html,
      $init:function  (ckvm) {      
        ckvm.selectVal = ckvm.defVal;
        fixVal(ckvm.selectVal);
        ckvm.$watch("selectVal", function(){     
          fixVal(ckvm.selectVal);
        })
        function fixVal (curretVal) {
          for (var i = 0;  i < ckvm.option.length; i++) {
            if (ckvm.option[i].val == curretVal) {                  
                ckvm.selectText = ckvm.option[i].text;
              }
            }
        }

      }
  })


 

  return avalon
})