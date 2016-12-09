var canvas =document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    W = window.innerWidth,
    H = window.innerHeight;
    
    canvas.width = W;
    canvas.height = H;
   
var color1 = "#6ca0f6";
var color2 = "#367aec";

var vertexes = [],
    verNum = 250,
    diffPt = [];


    
    for (var i = 0;i < verNum;i++) {
    	vertexes[i] = new Vertex(W/(verNum-1)*i,H/2,H/2);
    	diffPt[i] = 0;
    }

function draw(){
	//矩形1
	ctx.save();
	ctx.fillStyle = color1;
	ctx.beginPath();
	ctx.moveTo(0,H);
	ctx.lineTo(vertexes[0].x,vertexes[0].y);
	for (var i = 0;i<vertexes.length;i++) {
		ctx.lineTo(vertexes[i].x,vertexes[i].y);
	}
	ctx.lineTo(W,H);
	ctx.lineTo(0,H);
	ctx.fill();
	ctx.restore();
	
	//矩形2
	ctx.save();
	ctx.fillStyle = color2;
	ctx.beginPath();
	ctx.moveTo(0,H);
	ctx.lineTo(vertexes[0].x,vertexes[0].y);
	for (var i = 0;i<vertexes.length;i++) {
		ctx.lineTo(vertexes[i].x,vertexes[i].y);
	}
	ctx.lineTo(W,H);
	ctx.lineTo(0,H);
	ctx.fill();
	ctx.restore();
}


var vPos = 125; //震荡点
var dd = 15;    //缓冲
var autoDiff = 1000; //初始化差分值

function update(){
	autoDiff -= autoDiff * 0.9;    //1
	diffPt[vPos] = autoDiff;
	
	//左侧
	for (var i = vPos-1;i>0;i--) {  //2
		var d = vPos-i;
		if(d > dd){
			d=dd;
		}
		diffPt[i] -= (diffPt[i] - diffPt[i+1])*(1-0.01*d);
	}
	//右侧
	for (var i=vPos+1;i<verNum;i++) {     //3
		var d = i - vPos;
		if(d>dd){
			d=dd;
		}
		diffPt[i] -= (diffPt[i] - diffPt[i-1])*(1-0.01*d);
	}
	
	//更新Y坐标
	for (var i=0;i<vertexes.length;i++) {   //4
		vertexes[i].updateY(diffPt[i]);
	}
}
(function drawframe(){
	ctx.clearRect(0,0,W,H);
	window.requestAnimationFrame(drawframe,canvas);
	update();
	draw();
})();

canvas.addEventListener('mousedown',function(e){
	var mouse = {x:null,y:null};
	
	if(e.pageX || e.pageY){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	}else{
		mouse.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		mouse.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	//重设查分值
	if(mouse.y>(H/2-50)&&mouse.y<(H/2+50)){
		autoDiff = 1000;
		vPos = 1 + Math.floor((verNum - 2)*mouse.x/W);
		diffPt[vPos] = autoDiff;
	}
},false);
