(function($) {
	if ($) {
		if ($('meta[name="GENERATOR"][content="Microsoft SharePoint"]').size() > 0) {
			$.ajax({
				url : chrome.extension.getURL('js/fixScroll.js'),
				dataType : 'script'
			});
		}else{
			console.log('not found!');
		}
	}
})(jQuery);
