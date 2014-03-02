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

/*	loadScript(chrome.extension.getURL('balloons/js/prototype.js'),function(){
		loadScript(chrome.extension.getURL('balloons/js/balloon.config.js'),function(){
			loadScript(chrome.extension.getURL('balloons/js/balloon.js'),function(){
				loadScript(chrome.extension.getURL('balloons/js/box.js'),function(){
					loadScript(chrome.extension.getURL('mnu_scripts.js'),function(){});	
 	});});});});*/
	
//1st Load our JS for injection
	//console.log("morph.js :: Step #1 :: Load JS");
	//loadScript(chrome.extension.getURL('mnu_scripts.js'),function(){});	

//2nd Load our HTML for injection
	console.log("morph.js :: Step #2 :: Load HTML");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", chrome.extension.getURL("/mnu.html"), false);
	xmlhttp.send();

//3rd Inject our HTML to the top of the page <BODY> tag
	console.log("morph.js :: Step #3 :: Inject HTML");
	var body  = document.getElementsByTagName ("body");
	var inHTML=body[0].innerHTML;
	inHTML=xmlhttp.responseText  + inHTML ;
	body[0].innerHTML=inHTML;

//4th Execute the first <script> tag from our HTML.
	console.log("morph.js :: Step #4 :: Execute JS from HTML");
	eval(inHTML.split("<script>")[1].split("</script>")[0]);

//5th Add mouseOver & mouseOut Event to each <ANCHOR> tag in the page.
	//Init global Vars
	var backgroundGraduallyChanger=0;
	var mouseEventBreaker=false;
	//Get all anchors
	var items = document.getElementsByTagName("a");
	console.log("morph.js :: Step #5 :: Found " + items.length + " anchors");
	//Iterate anchors and change them
	for (var i = items.length; i--;) {
		//Add MouseOverEvent
		items[i].onmouseover=function(){myMouseOver(this, navigate, this.href);};
		//Add MouseOutEvent
		items[i].onmouseout=function(){myMouseOut(this);};
	}

//FUNCTIONS
function myMouseOver(elm, callback, params){
	backgroundGraduallyChanger=0;
	mouseEventBreaker=false;
	animateBg(elm, callback, params);
	//console.log(elm.href);
}

function myMouseOut(elm){
	mouseEventBreaker=true;
	elm.style.background = '';
	//console.log(elm.href);
}

function animateBg(elm, callback, params) {
    //elm.style.background  = 'hsl(' + backgroundGraduallyChanger + ', 100%, 50%)';
    elm.style.backgroundColor = "rgba(255,0,0," + backgroundGraduallyChanger/100 + ")";
    setTimeout(function() {
        backgroundGraduallyChanger++;
		if (backgroundGraduallyChanger<=100 && !mouseEventBreaker){
			animateBg(elm, callback, params);
		}else{
			if (backgroundGraduallyChanger>=100){
					elm.style.backgroundColor = "rgba(0,255,0," + backgroundGraduallyChanger/100 + ")";
					backgroundGraduallyChanger=0;
					callback(params);
			}else{
				//mouseEventBreaker=false;
				elm.style.background = '';
				backgroundGraduallyChanger=0;
			}
			
		}
    }, backgroundGraduallyChanger);
}

function navigate(target){
	window.location.href = target;
}


function loadScript(url, callback){
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

	function show_menue(eId){
		if (document.getElementById(eId)!=null){
			document.getElementById(eId).style.display="block";
		}
	}
	
	function load_favorits(){
		var storage_keys=["fav","fav2","fav3","fav4","fav5","fav6","fav7","fav8","fav9","fav10"];
		chrome.storage.local.get(storage_keys, function (items){
			console.log("mnu.html :: load_favorits() :: Found " + items.length + " links in storage");
			var liks_container=document.getElementById("favorites");
			for (fav in items){
				var anchor = document.createElement('a');	
				anchor.setAttribute('href', fav);
				console.log(items[fav]);
				anchor.appendChild(document.createTextNode(fav));
				//liks_container.appendChild(anchor);
			}
		});
		}
		
	function add_to_favorits(fav){
		var obj= { };
		obj[fav] = prompt("Please enter page URL:");
		chrome.storage.local.set(obj);
		console.log("mnu :: add_to_fav(" + fav + ")");
	}
	
	function test(){
		alert("TEST");
	}