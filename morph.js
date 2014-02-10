// Global vars
//  Use for anchors MouseOver and MouseOut events

/*
var iFrame  = document.createElement ("iframe");
iFrame.src  = chrome.extension.getURL ("header.html");
iFrame.style.display="block";
iFrame.style.position="fixed";
iFrame.style.top="0";
iFrame.style.left="0";
iFrame.style.width="10%";
iFrame.style.height="100%";

document.body.insertBefore (iFrame, document.body.lastChild);
*/

	loadScript(chrome.extension.getURL('balloons/js/prototype.js'),function(){
		loadScript(chrome.extension.getURL('balloons/js/balloon.config.js'),function(){
			loadScript(chrome.extension.getURL('balloons/js/balloon.js'),function(){
				loadScript(chrome.extension.getURL('balloons/js/box.js'),function(){
					loadScript(chrome.extension.getURL('mnu_scripts.js'),function(){});	
	});});});});
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", chrome.extension.getURL("/mnu.html"), false);
xmlhttp.send();

 
var header_html="<p>Hello World!</p>";
var body  = document.getElementsByTagName ("body");
var inHTML=body[0].innerHTML;
inHTML=xmlhttp.responseText  + inHTML ;
body[0].innerHTML=inHTML;

//Run the first <script> tag at the loaded html.
eval(inHTML.split("<script>")[1].split("</script>")[0]);

function loadScript(url, callback)
{
	// Adding the script tag to the head as suggested before
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	// Then bind the event to the callback function.
	// There are several events for cross browser compatibility.
	script.onreadystatechange = callback;
	script.onload = callback;

	// Fire the loading
	head.appendChild(script);
}

var backgroundGraduallyChanger=0;
var mouseEventBreaker=0;

init();

function init(){
	console.log("morph.js :: init()");
	//Get all anchors
	var items = document.getElementsByTagName("a");
	console.log("morph.js :: init() :: found " + items.length + " anchors");
	//Iterate anchors and change them
	for (var i = items.length; i--;) {
		//Add MouseOverEvent
		items[i].onmouseover=function(){anchMouseOver(this);};
		//Add MouseOutEvent
		items[i].onmouseout=function(){anchMouseOut(this);};
	}
}


function anchMouseOver(elm){
	backgroundGraduallyChanger=0;
	animateBg(elm,0);
	//console.log(elm.href);
}

function anchMouseOut(elm){
	mouseEventBreaker=true;
	elm.style.background = '';
	//console.log(elm.href);
}

function animateBg(elm) {
    //elm.style.background  = 'hsl(' + backgroundGraduallyChanger + ', 100%, 50%)';
    elm.style.backgroundColor = "rgba(255,0,0," + backgroundGraduallyChanger/100 + ")";
    setTimeout(function() {
        backgroundGraduallyChanger++;
		if (backgroundGraduallyChanger<=100 && !mouseEventBreaker){
			animateBg(elm);
		}else{
			mouseEventBreaker=false;
			if (backgroundGraduallyChanger>=100){
					elm.style.backgroundColor = "rgba(0,255,0," + backgroundGraduallyChanger/100 + ")";
					window.location.href = elm.href;
			}
			backgroundGraduallyChanger=0;
		}
    }, backgroundGraduallyChanger);
}