function Stack () {
  this.top = "null";
  this.length = 0;
}

Stack.prototype = {
  //constructor:Stack,
  push: function  () {
    console.log('dfdf');
  }
}

var stack1 = new Stack();
console.log(stack1.constructor);
