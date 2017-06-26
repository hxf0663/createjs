/**
 * Created by huangxf on 2016/5/19.
 */
//Create a stage by getting a reference to the canvas
var canvas = document.getElementById("gameView");
var stage = new createjs.Stage(canvas);

var l=new createjs.Shape();
l.graphics.beginStroke("red");
l.graphics.setStrokeStyle(5);
l.graphics.setStrokeDash([20, 10], 0);
l.graphics.moveTo(50,250);
l.graphics.lineTo(180,180);
stage.addChild(l);
stage.update();

var cont = new createjs.Container();
stage.addChild(cont);
//容器封装
function ChildContainer(){
    var Rect = new createjs.Shape();
    Rect.graphics.setStrokeStyle(5);
    Rect.graphics.beginStroke("#000");
    Rect.graphics.beginFill("#f00");
    Rect.graphics.drawRect(0,0,150,150);
    Rect.graphics.endFill();
	Rect.rotation = 20;  //rotate around center
    var Text = new createjs.Text("HBY","30px Arial","#fff");
    this.addChild(Rect);
    this.addChild(Text);
}
ChildContainer.prototype = new createjs.Container();

var c = new ChildContainer();
cont.addChild(c);
cont.x=30;

//Create a Shape DisplayObject.
circle = new createjs.Shape();
circle.graphics.beginFill("blue").drawCircle(0, 0, 40);
//Set position of Shape instance.
circle.x = circle.y = 150;
//Add Shape instance to stage display list.
stage.addChild(circle);

//封装圆类
function Circle(){
    createjs.Shape.call(this);//调用构造方法
    this.setCircleType = function (type) {
        switch (type){
            case Circle.TYPE_RED:
                this.setColor("#FF0000");
                break;
            case Circle.TYPE_GREEN:
                this.setColor("#00FF00");
                break;
        }
    }
    this.setColor = function (color) {
        this.graphics.beginFill(color);
        this.graphics.drawCircle(400,50,100);
        this.graphics.endFill();
    }
    this.setCircleType(Circle.TYPE_RED);
}
Circle.prototype = new createjs.Shape();
Circle.TYPE_RED = 1;
Circle.TYPE_GREEN = 2;

var circle2 = new Circle();
circle2.setCircleType(2);
cont.addChild(circle2);

//Update stage will render next frame
stage.update();

//Simple Interaction Example
circle2.addEventListener("click", handleClick);
function handleClick(event){
    // Click happenened
    alert('you clicked me.');
}

//Simple Animation Example
//Update stage will render next frame
createjs.Ticker.setFPS(20);
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    //Circle will move 10 units to the right.
    circle.x += 10;
    //Will cause the circle to wrap back
    if (circle.x > stage.canvas.width) { circle.x = 0; }
    stage.update();
}

var bitmap = new createjs.Bitmap("img/v.jpg");
bitmap.scaleX = bitmap.scaleY =0.2;
bitmap.x = 200;
stage.addChild(bitmap);
stage.update();//图片加载完才能渲染到舞台

createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick",stage);
var mc = new createjs.MovieClip(null,0,true,{start:50,stop:0});
stage.addChild(mc);
var state1 = new createjs.Shape( new createjs.Graphics().beginFill("#999999").drawCircle(0,200,30));
var state2 = new createjs.Shape( new createjs.Graphics().beginFill("#555555").drawCircle(0,200,30));
mc.timeline.addTween(createjs.Tween.get(state1).to({x:0}).to({x:640},100).to({x:0},100));
mc.timeline.addTween(createjs.Tween.get(state2).to({x:640}).to({x:0},100).to({x:640},100));//整个时间线为100
mc.gotoAndPlay("start");

var ss = new createjs.SpriteSheet({
    "images":["img/ma.png"],
    "frames":{
        "width":179.75,
        "height":155.5,
        "count":8
    },
    "animations":{
        "state1":[0,3,"state2"],
        "state2":[4,7,"state1"]
    }
});
var s = new createjs.Sprite(ss,"state1");
s.x = s.y = 300;
stage.addChild(s);
createjs.Ticker.setFPS(10);
createjs.Ticker.addEventListener("tick",stage);

var cont2 = new createjs.Container();
stage.addChild(cont2);
cont2.x = 50;
cont2.y =300;
var content = new createjs.DOMElement("div1");
cont2.addChild(content);
stage.update();

createjs.CSSPlugin.install(createjs.Tween);
var btn = document.getElementById("popup");
btn.style.width = "120px";
btn.style.position = "absolute";
btn.style.left = "20px";
btn.style.top = "30px";
btn.style.padding = "10px";

var rr = new createjs.Shape();
rr.graphics.beginFill("#F00").drawRoundRect (0,500,100,50,20);
stage.addChild(rr);
createjs.Tween.get(rr,{loop:true},true)
    .to({x:canvas.width - 400,y:0,alpha:0.3,scaleX: 2,rotation: -30},2000,createjs.Ease.bounceOut)
    .to({x:0,scaleX: 1,rotation: 0},1000,createjs.Ease.backIn)
    .wait(1000)
    .to({alpha:1},800)
    .call(function(){console.log('tween complete.')});
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick",stage);

createjs.MotionGuidePlugin.install(createjs.Tween);
var ball = new createjs.Shape();
var b = ball.graphics;
b.beginFill("#F00").drawEllipse(0,0,80,50);
b.endFill();
createjs.Tween.get(ball,{loop:true},true)
    .to({guide:{path:[100,100,500,200,600,400],orient:true}},3000);
stage.addChild(ball);
createjs.Ticker.addEventListener("tick",stage);

//拖拽画图
var drawingCanvas;
var oldPt;
var oldMidPt;
var title;
var color;
var stroke;
var colors;
var index;

function initPT() {
    index = 0;
    colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

    //check to see if we are running in a browser with touch support
    stage.autoClear = false;
    stage.enableDOMEvents(true);

    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(24);

    drawingCanvas = new createjs.Shape();

    stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemouseup", handleMouseUp);

    title = new createjs.Text("Click and Drag to draw", "20px Arial", "#777777");
    title.x = 300;
    title.y = 200;
    stage.addChild(title);

    stage.addChild(drawingCanvas);
    stage.update();
}

function handleMouseDown(event) {
    if (!event.primary) { return; }
    if (stage.contains(title)) {
        stage.clear();
        stage.removeChild(title);
    }
    color = colors[(index++) % colors.length];
    stroke = Math.random() * 30 + 10 | 0;
    oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
    oldMidPt = oldPt.clone();
    stage.addEventListener("stagemousemove", handleMouseMove);
}

function handleMouseMove(event) {
    if (!event.primary) { return; }
    var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

    drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

    oldPt.x = stage.mouseX;
    oldPt.y = stage.mouseY;

    oldMidPt.x = midPt.x;
    oldMidPt.y = midPt.y;

    stage.update();
}

function handleMouseUp(event) {
    if (!event.primary) { return; }
    stage.removeEventListener("stagemousemove", handleMouseMove);
}
//initPT();

//弹出
$("#popup").click(function(){
    $('#mask').show();
    $("#pop1").show();
});

//关闭按钮
$(".close").click(function(){
    $('#mask').hide();
    $(this).parent().hide();
    //$(".box").hide();
});