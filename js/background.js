$plus = {};
chrome.tabs.onActivated.addListener(function($activeInfo) {
	if ($plus[$activeInfo.tabId]) {
		chrome.browserAction.setIcon({
			path : chrome.extension.getURL('/img/icon16.png')
		});
		chrome.browserAction.setPopup({
			popup : "/listCollection.html"
		});
	} else {
		chrome.browserAction.setIcon({
			path : chrome.extension.getURL('/img/icon16g.png')
		});
		chrome.browserAction.setPopup({
			popup : "/unsupport.html"
		});
	}
});
chrome.tabs.onUpdated.addListener(function($tabId) {
	if ($plus[$tabId]) {
		chrome.browserAction.setIcon({
			path : chrome.extension.getURL('/img/icon16.png')
		});
		chrome.browserAction.setPopup({
			popup : "/listCollection.html"
		});
	} else {
		chrome.browserAction.setIcon({
			path : chrome.extension.getURL('/img/icon16g.png')
		});
		chrome.browserAction.setPopup({
			popup : "/unsupport.html"
		});
	}
});
chrome.webRequest.onCompleted.addListener(function($details) {
	if ($details.type == 'main_frame') {
		delete $plus[$details.tabId];
		for ( var $i = 0; $i < $details.responseHeaders.length; $i++) {
			var $o = $details.responseHeaders[$i];
			if ($o.name == 'MicrosoftSharePointTeamServices') {
				$plus[$details.tabId] = true;
				break;
			}
		}
	}
	return {};
}, {
	urls : [ "http://*/*", "https://*/*" ]
}, [ "responseHeaders" ]);