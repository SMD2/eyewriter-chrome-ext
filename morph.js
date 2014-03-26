var isAlreadyInjected = document.getElementById("ewMenu");

var settings = {};
//Load Settings
chrome.storage.local.get("settings", function (result){
	if (result.settings)
		settings = result.settings;
		countTillClick = settings.clickInterval*10;
});


if (!isAlreadyInjected) {
	// note that it's internal request to chrome extension pages
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", chrome.extension.getURL("/mnu.html"), false);
	xmlhttp.send();
	
	var body  = document.getElementsByTagName("body");
	var inHTML =
			'<div id="ewMenu" width="100%" style="position:fixed; top:0px; left:0px; opacity: 0.8; z-index: 3000;">' +
			xmlhttp.responseText + 
			'</div> <div id="ewBody" width="100%" style="position: relative; top: 80px;">' + 
			body[0].innerHTML + 
			"</div>";
	body[0].innerHTML=inHTML;		
	
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", chrome.extension.getURL("/style.css"), false);
	xmlhttp.send();
	
	var head  = document.getElementsByTagName("head");
	var x =head[0].innerHTML+
			'<style>' +
			xmlhttp.responseText + 
			'</style>' ;
			
	head[0].innerHTML=x;		
}


//4th Execute the first <script> tag from our HTML.
	console.log("morph.js :: Step #4 :: Execute JS from HTML");
	eval(inHTML.split("<script>")[1].split("</script>")[0]);

//5th Add mouseOver & mouseOut Event to each <ANCHOR> tag in the page.
	//Init global Vars
	//var backgroundGraduallyChanger=0;
	//var mouseEventBreaker=false;
	
	//Get all anchors
	var clickableTags = ["a", "button"];
	for (var tag = 0; tag < clickableTags.length; tag++) {
		var items = document.getElementsByTagName(clickableTags[tag]);
		console.log("morph.js :: Step #5 :: Found " + items.length + " <" + clickableTags[tag] +"> tags");
		//Iterate anchors and change them
		for (var i = items.length; i--;) {
			//Add MouseOverEvent
			if(items[i].className.indexOf("ew-")==-1){
				if (items[i].href){
					items[i].onmouseover=function(){
						myMouseOver(this, navigate, this.href);
					};
				}else if (items[i].click){
					items[i].onmouseover=function(){
						myMouseOver(this, buttonClick, this);
					};
				} 
				//Add MouseOutEvent
				items[i].onmouseout=function(){myMouseOut(this);};
			}
		}	
	}
	
	//Get all inputs
	var inputs = ["input", "textarea"];
	for (var tag = 0; tag < inputs.length; tag++) {
		var items = document.getElementsByTagName(inputs[tag]);
		console.log("morph.js :: Step #5 :: Found " + items.length + " <" + inputs[tag] +"> tags");
		//Iterate inputs and change them
		for (var i = items.length; i--;) {
			//Add MouseOverEvent
			if (items[i].type=="text"  || items[i].type=="search" || items[i].tagName=="TEXTAREA" ||
				items[i].type=="email"){
				items[i].onmouseover=function(){
					myMouseOver(this, setFocus, this);
				};
			}else if (items[i].type=="button" ||  items[i].type=="submit" ){
				console.log(items[i].onclick);
				items[i].onmouseover=function(){
					myMouseOver(this, buttonClick, this);
				};
			}
			//Add MouseOutEvent
			items[i].onmouseout=function(){myMouseOut(this);};
		}	
	}
	
	communicationTableConstructor();
	favoritesTableConstructor();

//FUNCTIONS
function buttonClick(elm){
	eval(elm.click(elm));
}

var timeoutId;
var countTillClick=100;
function myMouseOver(elm, callback, params){
	var backgroundGraduallyChanger=0;
	var mouseEventBreaker=false;
	animateBg(elm, callback, params);
	

	function animateBg(elm, callback, params) {
	    //elm.style.background  = 'hsl(' + backgroundGraduallyChanger + ', 100%, 50%)';
		var color1 = rgbToHex(backgroundGraduallyChanger/countTillClick*253, 255, 255);
		var percent = Math.round(backgroundGraduallyChanger/countTillClick*100);
		var hsla = 'hsla(' + percent + ', 100%, 50%, 1) ' + percent + "%"
		//(backgroundGraduallyChanger * 1).toString(16);
		//elm.setAttribute("style", "background: -webkit-gradient(linear,left top,left bottom,from(#" + color1.toString(16) + "),to(#" + (0xffffff-color1).toString(16) + "))!important ");
		elm.style.setProperty("background", "-webkit-radial-gradient(" + hsla + ", hsla(212, 67%,36%,0) 70%)","important");
	    //elm.style.backgroundColor = "rgba(255,0,0," + backgroundGraduallyChanger/100 + ")";
		//elm.setAttribute("style","background: rgba(255,0,0," + backgroundGraduallyChanger/100 + ")");
	     	timeoutId = setTimeout(function() {
	        backgroundGraduallyChanger++;
			if (backgroundGraduallyChanger<=countTillClick && !mouseEventBreaker){
				animateBg(elm, callback, params);
			}else{
				if (backgroundGraduallyChanger>=countTillClick){
						//elm.setAttribute("style", "rgba(0,255,0," + backgroundGraduallyChanger/100 + ")");
						backgroundGraduallyChanger=0;
						if (params) {
							callback(params);
						}
						else {
							callback();
						}
						
				}else{
					//mouseEventBreaker=false;
					//elm.style.background = '';
					//backgroundGraduallyChanger=0;
				}
				
			}
	    }, backgroundGraduallyChanger);
	}
}

function rgbToHex(r,g,b){
	return (r<<16)+(g<<8)+b
}

function myMouseOut(elm){
	//elm.style.background = '';
	//elm.removeAttribut = '';
	//elm.setAttribute("style", "background: '' ");
	elm.style.setProperty("background", "none","important");
	//elm.style.removeProperty("background","important");
	
	mouseEventBreaker=true;
	clearTimeout(timeoutId);
}

var activeMenu = null;
function show_menue(eId) {
	var mnu = document.getElementById(eId);
	if (mnu!=null){
		if (mnu.style.display=="none"){
			if (activeMenu)
				activeMenu.style.display="none";
			mnu.style.display="block";
			activeMenu = mnu;
		}else{
			console.log(mnu.style.display);
			mnu.style.display="none";
		}
	}
}

function hide_menue(eId) {
	if (document.getElementById(eId)!=null){
		document.getElementById(eId).style.display="none";
	}else{
		activeMenu.style.display="none";
	}
}

var continusScroller = undefined;
function startScroll(y) {
	if (!continusScroller) {
		continusScroller = setInterval(function(){scroll(y)},100);
	}
}

function stopScroll(elm) {
	clearInterval(continusScroller);
	continusScroller = undefined;
	myMouseOut(elm);
}

function scroll(y) {
	window.scrollBy(0,y); // horizontal and vertical scroll increments
}

function loadURL(url){
	if (url.substring(0,6)=="http://")
		navigate(url);
	else
		navigate("http://"+url);
}

function navigate(target) {
	window.location.href = target;
}

function setFocus(elm){
	if (document.activeElement==elm){
		elm.setSelectionRange(0, elm.value.length);
	}else{
		elm.focus();
	}
}

function tts(txt){
	var request = {
		op: "tts",
		tts: txt
	};
	chrome.runtime.sendMessage(request);
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
		

	function favoritesTableConstructor() {
		var numOfCols=4;
		chrome.storage.local.get("fav_value_arr",
			function (result)
			{
				console.log ("Loaded fav_value_arr");
				/* Create Table of Communications */
				var favTable = document.getElementById("favorites_table");
				favTable.innerHTML=""; //Clear
				var newTr=document.createElement("TR");
				var newInputText = document.createElement("INPUT");
				var i=0;
				for (var val in result.fav_value_arr) {

					var newTd=document.createElement("TD");
					var newP=document.createElement("P");
					if (val.length>15)
						var txt = val.substring(1,12) + "...";
					else
						var txt = val;
					var newTxt=document.createTextNode(txt);
					var newIMG=document.createElement("IMG");
					
					newIMG.src= "http://" + result.fav_value_arr[val].url.split("/")[2] + "/favicon.ico";
					
					newP.appendChild(newIMG);
					newP.appendChild(document.createElement("BR"));
					newP.appendChild(newTxt);
							
					newTd.setAttribute("ewLink", result.fav_value_arr[val].url); //We use the Set/Get Attribute because using vars directly has errors
					newTd.onmouseover=function(){
						myMouseOver(this, navigate, this.getAttribute("ewLink"));
					};
					newTd.onmouseout=function(){myMouseOut(this)};
										
					newTd.appendChild(newP);
					newTr.appendChild(newTd);
					
					if ((i+1) % numOfCols == 0) {
						console.log(i % numOfCols);
						favTable.appendChild(newTr);
						newTr=document.createElement("TR");
					}else{
						favTable.appendChild(newTr);
					}
					
					i++;
				}
				
				// Fill the rest of the table with empty TD's - so it'll look good :)
				for (var j=i % numOfCols; j<numOfCols; j++) {
					newTr.appendChild(document.createElement("TD"));
				}
				favTable.appendChild(newTr);
			
				
				// Create the commands of the communication menu - Buttons
				newTr=document.createElement("TR");
				newTd=document.createElement("TD");
				var newBtnAdd = document.createElement("IMG");
				var newBtnClose= document.createElement("IMG");
				
				newBtnAdd.src=chrome.extension.getURL("/images/add_to_fav.png");
				newBtnAdd.style.width = '100px';
				newBtnAdd.onmouseover = function(){myMouseOver(this, add_to_favorites); };
				newBtnAdd.onmouseout = function() { myMouseOut(this); };
				
				newBtnClose.src=chrome.extension.getURL("/images/close_fav.png");
				newBtnClose.style.width = '100px';
				newBtnClose.style.marginLeft = '100px';
				//newBtnClose.value="Close";
				//newBtnClose.className="ew-btn";
				newBtnClose.onmouseover = function(){myMouseOver(this, hide_menue); };
				newBtnClose.onmouseout = function() { myMouseOut(this); };
				
				newTd.colSpan=numOfCols;
				newTd.appendChild(newBtnAdd);
				newTd.appendChild(newBtnClose);
				newTr.appendChild(newTd);
				favTable.appendChild(newTr);
				
			});
	}

	function add_to_favorites() {
		chrome.storage.local.get("fav_value_arr", function (result){
				if (result.fav_value_arr)
					var newFavs = result;
				else
					var newFavs = {fav_value_arr : {}};
				
				newFavs.fav_value_arr[document.title]={url:window.location.href};
				chrome.storage.local.set({'fav_value_arr': newFavs.fav_value_arr});
				console.log ("Comm Added");
				favoritesTableConstructor();//Rebuild
			});
	}



/**************** Communication Menu ********************/
	function communicationTableConstructor() {
		var numOfCols=2;
		chrome.storage.local.get("comm_value_arr",
			function (result)
			{
				console.log ("Loaded comm_value_arr");
				/* Create Table of Communications */
				var commTable = document.getElementById("communication_table");
				var newTr=document.createElement("TR");
				var newInputText = document.createElement("INPUT");
				var i=0;
				for (var val in result.comm_value_arr) {

					var newTd=document.createElement("TD");
					var newP=document.createElement("P");
					var newTxt=document.createTextNode(val);
					
					newP.appendChild(newTxt);
					newP.onmouseover=function(){myMouseOver(this, function(that){
						var txt=that.innerHTML
						newInputText.value=txt;
						tts(txt);
					}, this)};
					newP.onmouseout=function(){myMouseOut(this)};
										
					newTd.appendChild(newP);
					newTr.appendChild(newTd);
					
					if (i % numOfCols != 0) {
						commTable.appendChild(newTr);
						newTr=document.createElement("TR");
					}else{
						commTable.appendChild(newTr);
					}
					
					i++;
				}
				
				// Fill the rest of the table with empty TD's - so it'll look good :)
				for (var j=i % numOfCols; j<numOfCols; j++) {
					newTr.appendChild(document.createElement("TD"));
				}
				commTable.appendChild(newTr);
			
				// Create the commands of the communication menu - Input
				newTr=document.createElement("TR");
				var newTd=document.createElement("TD");
				
				newInputText.type="Text";
				newInputText.value="Hello, world.";
				newInputText.id="tts-input-txt";
				newInputText.onmouseover = function(){myMouseOver(this, setFocus, newInputText); };
				newInputText.onmouseout = function() { myMouseOut(this); };
				
				newTd.colSpan=numOfCols;
				newTd.appendChild(newInputText);
				newTr.appendChild(newTd);
				commTable.appendChild(newTr);
				
				// Create the commands of the communication menu - Buttons
				newTr=document.createElement("TR");
				newTd=document.createElement("TD");
				var newBtnSave = document.createElement("IMG");
				var newBtnSay= document.createElement("IMG");
				var newBtnClose= document.createElement("IMG");
				
				newBtnSave.src=chrome.extension.getURL("/images/add_to_com.png");
				newBtnSave.style.width = '100px';
				newBtnSave.style.marginLeft = '100px';
				newBtnSave.onmouseover = function(){myMouseOver(this, add_to_communications, newInputText.value); };
				newBtnSave.onmouseout = function() { myMouseOut(this); };
				
				newBtnSay.src=chrome.extension.getURL("/images/tts.png");
				newBtnSay.style.width = '100px';
				newBtnSay.style.marginLeft = '100px';
				newBtnSay.onmouseover = function(){myMouseOver(this, tts, newInputText.value); };
				newBtnSay.onmouseout = function() { myMouseOut(this); };
				
				//newBtnClose.type="Button";
				//newBtnClose.value="Close";
				//newBtnClose.className="ew-btn";
				newBtnClose.src=chrome.extension.getURL("/images/close_comm.png");
				newBtnClose.style.width = '100px';
				newBtnClose.style.marginLeft = '100px';
				newBtnClose.onmouseover = function(){myMouseOver(this, hide_menue, "mnu_comm"); };
				newBtnClose.onmouseout = function() { myMouseOut(this); };
				
				newTd.colSpan=numOfCols;
				newTd.appendChild(newBtnSave);
				newTd.appendChild(newBtnSay);
				newTd.appendChild(newBtnClose);
				newTr.appendChild(newTd);
				commTable.appendChild(newTr);
				
			});
	}

	/*function save_default_comm() {
		var arr = {"YES":{},
				   "NO":{},
				   "PEE":{},
				   "POO":{},
				   "SMOKE":{},
				   "GO HOME":{},
				   "TARRANS":{}};
		chrome.storage.local.set({'comm_value_arr': arr});
	}*/
	
	function add_to_communications(txt) {
		chrome.storage.local.get("comm_value_arr", function (result){
				result.comm_value_arr[txt]={};
				chrome.storage.local.set({'comm_value_arr': result.comm_value_arr});
				console.log ("Comm Added");
			});
	}
	
	
