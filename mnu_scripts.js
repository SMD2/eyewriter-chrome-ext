   //var balloon    = new Balloon;

   // a plainer popup box
   //var box         = new Box;
   //BalloonConfig(box,'GBox');
	
	var backgroundGraduallyChanger=0;
	var mouseEventBreaker=false;
	
   function anchMouseOver2(elm, event, callback, params){
		mouseEventBreaker=false;
		backgroundGraduallyChanger=0;
		animateBg(elm,event,callback, params);
		//console.log(elm.href);
	}

	function anchMouseOut(elm){
		mouseEventBreaker=true;
		elm.style.background = '';
		//console.log(elm.href);
	}

	function animateBg(elm, event, callback, params) {
		//elm.style.background  = 'hsl(' + backgroundGraduallyChanger + ', 100%, 50%)';
		elm.style.backgroundColor = "rgba(255,0,0," + backgroundGraduallyChanger/100 + ")";
		setTimeout(function() {
			backgroundGraduallyChanger++;
			if (backgroundGraduallyChanger<=100 && !mouseEventBreaker){
				animateBg(elm, event, callback, params);
			}else{
				if (backgroundGraduallyChanger>=100){
						//document.getElementById(mnu_body).style.display="block";
						callback(params);
						elm.style.backgroundColor = "rgba(0,255,0," + backgroundGraduallyChanger/100 + ")";
						//balloon.showTooltip(event,'<iframe style=\'width:100%;height:100%\' frameborder=0 src=\'http://a.co.il\'></iframe>',1,6000,6000);
				}
				backgroundGraduallyChanger=0;
			}
		}, backgroundGraduallyChanger);
}
		
function show_menue_callback(eId){
	if (eId!=null)
		document.getElementById(eId).style.display="block";
}

