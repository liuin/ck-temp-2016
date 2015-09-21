define(["avalon"], function(avalon) {            
  avalon.component("ms:button", {
      a: 1,
      $replace: 1,
      $childReady: function (vm, elem, e) {

      },
      $ready: function (vm, elem) {
          console.log("BUTTON构建完成")
      },
      $template: "<button type='button'><span>|<ms:text></ms:text>|</span>{{a}}<ms:text/></button>"
  })
  avalon.component("ms:text", {
      b: "默认值",
      $replace: 1,
      $ready: function () {
          console.log("TEXT构建完成")
      },
      $template: "<strong>{{b}}</strong>"
  })
  return avalon;
})

