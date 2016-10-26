//构建英雄
function Hero () {
  this.lift = 1000;
  this.type = "physics";
  this.skill = {
    "1" : {
      "img": "",
      "introduct": "call file",
      "power": 100
    },
    "2" : {
      "img":"",
      "introduct" : "hello kity",
      "power": 100
    }
  },
  this.size = {
    width : 100,
    height : 100
  },

  this.moveSpeed = 50,
  this.moveSpeedX = this.moveSpeed || 1.5;
  this.moveSpeedY = this.moveSpeed || 1.5;
  this.moveX = null;
  this.moveY = null;
  this.moveXDir = 1;
  this.moveYDir = 1;
  this.attackSpeed = 1.5,
  this.normalPhysicsAttack = 20,
  this.normalMagicAttack = 20,
  this.physicsDefense = 0,
  this.magicDefense = 10,
  this.power = 0;
  this.status = "waiter";
  this.postion = {
    x: 10,
    y: 10
  }
}

Hero.prototype.moveTo = function  (x,y) {
  this.status = "move";
  var distanceX = x - this.postion.x;
  var distanceY = y - this.postion.y;
  var distance = Math.floor(Math.sqrt(distanceX*distanceX + distanceY*distanceY));
  

  this.moveSpeedX = distanceX/distance * this.moveSpeed;
  this.moveSpeedY = distanceY/distance * this.moveSpeed;

  this.moveX = x;
  this.moveY = y;

  (this.moveX > this.postion.x) ? (this.moveXDir = 1) : (this.moveXDir = -1);
  (this.moveY > this.postion.y) ? (this.moveYDir = 1) : (this.moveYDir = -1);
    


}

Hero.prototype.moveToPro = function  (fps) {
  console.log(this.postion);

  var distanceX = this.postion.x + this.moveSpeedX / fps - this.moveX;
  var distanceY = this.postion.y + this.moveSpeedY / fps - this.moveY;

  var checkEnd = false;

  if (this.moveXDir > 0 && distanceX > 0) {
    checkEnd = true;
  }

  if (this.moveXDir < 0 && distanceX < 0) {
    checkEnd = true;
  }

  if (this.moveYDir > 0 && distanceY > 0) {
    checkEnd = true;
  }

  if (this.moveYDir < 0 && distanceY < 0) {
    checkEnd = true;
  }


  if (checkEnd) {
    this.postion.x = this.moveX;
    this.postion.y = this.moveY;
    console.log(this.postion);
    this.status = "waiter";
  }else {
    this.postion.x += (this.moveSpeedX / fps);
    this.postion.y += (this.moveSpeedY / fps);    
  }
}

Hero.prototype.update = function  () {
  var $this = this;
  switch ($this.status) {
  case 'move':
    $this.moveToPro(Engine.fps);
  break

  case 'attack':

  break

  case 'waiter':

  break

  default:
  }
}


Hero.prototype.attack = function  (enemy) {
  var enemy = enemy;
  var measure = (this.normalPhysicsAttack > this.normalMagicAttack) ? this.normalPhysicsAttack : this.normalMagicAttack;

  var type = this.type;

  switch (type) {
    case 'physics':
      measure -= enemy.physicsDefense;
    break
    case 'magic':  
      measure -= enemy.magicDefense;
    break
    default:
  } 
  enemy.life -= measure;

  if (enemy.life < 0) {
    this.dead();
  }
}

Hero.prototype.dead = function  () {
  console.log('dead');
}

var Hero1 = new Hero();

Hero1.moveTo(100,100);


//Engine
var Engine = new Object();

Engine.now = new Date().getTime() || null;
Engine.lastTime = null;
Engine.fps = 60;


Engine.getFps = function  () {
  if ((this.now - this.lastTime) > 1000) {
    this.fps = (1000/(this.now - this.lastTime)).toFixed(2) * 100;
    $('#fps').html(this.fps);
    this.lastTime = this.now;
  }
}


Engine.requestAnimationFrame = function  (callback) {
  if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
  else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
  else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
  else {
     return window.setTimeout(callback, 1000 / 60);
  }
}


Engine.animate = function  (time) {
  var $this = Engine;
  $this.now = time || new Date().getTime();
  if ($this.lastTime == null) {
    $this.lastTime = $this.now;
  }
  $this.getFps();

  Hero1.update();

  Engine.requestAnimationFrame(Engine.animate);

}

Engine.requestAnimationFrame(Engine.animate);


