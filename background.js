var settings = {};
function loadSettings(needRefresh){
	chrome.storage.local.get("settings", function (result){
		if (result.settings)
			settings = result.settings;
	});
	
	if (needRefresh){
		//Refresh
		chrome.tabs.getSelected(null, function(tab) {
		var code = 'window.location.reload();';
		chrome.tabs.executeScript(tab.id, {code: code});
		});
	}
}

function click(e){
	chrome.tabs.query({currentWindow:true, active:true}, function(tabs){
		console.log("background.js :: click()");
	});
}
function load(tabId,  changeInfo, tab) {
	if (settings.isExtEnabled!=false){
		chrome.tabs.query({currentWindow:true, active:true}, function(tabs){
			var specTab = tabs[0];
			var url = specTab.url;
			
			if (url !== undefined && specTab.status == "complete") {
				console.log("background.js :: load()");
				chrome.tabs.executeScript(specTab.id, { file: "morph.js" });
				//chrome.tabs.executeScript(specTab.id, {code:"bgd();"});
			}
		});          
	}
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	
    if (request.op == "tts")
		say(request.tts);
	if (request.op == "settingsChange")
		loadSettings(request.needRefresh);
		
  });

function say(text){
	chrome.tts.speak(text);	
}

chrome.browserAction.onClicked.addListener(click);

chrome.tabs.onUpdated.addListener(load);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
        // Replace the User-Agent header
		if (settings.useUserAgent && settings.isExtEnabled!=false){
			var headers = info.requestHeaders;
			headers.forEach(function(header, i) {
				if (header.name.toLowerCase() == 'user-agent') { 
					header.value = ' Mozilla/5.0 (Linux; Android 4.1.2; GT-I9100 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36';
				}
			});  
			return {requestHeaders: headers};
		}
    },
    // Request filter
    {
        // Modify the headers for these pages
        urls: [
            "http://*/*",
            "https://*/*"
        ],
        // In the main window and frames
        types: ["main_frame", "sub_frame"]
    },
    ["blocking", "requestHeaders"]
);