class Hfchar {
  constructor(name) {
    this.name = name;
    this.xp = 0;         // x position
    this.yp = 0;         // y position
    this.zp = 0;         // z (layer) position
    this.wid = 128;      // width at normal scale
    this.xsc = 1;        // x scale
    this.ysc = 1;        // y scale
    this.asp = 1;        // aspect ratio
    this.xFlip = false;
    this.yFlip = false;
    this.rot = 0;        // rotation angle (degrees)
    this.img = false;    // image id or false
    this.vis = false;    // visibility
    this.speech = false; // speech bubble or false
    this.bubbleMode = "normal"
    this.label = false;  // label text or false
    this.labelSize = 24; // label font size
    this.xLabel = 0;
    this.yLabel = 0;
    this.labelMode = "centered";
    this.move = false;   // smooth move function or false
    this.stretch = false;// smooth stretch function or false
    this.spin = false;   // smooth spin function or false
  }
  updateMoves() {
    if (this.move !== false) {
      if (timer >= this.move[0]+this.move[1]) {
        this.xp = this.move[4]*evalPoly(1,this.move.slice(6,this.move.length));
        this.yp = this.move[5]*evalPoly(1,this.move.slice(6,this.move.length));
        this.move = false;
      }
    }
    if (this.stretch !== false) {
      if (timer >= this.stretch[0]+this.stretch[1]) {
        this.xsc = this.stretch[4]*evalPoly(1,this.stretch.slice(6,this.stretch.length));
        this.ysc = this.stretch[5]*evalPoly(1,this.stretch.slice(6,this.stretch.length));
        this.stretch = false;
      }
    }
    if (this.spin !== false) {
      if (timer >= this.spin[0]+this.spin[1]) {
        this.rot = aMode*this.spin[3]*evalPoly(1,this.spin.slice(4,this.spin.length));
        this.spin = false;
      }
    }
    if (this.move !== false) {
      this.xp = this.move[2]+(this.move[4]-this.move[2])*evalPoly((timer-this.move[0])/this.move[1],this.move.slice(6,this.move.length));
      this.yp = this.move[3]+(this.move[5]-this.move[3])*evalPoly((timer-this.move[0])/this.move[1],this.move.slice(6,this.move.length));
    }
    if (this.stretch !== false) {
      this.xsc = this.stretch[2]+(this.stretch[4]-this.stretch[2])*evalPoly((timer-this.stretch[0])/this.stretch[1],this.stretch.slice(6,this.stretch.length));
      this.ysc = this.stretch[3]+(this.stretch[5]-this.stretch[3])*evalPoly((timer-this.stretch[0])/this.stretch[1],this.stretch.slice(6,this.stretch.length));
    }
    if (this.spin !== false) {
      this.rot = aMode*(this.spin[2]+(this.spin[3]-this.spin[2])*evalPoly((timer-this.spin[0])/this.spin[1],this.spin.slice(4,this.spin.length)));
    }
  }
}

// speech bubble parameters
const B_TEXT_SIZE = 14;
const B_LINE_SPACE = 2;
const B_CORNER = 12;
const B_OUTLINE = 1;
const B_MARGIN = 8;
const B_DESCENT = 12;
const B_MAX_WIDTH = 200;
const B_MIN_WIDTH = 36;

let ver = 0; // HFRICTIONS version
let im; // only used for immage upload
let imgnames = ["whale.svg","koala_tree.svg","aple.svg"];
let imgshort = ["whale"    ,"koala tree"    ,"aple"    ];
let imgload  = [false      ,false           ,false     ];
let imgs     = [false      ,false           ,false     ];
let dWidths  = [128        ,192             ,64        ];

let inst = [[-1,-1],[0,-1,0],[0,17,-14],[0,18,8],[0,19,"whale"],[0,10,90],[0,1],[0,7,"Something long enough to line break."],[-1,0,10]]; // instructions
let cur = 0; // cursor position
let timeLast = 0; // time of last frame
let timeNext = 0; // time to execute next instruction
let scod = '';//'create(jeff);\njeff.image(whale)\njeff.label(-14,8,"whale",24);jeff.show();wait(1)\njeff.bub("Hello, I am Whale #292471208677, also known as Jeff.");\nwait(5);jeff.bub();wait(1);\njeff.bub("I will turn around");wait(0.61);jeff.flip(x)\nwait(1)\njeff.bub("Actually, I\'m over here now.")\njeff.x(-100.001)\nwait(2);jeff.rotate(180);wait(0.71828182845904);\njeff.bub(".");wait(0.5);jeff.bub("..");wait(0.5);jeff.bub("...");wait(1);\njeff.bub("I AM NOT A PON!")\nwait(0.8);\njeff.bub();\nnew(apon);apon.image(aple);apon.label(0,0,16,"PON");apon.bub("But I am!");apon.show();\ndelay(1.414213562373095);\napon.bub("Oh no! [reason]! I gotta hide!")\nwait(1);apon.glide(0,0,-100,0,1.618033988749895)\nwait(1);apon.bub()\nwait(1);apon.layer(-100);wait(1)\njeff.smoothRotate(180,360,0,1,0,0,10,-15,6)\nwait(1);jeff.unflip();jeff.bub("I don\'t see him anywhere...");wait(2);jeff.bub();\napon.glide(-100,0,156,-64,1.2);apon.flip(x)\napon.stretch(1,1,5,2,0.6);wait(0.6);apon.bub("I was behind you the entire time!");\napon.squish(5,2,1,1,0.6)\ndelay(0.6)\napon.bub("Because I\'m actually...");\nwait(2);apon.image(koala tree)\napon.label(24)\napon.bub("A koala PON!");wait(1)\njeff.bub("YORE KNOT A PONE")\nwait(0.2);apon.vis();\nwait(1.111);jeff.bub("the end");wait(0.5);jeff.bub();'; // string code
let vars = []; // variables
let chas = []; // characters
//let zps  = []; // used for layering
//let zpid = []; // used for layering
let timer = 0; // global timer
let startTime = 0;
let play = false;
let sms = ["Please insert some code\nor upload a project.","There was a problem\nimporting the file.","There was a problem\ncompiling the code.","Import successful!\nPress play to begin.","Compilation successful!\nPress play to begin.","Project stopped."];
let stopMessage = sms[0];
let fps = 60;
let notosans;
let xo = 320;let yo = 180;let xDir = 1;let yDir = -1;let aMode = 1; // set coordinate system
let bExport;let bImport;let bCompile;let bPlay;let bStop;
function preload() {
  notosans = loadFont("NotoSans-Medium.ttf");
}

function setup() {
  let canvas = createCanvas(640,360);
  canvas.parent("canvas-holder");
  //bImport = createFileInput(importImage);bImport.parent("image-input");bImport.id("import-file");
  for (let i = 0; i < imgs.length; i++) {
    imgload[i] = true;
    imgs[i] = loadImage("images/"+imgnames[i]);
  }
  bPlay = document.getElementById("play-button");
  bStop = document.getElementById("cease-button");
  bImport = document.getElementById("import-file");
  bExport = document.getElementById("export-image");
  bCompile = document.getElementById("compile-code");
  //bImport.addEventListener("change",importImage, false);
  //bExport.mousePressed(function(){encodeImage();});
  //encodeImage();
  inst = [];//interpretCode();
  background(255);
}

//function keyPressed() {if (key == 'e') {encodeImage();}}

function draw() {
  totalTimer = millis()/1000.0;
  timer = millis()/1000.0-startTime;
  //if (chas.length > 0) {chas[0].xp = timer*10;}
  if (play) {
  background(255);
  imageMode(CENTER);
  textAlign(CENTER,CENTER);
  textFont(notosans);
  fill(255);noStroke();
  
  // run instructions
  if (cur < inst.length) {
  while(timer > timeNext && timer-timeLast < 1/fps && cur<inst.length) {
    if (cur<inst.length){
    curin = inst[cur];
    if (curin[0] < 0) { // global instruction
      if (curin[1] == -1) {chas.push(new Hfchar("steve"));} // new character
      if (curin[1] == 0) {timeNext = timer+curin[2];}
      if (curin[1] == 11) {
        if(curin[2]==0){aMode=1;}
        if(curin[2]==1){aMode=360;}
        if(curin[2]==2){aMode=180/PI;}
        if(curin[2]==3){aMode=0.9;}
      }
    } else { // character instruction
      if (curin[1] == -1) {chas[curin[0]].img = curin[2];chas[curin[0]].asp = imgs[curin[2]].height/imgs[curin[2]].width;chas[curin[0]].wid=dWidths[curin[2]];}
      if (curin[1] == 0) {chas[curin[0]].vis = false;}
      if (curin[1] == 1) {chas[curin[0]].vis = true;}
      if (curin[1] == 2) {chas[curin[0]].vis = !chas[curin[0]].vis;}
      if (curin[1] == 3) {chas[curin[0]].xFlip = !chas[curin[0]].xFlip;}
      if (curin[1] == 4) {chas[curin[0]].yFlip = !chas[curin[0]].yFlip;}
      if (curin[1] == 5) {chas[curin[0]].xFlip = false;chas[curin[0]].yFlip = false;}
      if (curin[1] == 6) {chas[curin[0]].speech = false;}
      if (curin[1] == 7) {chas[curin[0]].speech = curin[2];}
      if (curin[1] == 9) {chas[curin[0]].zp = curin[2];}
      if (curin[1] == 10) {chas[curin[0]].xp = curin[2];}
      if (curin[1] == 11) {chas[curin[0]].yp = curin[2];}
      if (curin[1] == 12) {chas[curin[0]].rot = aMode*curin[2];}
      if (curin[1] == 13) {chas[curin[0]].rot += aMode*curin[2];}
      if (curin[1] == 14) {chas[curin[0]].rot = atan2(curin[2]-chas[curin[0]].xp,curin[3]-chas[curin[0]].yp);}
      if (curin[1] == 15) {chas[curin[0]].xsc = curin[2];}
      if (curin[1] == 16) {chas[curin[0]].ysc = curin[2];}
      if (curin[1] == 17) {chas[curin[0]].xLabel = curin[2];}
      if (curin[1] == 18) {chas[curin[0]].yLabel = curin[2];}
      if (curin[1] == 19) {chas[curin[0]].label = curin[2];}
      if (curin[1] == 20) {chas[curin[0]].move = [timer];chas[curin[0]].move.push(curin[6]);for (let i = 2; i < curin.length; i++) {if(i!=6){chas[curin[0]].move.push(curin[i]);}}}
      if (curin[1] == 21) {chas[curin[0]].spin = [timer];chas[curin[0]].spin.push(curin[4]);for (let i = 2; i < curin.length; i++) {if(i!=4){chas[curin[0]].spin.push(curin[i]);}}}
      if (curin[1] == 23) {chas[curin[0]].stretch = [timer];chas[curin[0]].stretch.push(curin[6]);for (let i = 2; i < curin.length; i++) {if(i!=6){chas[curin[0]].stretch.push(curin[i]);}}}
      if (curin[1] == 30) {chas[curin[0]].labelSize = curin[2];}
    }
    cur++;
    }
    timer = millis()/1000.0-startTime;
  }
  }
  // sort layers
  let zi = [];let zps = [];
  for (let i = 0; i < chas.length; i++) {zi.push(i);zps.push(chas[i].zp);chas[i].updateMoves();}
  zi.sort((a, b) => zps[a]-zps[b]);
  
  // draw frame
  
  for (let i = 0; i < chas.length; i++) {
    resetMatrix();
    if (chas[zi[i]].img !== false && chas[zi[i]].vis) {
      textSize(chas[zi[i]].labelSize);
      translate(xo+xDir*chas[zi[i]].xp,yo+yDir*chas[zi[i]].yp);
      rotate(PI*chas[zi[i]].rot/180.0);
      scale(chas[zi[i]].xsc,chas[zi[i]].ysc);
      if (chas[zi[i]].xFlip) {scale(-1,1);} if (chas[zi[i]].yFlip) {scale(1,-1);}
      image(imgs[chas[zi[i]].img],0,0,chas[zi[i]].wid,chas[zi[i]].wid*chas[zi[i]].asp);
      if (chas[zi[i]].xFlip) {scale(-1,1);} if (chas[zi[i]].yFlip) {scale(1,-1);}
      if (chas[zi[i]].label !== false) {text(chas[zi[i]].label,xDir*chas[zi[i]].xLabel*(1-2*chas[zi[i]].xFlip),yDir*chas[zi[i]].yLabel*(1-2*chas[zi[i]].yFlip));}
    }
  }
  //textFont('Helvetica');
  resetMatrix();
  textAlign(LEFT,BASELINE);textSize(B_TEXT_SIZE);
  for (let i = 0; i < chas.length; i++) { // draw speech bubbles
    if (chas[i].vis !== false && chas[i].speech !== false) {
      let mx;let bw;let dir;
      if (chas[i].xFlip) {dir = -1;mx = xo+chas[i].xp-chas[i].wid*chas[i].xsc/2;bw = mx;}
      else {dir = 1;mx = xo+chas[i].xp+chas[i].wid*chas[i].xsc/2;bw = width-mx;}
      let my = yo+yDir*chas[i].yp-chas[i].wid*chas[i].asp*chas[i].ysc/2;
      if (bw > B_MAX_WIDTH) {bw = B_MAX_WIDTH;}
      let spl = wrapText(chas[i].speech,bw-2*B_MARGIN);
      if (spl.length == 1 && textWidth(spl[0])+2*B_MARGIN < bw) {bw = textWidth(chas[i].speech)+2*B_MARGIN}
      if (spl.length > 1) {let mw=0;for(let j=0;j<spl.length;j++){if(textWidth(spl[j])>mw){mw=textWidth(spl[j])}}bw=mw+2*B_MARGIN;}
      if (bw < B_MIN_WIDTH) {bw = B_MIN_WIDTH;}
      let bh = B_TEXT_SIZE+(spl.length-1)*(B_TEXT_SIZE+B_LINE_SPACE)+2*B_MARGIN;
      stroke(0);strokeWeight(B_OUTLINE);fill(255);
      let d = 4/3*(sqrt(2)-1);
      beginShape();
      vertex(mx,my);
      vertex(mx+dir*B_CORNER,my-B_DESCENT);
      bezierVertex(mx+dir*B_CORNER*(1-d),my-B_DESCENT,mx,my-B_DESCENT-B_CORNER*(1-d),mx,my-B_DESCENT-B_CORNER);
      vertex(mx,my-bh-B_DESCENT+B_CORNER);
      bezierVertex(mx,my-bh-B_DESCENT+B_CORNER*(1-d),mx+dir*B_CORNER*(1-d),my-bh-B_DESCENT,mx+dir*B_CORNER,my-bh-B_DESCENT);
      vertex(mx+dir*(bw-B_CORNER),my-bh-B_DESCENT);
      bezierVertex(mx+dir*(bw-B_CORNER*(1-d)),my-bh-B_DESCENT,mx+dir*bw,my-bh-B_DESCENT+B_CORNER*(1-d),mx+bw*dir,my-bh-B_DESCENT+B_CORNER);
      vertex(mx+dir*bw,my-B_DESCENT-B_CORNER);
      bezierVertex(mx+dir*bw,my-B_DESCENT-B_CORNER*(1-d),mx+dir*(bw-B_CORNER*(1-d)),my-B_DESCENT,mx+dir*(bw-B_CORNER),my-B_DESCENT);
      vertex(mx+dir*2*B_CORNER,my-B_DESCENT);
      vertex(mx,my);
      endShape();
      //rect(mx,my-2*B_MARGIN-B_TEXT_SIZE,bw,2*B_MARGIN+B_TEXT_SIZE,B_CORNER,B_CORNER,B_CORNER,B_CORNER);
      fill(0);noStroke();
      if (dir == -1) {
        for (let j = 0; j < spl.length; j++) {text(spl[j],mx-bw+B_MARGIN-1,my-B_DESCENT-B_MARGIN-2-(B_TEXT_SIZE+B_LINE_SPACE)*(spl.length-j-1));}
      } else {
        for (let j = 0; j < spl.length; j++) {text(spl[j],mx+B_MARGIN,my-B_DESCENT-B_MARGIN-2-(B_TEXT_SIZE+B_LINE_SPACE)*(spl.length-j-1));}
      }
    }
  }
  timer = millis()/1000.0;
  timeLast = timer;
  } else {
    textFont(notosans);
    textAlign(CENTER,CENTER);
    noStroke();textSize(24);
    fill(160);rect(width/6,height/4,2*width/3,height/2);
    fill(0);text(stopMessage,width/2,height/2);
  }
}

function encodeImage() {
  let c = []; // color array (with 255 every 4th element since HFRICTIONS exports don't use alpha)
  c = [72,70,82,255,73,67,84,255,73,79,78,255,83,floor(ver/256),ver%256,255]; // 4 pixel header
  for (let i = 0; i < inst.length; i++) {
    let curin = inst[i];
    if (curin[0] < 0) {
      c.push(0);c.push(0);
      if (curin[1] == -1) {c.push(0);c.push(255);}
      if (curin[1] == 0) {c.push(1);c.push(255);c = c.concat(tobyte(curin[2]));c.push(0);c.push(255);}
      // to add: if+jump
      if (curin[1]==2){c.push(3);c.push(255);c.push(floor(curin[2]/65536));c.push(floor(curin[2]/256)%256);c.push(curin[2]%256);c.push(255);c=c.concat(tobyte(curin[3]));c.push(0);c.push(255);}
      if (curin[1]>9&&curin[1]<13){c.push(curin[1]+1);c.push(255);c.push(0);c.push(0);c.push(curin[2]);c.push(255);}
    } else {
      c.push((curin[0]+1)%256);c.push(floor((curin[0]+1)/256));
      if (curin[1] == -1) {c.push(0);c.push(255);c.push(floor(curin[2]/65536));c.push(floor(curin[2]/256)%256);c.push(curin[2]%256);c.push(255);}
      if (curin[1]>-1&&curin[1]<7){c.push(curin[1]+1);c.push(255);}
      if (curin[1] == 7) {c.push(8);c.push(255);for (let j = 0; j < curin[2].length; j++) {let k = curin[2].codePointAt(j);if (k>65535){j++;}c.push(floor(k/65536));c.push(floor(k/256)%256);c.push(k%256);c.push(255);}c.push(255);c.push(0);c.push(0);c.push(255);}
      if (curin[1]>8&&curin[1]<19&&curin[1]!=14){c.push(curin[1]+1);c.push(255);c = c.concat(tobyte(curin[2]));c.push(0);c.push(255);}
      if (curin[1]==14){c.push(15);c.push(255);c=c.concat(tobyte(curin[2]));c.push(255);c.push(255);c=c.concat(tobyte(curin[3]));c.push(0);c.push(255);}
      if (curin[1] == 19) {c.push(20);c.push(255);for (let j = 0; j < curin[2].length; j++) {let k = curin[2].codePointAt(j);if (k>65535){j++;}c.push(floor(k/65536));c.push(floor(k/256)%256);c.push(k%256);c.push(255);}c.push(255);c.push(0);c.push(0);c.push(255);}
      if (curin[1]>19&&curin[1]<24){c.push(curin[1]+1);c.push(255);for(let j = 2;j<curin.length-1;j++){c=c.concat(tobyte(curin[j]));c.push(255);c.push(255);}c=c.concat(tobyte(curin[curin.length-1]));c.push(0);c.push(255);}
      if (curin[1] == 30) {c.push(31);c.push(255);c = c.concat(tobyte(curin[2]));c.push(0);c.push(255);}
    }
  }
  while (floor(sqrt(c.length/4)) != sqrt(c.length/4)) {c.push(255);}
  let output = createImage(ceil(sqrt(c.length/4)),ceil(sqrt(c.length/4)));
  output.loadPixels();for (let i = 0; i < c.length; i++) {output.pixels[i] = c[i];}
  output.updatePixels();output.save("export","png");
}

function decodeImage() {
  im.loadPixels();
  let c = im.pixels;
  let O = [];
  let i = 16;
  //console.log(c);
  if(!(c[0]==72&&c[1]==70&c[2]==82&&c[4]==73&&c[5]==67&&c[6]==84&&c[8]==73&&c[9]==79&&c[10]==78&&c[12]==83)){console.log("Error: File is not an HFRICTIONS export");stopMessage = sms[1];return;}
  if(256*c[13]+c[14]>ver){console.log("Error: File is for a future version of HFRICTIONS");stopMessage = sms[1];return;}
  while (i < c.length && !(c[i]==255&&c[i+1]==255)) {
    let curin = [c[i]+c[i+1]*256-1,c[i+2]-1];i+=4;
    //console.log(curin);
    if (curin[0] < 0) {
      if (curin[1] == 0) {curin.push(tofloat(c[i],c[i+1],c[i+2],c[i+4],c[i+5],c[i+6],c[i+8],c[i+9]));i+=12;}
      // if+jump
      if (curin[1] == 2) {curin.push(c[i]*65536+c[i+1]*256+c[i+2]);i+=4;curin.push(tofloat(c[i],c[i+1],c[i+2],c[i+4],c[i+5],c[i+6],c[i+8],c[i+9]));i+=12;}
      if (curin[1]>9&&curin[1]<13){curin.push(c[i+2]);i+=4;}
    } else {
      if (curin[1] == -1) {curin.push(c[i]*65536+c[i+1]*256+c[i+2]);i+=4;}
      // accept a string input
      if (curin[1]==7||curin[1]==19) {let j = "";while(c[i]<18) {j=j+String.fromCodePoint(c[i]*65536+c[i+1]*256+c[i+2]);i+=4;}curin.push(j);i+=4;}
      // accepts any number of float inputs
      if(curin[1]>8&&curin[1]!=19){let j=255;while(j==255){
        j=c[i+10];curin.push(tofloat(c[i],c[i+1],c[i+2],c[i+4],c[i+5],c[i+6],c[i+8],c[i+9]));
        //if (j!=255) {console.log([c[i],c[i+1],c[i+2],c[i+4],c[i+5],c[i+6],c[i+8],c[i+9]]);}
        i+=12;
      }}
    }
    O.push(curin);
  }
  inst = O;stopMessage = sms[3];
}

function interpretCode() {
  let I = []; // input instructions
  let O = []; // output instructions
  let b = "";
  let p = 0; // in parentheses?
  for (let i = 0; i < scod.length; i++) {
    if (p === 0) {
      if (scod.charAt(i) === ";" || scod.charAt(i) === "\n" || i == scod.length-1) {
        if (scod.charAt(i) !== ';' && scod.charAt(i) !== '\n') {b += scod.charAt(i);}
        if (b != "") {I.push(b);}
        b = "";
      } else {
        b += scod.charAt(i);
        if (scod.charAt(i) == "(") {p = 1;}
      }
    } else if (p === 1) {
      b += scod.charAt(i);
      if (scod.charAt(i) == '"') {p = 2;}
      if (scod.charAt(i) == ')') {p = 0;} 
    } else if (p === 2) {
      b += scod.charAt(i);
      if (scod.charAt(i) == '"') {p = 1;}
    }
  }
  let nams = []; // list of namespaces
  let nam = ""; // current namespace
  let rnm = true; // reset namespace after instruction
  for (let i = 0; i < I.length; i++) {
    let g = "Error on \""+I[i]+"\": invalid argument(s)";
    let ï = [];
    let N = I[i].split("(")[0];
    if (N.split(".").length == 2) {nam = N.split(".")[0];N = N.split(".")[1];} else {if (rnm) {nam = "";}}
    let o = I[i].substring(o.indexOf("(")+1,o.length-1);
    //o=o.substring(0,o.length-1);
    if (nam === "") {
      ï.push(-1);
      if (N==="newCharacter"||N==="new"||N==="char"||N==="newChar"||N==="newchar"||N==="create"){ï.push(-1);if (o.charAt(0)==='"'&&o.charAt(o.length-1)==='"'){o=o.substring(1,o.length-1);}nams.push(o);}
      if (N === "wait" || N === "delay") {ï.push(0);ï.push(float(o));if (isNaN(float(o))){console.log(g);stopMessage = sms[2];return;}}
      if (N === "angleMode" || N === "angle") {ï.push(11);o=o.toUpperCase();
        if (o==="DEG"||o==="DEGREE"||o==="DEGREES"){ï.push(0);}
        else if (o==="REV"||o==="REVOLUTION"||o==="REVOLUTIONS"||o==="CYCLE"||o==="CYCLES"||o==="TURN"||o==="TURNS"){ï.push(1);}
        else if (o==="RAD"||o==="RADIAN"||o==="RADIANS"){ï.push(2);}
        else if (o==="GRAD"||o==="GRADIAN"||o==="GRADIANS"){ï.push(3);}
        else {console.log(g);stopMessage = sms[2];return;}
      }
    } else {
      let ñ = -1;
      for (let j = 0; ñ == -1 && j < nams.length; j++) {if (nams[j] === nam) {ñ = j;}}
      if (ñ == -1) {console.log("Error on \""+I[i]+"\": character does not exist.");stopMessage = sms[2];return;} else {
        ï.push(ñ);
        if (N==="image"||N==="appearance"||N==="costume"){
          if(o.charAt(0)==='"'&&o.charAt(o.length-1)==='"'){o=o.substring(1,o.length-1);}
          for(let í=0;í<imgshort.length;í++){if(imgshort[í]===o){ï.push(-1);ï.push(í);}}
          if (ï.length == 1) {console.log("Error on \""+I[i]+"\": could not find image");stopMessage = sms[2];return;}
        }
        if (N==="hide") {ï.push(0);}
        if (N==="show") {ï.push(1);}
        if (N==="vis"||N==="togglevis"||N==="toggleVisibility"||N=="visibility"){ï.push(2);}
        if (N==="flip") {if(o=='x'){ï.push(3);}else if(o=='y'){ï.push(4);}else{console.log("Error on \""+I[i]+"\": invalid flip axis");stopMessage = sms[2];return;}}
        if (N==="unflip") {ï.push(5);}
        if (N==="speechBubble"||N==="bubble"||N==="bub"){if(o===""){ï.push(6);}else{
          if(o.charAt(0)==='"'&&o.charAt(o.length-1)){o=o.substring(1,o.length-1);ï.push(7);ï.push(o);
          }else{console.log("Error on \""+I[i]+"\": string must be enclosed in quotes");stopMessage = sms[2];return;}
        }}
        if (N==="z"||N==="layer") {if (isNaN(float(o))) {console.log(g);stopMessage = sms[2];return;} else {ï.push(9);ï.push(float(o));}}
        if (N==="goto"||N==="go"){o=o.split(',');if(o.length!=2||isNaN(float(o[0]))||isNaN(float(o[1]))){console.log(g);stopMessage = sms[2];return;}else{
          ï.push(10);ï.push(float(o[0]));O.push(ï.slice());ï[1]=11;ï[2]=float(o[1]);
        }}
        if (N==="x") {if (isNaN(float(o))) {console.log(g);stopMessage = sms[2];return;} else {ï.push(10);ï.push(float(o));}}
        if (N==="y") {if (isNaN(float(o))) {console.log(g);stopMessage = sms[2];return;} else {ï.push(11);ï.push(float(o));}}
        if (N==="rotation"||N==="rot"||N==="dir"||N==="direction"||N==="point") {o=o.split(",");
          if (o.length == 1) {if(isNaN(float(o[0]))){console.log(g);stopMessage = sms[2];return;}else{
            ï.push(12);ï.push(float(o[0]));
          }} else if (o.length == 2) {if(isNaN(float(o[0]))||isNaN(float(o[1]))){console.log(g);stopMessage = sms[2];return;}else{
            ï.push(14);ï.push(float(o[0]));ï.push(float(o[1]));
          }} else {console.log(g);stopMessage = sms[2];return;}
        }
        if (N==="rotate"||N==="turn"){if (isNaN(float(o))) {console.log(g);stopMessage = sms[2];return;} else {ï.push(13);ï.push(float(o));}}
        if (N==="scale"||N==="size"){o=o.split(',');
          if (o.length == 1) {if(isNaN(float(o[0]))){console.log(g);stopMessage = sms[2];return;}else{
            ï.push(15);ï.push(float(o[0]));O.push(ï.slice());ï[1]=16;
          }} else if (o.length == 2) {if(isNaN(float(o[0]))||isNaN(float(o[1]))){console.log(g);stopMessage = sms[2];return;}else{
            ï.push(15);ï.push(float(o[0]));O.push(ï.slice());ï[1]=16;ï[2]=float(o[1]);
          }} else {console.log(g);stopMessage = sms[2];return;}
        }
        if (N==="label") {let ö=o.split(',');
          if(ö.length==1||(o.charAt(0)==='"'&&o.charAt(o.length-1)==='"')){if(isNaN(float(o))){ï.push(19);ï.push(o);}else{ï.push(30);ï.push(float(o));}
          }else if(ö.length==2){
            if(isNaN(float(ö[0]))&&!isNaN(float(ö[1]))){ï.push(30);ï.push(float(ö[1]));O.push(ï.slice());ï[1]=19;if(ö[0].charAt(0)==='"'&&ö[0].charAt(ö[0].length-1)==='"'){ö[0]=ö[0].substring(1,ö[0].length-1);}ï[2]=ö[0];
            }else if(isNaN(float(ö[1]))&&!isNaN(float(ö[0]))){ï.push(30);push(float(ö[0]));O.push(ï.slice());ï[1]=19;if(ö[1].charAt(0)==='"'&&ö[1].charAt(ö[1].length-1)==='"'){ö[1]=ö[1].substring(1,ö[1].length-1);}i[2]=ö[1];
            }else if(!isNaN(float(ö[0]))&&!isNaN(float(ö[1]))){ï.push(17);ï.push(float(ö[0]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[1]);
            }else{console.log(g);stopMessage = sms[2];return;}
          }else if(ö.length==3){
            if (!isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&!isNaN(float(ö[2]))){ï.push(17);ï.push(float(ö[0]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[1]);O.push(ï.slice());ï[1]=30;ï[2]=float(ö[2]);
            }else if(!isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&isNaN(float(ö[2]))){ï.push(17);ï.push(float(ö[0]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[1]);O.push(ï.slice());ï[1]=19;if(ö[2].charAt(0)==='"'&&ö[2].charAt(ö[2].length-1)==='"'){ö[2]=ö[2].substring(1,ö[2].length-1);}ï[2]=ö[2];
            }else if(isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&!isNaN(float(ö[2]))){ï.push(17);ï.push(float(ö[1]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[2]);O.push(ï.slice());ï[1]=19;if(ö[0].charAt(0)==='"'&&ö[0].charAt(ö[0].length-1)==='"'){ö[0]=ö[0].substring(1,ö[0].length-1);}ï[2]=ö[0];
            }else{console.log(g);stopMessage = sms[2];return;}
          }else if(ö.length==4){
            if(!isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&!isNaN(float(ö[2]))&&!isNaN(float(ö[3]))){
              ï.push(17);ï.push(float(ö[0]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[1]);O.push(ï.slice());ï[1]=30;ï[2]=float(ö[3]);O.push(ï.slice());ï[1]=19;ï[2]=ö[2];
            }else if(isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&!isNaN(float(ö[2]))&&!isNaN(float(ö[3]))){
              ï.push(17);ï.push(float(ö[1]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[2]);O.push(ï.slice());ï[1]=30;ï[2]=float(ö[3]);O.push(ï.slice());
              ï[1]=19;if(ö[0].charAt(0)==='"'&&ö[0].charAt(ö[0].length-1)==='"'){ö[0]=ö[0].substring(1,ö[0].length-1);}ï[2]=ö[0];
            }else if(!isNaN(float(ö[0]))&&isNaN(float(ö[1]))&&!isNaN(float(ö[2]))&&!isNaN(float(ö[3]))){
              ï.push(17);ï.push(float(ö[2]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[3]);O.push(ï.slice());ï[1]=30;ï[2]=float(ö[0]);O.push(ï.slice());
              ï[1]=19;if(ö[1].charAt(0)==='"'&&ö[1].charAt(ö[1].length-1)==='"'){ö[1]=ö[1].substring(1,ö[1].length-1);}ï[2]=ö[1];
            }else if(!isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&isNaN(float(ö[2]))&&!isNaN(float(ö[3]))){
              ï.push(17);ï.push(float(ö[0]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[1]);O.push(ï.slice());ï[1]=30;ï[2]=float(ö[3]);O.push(ï.slice());
              ï[1]=19;if(ö[2].charAt(0)==='"'&&ö[2].charAt(ö[2].length-1)==='"'){ö[2]=ö[2].substring(1,ö[2].length-1);}ï[2]=ö[2];
            }else if(!isNaN(float(ö[0]))&&!isNaN(float(ö[1]))&&!isNaN(float(ö[2]))&&isNaN(float(ö[3]))){
              ï.push(17);ï.push(float(ö[0]));O.push(ï.slice());ï[1]=18;ï[2]=float(ö[1]);O.push(ï.slice());ï[1]=30;ï[2]=float(ö[2]);O.push(ï.slice());
              ï[1]=19;if(ö[3].charAt(0)==='"'&&ö[3].charAt(ö[3].length-1)==='"'){ö[3]=ö[3].substring(1,ö[3].length-1);}ï[2]=ö[3];
            } else {console.log(g);stopMessage = sms[2];return;}
          }
        }
        if (N==="glide"||N==="move"||N==="smoothMove"){o=o.split(',');if(o.length<5){console.log(g);stopMessage = sms[2];return;}else{
          let B = false;for(let í=0;í<o.length;í++){if(isNaN(float(o[í]))){B = true;}}
          if (!B) {ï.push(20);for(let í=0;í<o.length;í++){ï.push(float(o[í]));}} else {console.log(g);stopMessage = sms[2];return;}
        }}
        if (N==="spin"||N==="smoothRotate"){o=o.split(',');if(o.length<3){console.log(g);stopMessage = sms[2];return;}else{
          let B = false;for(let í=0;í<o.length;í++){if(isNaN(float(o[í]))){B = true;}}
          if (!B) {ï.push(21);for(let í=0;í<o.length;í++){ï.push(float(o[í]));}} else {console.log(g);stopMessage = sms[2];return;}
        }}
        if (N==="stretch"||N==="squish"||N==="smoothScale"){o=o.split(',');if(o.length<5){console.log(g);stopMessage = sms[2];return;}else{
          let B = false;for(let í=0;í<o.length;í++){if(isNaN(float(o[í]))){B = true;}}
          if (!B) {ï.push(23);for(let í=0;í<o.length;í++){ï.push(float(o[í]));}} else {console.log(g);stopMessage = sms[2];return;}
        }}
      }
    }
    if (ï.length > 1) {O.push(ï);}
  }
  inst = O;stopMessage = sms[4];
}

function startPlay() {if(inst.length==0){stopMessage = sms[0];return;}cur = 0;vars = [];chas = [];let aMode = 1;timeLast = 0;timeNext = 0;startTime=millis()/1000.0;play = true;}
function stopPlay() {play = false;stopMessage = sms[5];}
function compileCode() {
  play = false;
  scod = document.getElementById("code-input").value;
  interpretCode();
}
function importImage() {
  play = false;stopMessage = sms[5];
  im = loadImage(URL.createObjectURL(document.getElementById("import-file").files[0]),decodeImage);
  //decodeImage();
  //}else{console.log("That is not an image!");}
}

function limg(name) {imgs[imgid] = loadImage(imgnames[imgid]);}

function tobyte(num) {
  let fa = new Float64Array(1);
  fa[0] = num;
  let ba = new Uint8Array(fa.buffer);
  return [ba[0],ba[1],ba[2],255,ba[3],ba[4],ba[5],255,ba[6],ba[7]];
}

function tofloat(b0, b1, b2, b3, b4, b5, b6, b7) {
  let ba = new Uint8Array(8);
  ba[0]=b0;ba[1]=b1;ba[2]=b2;ba[3]=b3;ba[4]=b4;ba[5]=b5;ba[6]=b6;ba[7]=b7;
  let fa = new Float64Array(ba.buffer);
  return fa[0];
}

function wrapText(text,wide) {
  let tl = [];
  let st = text.split('\n');
  for (let I = 0; I < st.length; I++) {
    let sw = st[I].trim().split(/\s+/);
    if (textWidth(sw.join(" ")) < wide) {tl.push(sw.join(" "));} else {
      let J = 0;let K = "";
      while (J < sw.length) {
        let failsafe = true
        while(failsafe || (textWidth(K+" "+sw[J]) < wide && J < sw.length)) {failsafe = false;K=K+" "+sw[J];J++;}
        tl.push(K);K="";
      }
    }
  }
  return tl;
}

function evalPoly(t,p) {if (p.length > 0) {let T = 1;let total = 0;for (let I = 0; I < p.length; I++) {T *= t;total += T*p[I];}return total;} else {return t;}}
