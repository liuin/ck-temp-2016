function Block(number, point) {
  this.number = number;
  this.point = point;
  this.check = false;
  this.stact = "empty";
}

var blocklist = [];

var buildlist= [
  {
    "number":0,
    "point":[1,2,3,4,5,6]
  },
  {
    "number":1,
    "point":[0,2,6,-1,-1,-1]
  },
  {
    "number":2,
    "point":[0,1,3,-1,-1,-1]
  },
  {
    "number":3,
    "point":[0,-1,2,4,-1,-1]
  },
  {
    "number":4,
    "point":[0,-1,-1,3,5,-1]
  },
  {
    "number":5,
    "point":[0,6,-1,-1,4,-1]
  },
  {
    "number":6,
    "point":[0,-1,-1,1,5,-1]
  }
];

for(var i in buildlist){
  blocklist[i] = new Block(buildlist[i].number,buildlist[i].point);
  //console.log(blocklist[i]);
}





function searchBlock(formnumber, tonumber ){
  var startblock = blocklist[formnumber];
  var toblock = blocklist[tonumber];
  toblock.stact = "end";

  var count = 0;

//  console.log(blocklist.length);
  var proCount = 0;
//  return
//  while(count < blocklist.length){
//    if(count != 0){
//      startblock.
//      
//    }
//    
//
//
//    count++;
//    
//  }

  var getroot = [];

  
  
//  for (var i = 0;  i< startblock.point.length ; i++) {
//    getroot[i] = [];
//    if (buildlist[startblock.point[i]].stact != "end") {     
//      getroot[i].push(buildlist[startblock.point[i]].number);
//      checkNext(buildlist[startblock.point[i]],getroot[i]);
//
//    }else {
//      getroot[i].push(buildlist[startblock.point[i]].number + " end");
//    }
//  }
  var count = 0;
  function checkNext (blockCN,parentBlock) {   
    count++;

    if (count > 100) {
      return
    }

    blockCN.check = true;


    for (var i = 0;  i<blockCN.point.length; i++) {
      //blocklist[blockCN.point[i]].check = false;

      //root[i] = "";
      //console.log(blockCN.number,blockCN.point[i]);

      

      //if ((blockCN.point[i] != -1) && (blocklist[blockCN.point[i]].check != true)) {
      if ((blockCN.point[i] != -1) && (blocklist[blockCN.point[i]].check != true)) {
        
        if ((blocklist[blockCN.point[i]].stact != "end")) {
          
          //blocklist[blockCN.point[i]].check = true;
          //root[i].push(blocklist[blockCN.point[i]].number);          
          //root[i] += blocklist[blockCN.point[i]].number;
          console.log(blocklist[blockCN.point[i]].number,blocklist[blockCN.point[i]].check);
          
          getroot.push(blocklist[blockCN.point[i]].number);
          
          checkNext(blocklist[blockCN.point[i]],blockCN);

        }else{
       
          //console.log(blocklist[blockCN.point[i]].number + " end");
          //root[i].push(blocklist[blockCN.point[i]].number + " end");
          //root[i] += blocklist[blockCN.point[i]].number + " end";

          blockCN.check = false;

          //console.log(parentBlock);
          
          console.log(blockCN);
          for (var n = 0;  n<blockCN.point.length ; n++) {
              if (blockCN.point[n] != "-1" && blockCN.point[n] != startblock.number) {
                blocklist[blockCN.point[n]].check = false;
              }
          }
          
          console.log(blocklist[blockCN.point[i]].number + " end");
          //break;
        }
      }
    }
  }

  checkNext(startblock);

 
  
};



searchBlock(0,3);

