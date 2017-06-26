var loader;
function init() {
	var manifest = [
		{id:"myPath_1", src:"img/v.jpg"},
		{id:"myPath_2", src:"汉仪菱心体简.ttf"},
		
		
	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", handleFileLoad);
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("progress", handleFileProgress);
	loader.loadManifest(manifest);
}

function handleFileProgress(event) {
	var percent = loader.progress*100|0;
	console.log(percent+'% loaded.');
		
}

function handleFileLoad(evt) {
	//console.log(evt);
}

function handleComplete() {
	$('#mask').hide();//隐藏加载层
}

$(document).ready(function(){
	$('#mask').show();
	init();
});