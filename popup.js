	
function settOp() {
	var cbClickInterval, tvUserAgeng, cbIsExtEnabled;
	var settings;	
	
	init();
	
	function setListeners(){
		cbIsExtEnabled.onclick  = function(){
			saveChange(this.id, this.checked, true);
		};
	
		cbClickInterval.onchange  = function(){
			saveChange(this.id, this.value, false);
		};

		tvUserAgeng.onclick  = function(){
			saveChange(this.id, this.checked, true);
		};
	}

	function setDefaultValues(){
		if (settings!=undefined){
			cbClickInterval.value = settings.clickInterval;
			tvUserAgeng.checked = settings.useUserAgent;
			cbIsExtEnabled.checked = settings.isExtEnabled;
		}
	}

	function saveChange(key, val, refresh){
		if (settings==undefined)
			settings = { };
		settings[key]=val;
		chrome.storage.local.set({'settings': settings});
		
		var request = {
		op: "settingsChange",
		needRefresh: refresh
		};
		chrome.runtime.sendMessage(request);
	}

	function init (){
		cbClickInterval = document.getElementById("clickInterval");
		tvUserAgeng = document.getElementById("useUserAgent");
		cbIsExtEnabled = document.getElementById("isExtEnabled");
		
		chrome.storage.local.get("settings", function (result){
			if (result.settings==undefined){
				settings={};
			}
			else{
				settings=result.settings;
				setDefaultValues();				
			}

			setListeners();
		});
	}
	
}


// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
	settOp();
	//alert("a");
});
