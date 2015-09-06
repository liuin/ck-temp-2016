define(["avalon"], function(avalon) {
  var el = document.createElement('div')

  var transEndEventNames = {
    WebkitTransition : 'webkitTransitionEnd',
    MozTransition    : 'transitionend',
    OTransition      : 'oTransitionEnd otransitionend',
    transition       : 'transitionend'
  }
  
  var tranEnd = '';
  for (var name in transEndEventNames) {
    if (el.style[name] !== undefined) {
      tranEnd = transEndEventNames[name];
    }
  }
  avalon.tranEnd = tranEnd;
  return avalon
})