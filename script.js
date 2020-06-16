var fgimg=null;
var bgimg=null;
var enc=null;
var dec=null;
var trunc=null;
var width,height;
function upload1(){
  var img=document.getElementById("fg");
  fgimg=new SimpleImage(img);
}
function up1(){
  var can=document.getElementById("can1");
  //fgimg.setSize(700,550);
  fgimg.drawTo(can);
}
function upload2(){
  var img=document.getElementById("bg");
  bgimg=new SimpleImage(img);
}

function up2(){
  var can=document.getElementById("can2");
  //bgimg.setSize(700,550);
  bgimg.drawTo(can);
}

function set_size(){
  width=fgimg.getWidth();
  height=fgimg.getHeight();
  if(bgimg.getWidth()<width){
    width=bgimg.getWidth();
  }
  if(bgimg.getHeight()<height){
    height=bgimg.getHeight();
  }
  fgimg.setSize(width,height);
  bgimg.setSize(width,height);
}

function cutoff(value){
  return Math.floor(value/16)*16;
}

function chop2hide(){
  var img=new SimpleImage(fgimg.getWidth(),fgimg.getHeight());
  for(var pix of fgimg.values()){
    var p=img.getPixel(pix.getX(),pix.getY());
    p.setRed(cutoff(pix.getRed()));
    p.setGreen(cutoff(pix.getGreen()));
    p.setBlue(cutoff(pix.getBlue()));
  }
  return img;
}

function shiftoff(value){
  return Math.floor(value/16);
}

function shift(){
  var img=new SimpleImage(bgimg.getWidth(),bgimg.getHeight());
  for(var pix of bgimg.values()){
    var p=img.getPixel(pix.getX(),pix.getY());
    p.setRed(shiftoff(pix.getRed()));
    p.setGreen(shiftoff(pix.getGreen()));
    p.setBlue(shiftoff(pix.getBlue()));
  }
  return img;
}

function combine(){
  var img=new SimpleImage(enc.getWidth(),enc.getHeight());
  for(var pix of enc.values()){
    var p=img.getPixel(pix.getX(),pix.getY());
    var trun=trunc.getPixel(pix.getX(),pix.getY());
    p.setRed(pix.getRed()+trun.getRed());
    p.setGreen(pix.getGreen()+trun.getGreen());
    p.setBlue(pix.getBlue()+trun.getBlue());
  }
  return img;
}

function doEncrypt(){
  //enc=new SimpleImage(fgimg);
  //trunc=new SimpleImage(bgimg);
  set_size();
  enc=chop2hide();
  trunc=shift();
  enc=combine();
  var can1=document.getElementById('can1');
  enc.drawTo(can1);
  var can2=document.getElementById("can2");
  var ctx=can2.getContext("2d");
  ctx.clearRect(0,0,can2.width,can2.height);
}

function remove_cover(){
  for(var pix of enc.values()){
    var p=dec.getPixel(pix.getX(),pix.getY());
    p.setRed((pix.getRed()%16)*16);
    p.setGreen((pix.getGreen()%16)*16);
    p.setBlue((pix.getBlue()%16)*16);
  }
  return dec;
}

function doDecrypt(){
  dec=new SimpleImage(enc.getWidth(),enc.getHeight());
  dec=remove_cover();
  var can1=document.getElementById('can2');
  dec.drawTo(can1);
  var can2=document.getElementById('can1');
  bgimg.drawTo(can2);
}

function cler(){
  var can=document.getElementById("can1");
  var ctx=can.getContext("2d");
  ctx.clearRect(0,0,can.width,can.height);
  var can1=document.getElementById("can2");
  var ctx1=can1.getContext("2d");
  ctx1.clearRect(0,0,can1.width,can1.height);

  document.getElementById("fg").value="";
  document.getElementById("bg").value="";
  bgimg=null;
  fgimg=null;
  enc=null; dec=null;
  trunc=null;
}