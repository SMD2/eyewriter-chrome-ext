

function click(e){
	chrome.tabs.query({currentWindow:true, active:true}, function(tabs){
		console.log("background.js :: click()");
	});
}
function load(e){
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



chrome.browserAction.onClicked.addListener(click);
chrome.tabs.onUpdated.addListener(load);

										 
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
        // Replace the User-Agent header
        var headers = info.requestHeaders;
        headers.forEach(function(header, i) {
            if (header.name.toLowerCase() == 'user-agent') { 
                header.value = ' Mozilla/5.0 (Linux; Android 4.1.2; GT-I9100 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36';
            }
        });  
        return {requestHeaders: headers};
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