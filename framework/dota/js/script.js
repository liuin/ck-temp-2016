//地图
var Map = new Object();
Map.width = 640;
Map.height = 320;
Map.obj = document.getElementById('canvas');
Map.ctx = Map.obj.getContext('2d');
Map.viewObjsCurrent = null;
Map.viewObjs = [];


Map.build = function () {
  var ctx = Map.ctx;
  Map.obj.width = Map.width;
  Map.obj.height = Map.height;
  ctx.fillStyle = "#eee";
}

Map.objResetSelect = function  () {
  for (var i = 0;  i<Map.viewObjs.length ; i++) {
    Map.viewObjs[i].selected = false;
  }
}

Map.reset = function  () {
  var ctx = Map.ctx;
  ctx.clearRect(0, 0, Map.width, Map.height);
  ctx.fillStyle = "#eee";
}

Map.windowToCanvas = function (x, y) {
  var ca = Map.obj;
  var bbox = ca.getBoundingClientRect();
  return {
    x : (x - bbox.left) * (ca.width/bbox.width),
    y : (y - bbox.top) * (ca.height/bbox.height)
  };
}

Map.planObjs = function  () {

  var getQueue = [];

  

  for (var i = 0;  i<Map.viewObjs.length ; i++) {
    
    for (var n = (i + 1);  n<Map.viewObjs.length ; n++) {
      var s = Map.viewObjs[n-1].zIndex;
      
      var comp = Map.viewObjs[n].zIndex;
      
      if (s > comp) {
        
        var temp = Map.viewObjs.splice((n-1),1)[0];
        Map.viewObjs.push(temp);
      }    
    }
  }

  for (var i = 0;  i<Map.viewObjs.length ; i++) {
    //console.log(Map.viewObjs[i].zIndex);
    Map.viewObjs[i].update();
    
    
  }
  //console.log(Map.viewObjs);
  //Engine.stop = true;


  
}

Map.obj.onclick = function  (e) {
  var $this = Map;
  var pos = $this.windowToCanvas(e.clientX,e.clientY);
  var check =  Map.checkClick(pos);
  
  if (check == false && Map.viewObjsCurrent) {
    Map.viewObjsCurrent.moveTo(pos.x,pos.y);
  }

  //hero1.moveTo(pos.x,pos.y);
  //hero1.selected = true;
}

Map.checkClick = function  (pos) {
  var posX = pos.x;
  var posY = pos.y;

  var clickObj = null;
  var clickObjIndex = null;

  for (var i = 0;  i<Map.viewObjs.length; i++) {
    var obj = Map.viewObjs[i];
   
    if ( posX > (obj.position.x - obj.size.width/2) && posX < (obj.position.x + obj.size.width/2) && posY > (obj.position.y - obj.size.height) && posY < (obj.position.y)) {            
      if (clickObj != null) {        
        if (clickObj.zIndex < Map.viewObjs[i].zIndex) {
          clickObj = Map.viewObjs[i];
          clickObjIndex = i;
        }
      }else {
        clickObj = Map.viewObjs[i];  
        clickObjIndex = i;
      }

      //return true
    }
  }
  
  if (clickObj != null) {
    clickObj.clickEvent(pos, clickObjIndex); 
    return true
  }


  return false;
}

Map.build();

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
    height : 130
  },

  this.moveSpeed = 150,
  this.bgColor = "f60";
  this.moveSpeedX = this.moveSpeed || 1.5;
  this.moveSpeedY = this.moveSpeed || 1.5;
  this.moveX = null;
  this.moveY = null;
  this.moveXDir = 1;
  this.moveYDir = 1;
  this.zIndex = 1;
  this.attackSpeed = 1.5,
  this.attackInTime = 0.7,
  this.attackDistance = 50,
  this.direction = "left",
  this.normalPhysicsAttack = 20,
  this.normalMagicAttack = 20,
  this.physicsDefense = 0,
  this.magicDefense = 10,
  this.power = 0;
  this.selected = false;
  this.status = "waiter";
  this.position = {
    x: 10,
    y: 10
  }
  //this.plan();

  //将此加入场景
  Map.viewObjs.push(this);

}

Hero.prototype.clickEvent = function  (pos,number) {
  Map.objResetSelect();
  this.selected = true; 

  if (Map.viewObjsCurrent == this) {
    this.moveTo(pos.x, pos.y);
  }else{
    Map.viewObjsCurrent = this;
    
//    for (var i = 0;  i<Map.viewObjs.length ; i++) {
//      Map.viewObjs[i].zIndex = 1;
//    }
//
//    Map.viewObjsCurrent.zIndex = 99;

  }
}

Hero.prototype.planMove = function  () {
  var $this = this;
  var ca = Map.ctx;
  ca.fillStyle= this.bgColor;

  ca.save();
  ca.translate($this.position.x,$this.position.y);

  if (this.moveXDir == -1) {
    ca.scale(-1, 1);    
  }

 
  if (this.selected == true) {
    ca.strokeStyle = "blue";
    ca.strokeRect(-($this.size.width/2), (-$this.size.height), ($this.size.width), ($this.size.height));
  }

  ca.fillRect((-$this.size.width/2), (-$this.size.height), ($this.size.width), ($this.size.height));

  ca.fillStyle = "#fff";
  ca.fillRect(($this.size.width/4), (-$this.size.height/1.1), ($this.size.width/5), ($this.size.height/5));

  ca.beginPath();
  ca.arc(0,0,10,0,Math.PI*2,true);
  ca.closePath();
  ca.fillStyle="#000";
  ca.fill();

  ca.restore();

}



Hero.prototype.planWaiter = function  () {  //目前和planMove一样
  var $this = this;
  var ca = Map.ctx;
  ca.fillStyle= this.bgColor;
 
  if (this.selected == true) {
    ca.strokeStyle = "blue";
    ca.strokeRect(($this.position.x - $this.size.width/2), ($this.position.y - $this.size.height), ($this.size.width), ($this.size.height));
  }

  ca.fillRect(($this.position.x - $this.size.width/2), ($this.position.y - $this.size.height), ($this.size.width), ($this.size.height));


  ca.beginPath();
  ca.arc($this.position.x,$this.position.y,10,0,Math.PI*2,true);
  ca.closePath();
  ca.fillStyle="#000";
  ca.fill();
}

Hero.prototype.moveTo = function  (x,y) {
  this.status = "move";
  var distanceX = x - this.position.x;
  var distanceY = y - this.position.y;
  var distance = Math.floor(Math.sqrt(distanceX*distanceX + distanceY*distanceY));
  
  if (distanceX == 0 && distanceY == 0) {
    this.status = "waiter";
    return
  }

  this.moveSpeedX = distanceX/distance * this.moveSpeed;
  this.moveSpeedY = distanceY/distance * this.moveSpeed;

  this.moveX = x;
  this.moveY = y;

  (this.moveX > this.position.x) ? (this.moveXDir = 1) : (this.moveXDir = -1);
  (this.moveY > this.position.y) ? (this.moveYDir = 1) : (this.moveYDir = -1);  
}

Hero.prototype.moveToPro = function  (fps) {
  
  var distanceX = this.position.x + this.moveSpeedX / fps - this.moveX;
  var distanceY = this.position.y + this.moveSpeedY / fps - this.moveY;

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
    this.position.x = this.moveX;
    this.position.y = this.moveY;
    //console.log(this.position);
    this.status = "waiter";
  }else {
    this.position.x += (this.moveSpeedX / fps);
    this.position.y += (this.moveSpeedY / fps);    
  }

  this.zIndex = Math.floor(this.position.y);
  
  this.planMove();

}

Hero.prototype.update = function  () {
  var $this = this;
  switch ($this.status) {
  case 'move':
    $this.moveToPro(Engine.fps);
  break

  case 'attack':
    $this.attackPro(Engine.fps);
  break

  case 'waiter':
    this.planMove();
  break

  default:
  }
}


Hero.prototype.attack = function  (enemy) {

  if (typeof enemy == "undefined") {
    this.status = "waiter";  
    return
  }

  this.status = "attack";

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

  this.attackMeasure = measure;
  this.enemy = enemy;
  this.enemyMeasure = measure;
  this.attackInOut = false;

  //this.attackStart = new Date().getTime();

  //enemy.life -= measure;


  //if (enemy.life < 0) {
  //  this.dead();
  //}
}

Hero.prototype.attackPro = function  (fps) {
  var $this = this;
  var speed = $this.attackSpeed / fps;

  ($this.attackProTime === undefined) ? $this.attackProTime = speed : $this.attackProTime += speed;
  
  //前摆
  this.planMove();

  



  if ($this.attackProTime > $this.attackInTime && ($this.attackInOut == false)) {  
    console.log($this.attackProTime,$this.attackInTime,$this.attackSpeed);
    $this.enemy.lift -= $this.enemyMeasure;
    $this.attackInOut = true;
  }

  //后摆
  this.planMove();

  if ($this.attackProTime > $this.attackSpeed) {
    $this.status = "waiter";
  }


}


Hero.prototype.dead = function  () {
  console.log('dead');
}


function Attack() {
  this.power = null;
}




var hero1 = new Hero();
var hero2 = new Hero();

hero1.position.x = -200;
hero1.position.y = 200;
hero1.bgColor = "#f64";

hero1.moveTo(200,200);

hero2.position.x = Map.obj.width + 200;
hero2.position.y = 200;
hero2.bgColor = "green";

hero2.moveSpeed = 300;

hero2.moveTo(Map.obj.width - 200,200);




//Engine
var Engine = new Object();

Engine.now = new Date().getTime() || null;
Engine.lastTime = null;
Engine.stop = false;
Engine.fps = 60;


Engine.getFps = function  () {
  if ((this.now - this.lastTime) > 1000) {
    this.fps = ((this.now - this.lastTime)/1000).toFixed(2) * 100;
    if (this.fps < 30) {
      this.fps = 30;
    }
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

Engine.view = function  () {
  
}

Engine.animate = function  (time) {
  var $this = Engine;

  if ($this.stop == true) {
    return Engine.requestAnimationFrame(Engine.animate);
  }
  
  $this.now = time || new Date().getTime();
  if ($this.lastTime == null) {
    $this.lastTime = $this.now;
  }
  $this.getFps();
  Map.reset();
  //hero1.update();
  Map.planObjs();


  Engine.requestAnimationFrame(Engine.animate);
}




//Engine.animate.call(Engine)

Engine.requestAnimationFrame(Engine.animate);
