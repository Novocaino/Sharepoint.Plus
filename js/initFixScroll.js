(function($) {
	if ($) {
		if ($('meta[name="GENERATOR"][content="Microsoft SharePoint"]').size() > 0) {
			$.ajax({
				async : false,
				url : chrome.extension.getURL('js/init.js'),
				dataType : 'script',
				success : function() {
					$.ajax({
						async : false,
						url : chrome.extension.getURL('js/fixScroll.js'),
						dataType : 'script'
					});
				}
			});
		}
	}
})(jQuery);

chrome.extension.onRequest.addListener(function($request, $sender, $sendResponse) {
	var $param = document.createElement('span');
	$param.setAttribute('id', 'sp-param-' + $request.method);
	for ( var $i in $request) {
		$param.setAttribute($i, $request[$i]);
	}
	document.body.appendChild($param);
	$.ajax({
		url : chrome.extension.getURL('js/' + $request.method + '.js'),
		dataType : 'script',
		success : function() {
			getResult($request, $sendResponse);
		}
	});
});

function getResult($request, $sendResponse) {
	if ($('.sp-result').size() == 0) {
		setTimeout(function() {
			getResult($request, $sendResponse)
		}, 1000);
	} else {
		var $data = $('.sp-result').get(0).oninput;
		$('.sp-result').remove(); // remove result temp
		$(document.getElementById('sp-param-' + $request.method)).remove(); // remove
		// param
		$sendResponse({
			data : $data,
			method : $request.method
		});
	}
}