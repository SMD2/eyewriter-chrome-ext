   var balloon    = new Balloon;

   // a plainer popup box
   var box         = new Box;
   BalloonConfig(box,'GBox');
   
	
	var backgroundGraduallyChanger=0;
	var mouseEventBreaker=0;
	
   function anchMouseOver(elm, event){
		backgroundGraduallyChanger=0;
		animateBg(elm,event);
		//console.log(elm.href);
	}

	function anchMouseOut(elm){
		mouseEventBreaker=true;
		elm.style.background = '';
		//console.log(elm.href);
	}

	function animateBg(elm, event) {
		//elm.style.background  = 'hsl(' + backgroundGraduallyChanger + ', 100%, 50%)';
		elm.style.backgroundColor = "rgba(255,0,0," + backgroundGraduallyChanger/100 + ")";
		setTimeout(function() {
			backgroundGraduallyChanger++;
			if (backgroundGraduallyChanger<=100 && !mouseEventBreaker){
				animateBg(elm, event);
			}else{
				mouseEventBreaker=false;
				if (backgroundGraduallyChanger>=100){
						elm.style.backgroundColor = "rgba(0,255,0," + backgroundGraduallyChanger/100 + ")";
						balloon.showTooltip(event,'<iframe style=\'width:100%;height:100%\' frameborder=0 src=\'http://a.co.il\'></iframe>',1,6000,6000);
				}
				backgroundGraduallyChanger=0;
			}
		}, backgroundGraduallyChanger);
}
   