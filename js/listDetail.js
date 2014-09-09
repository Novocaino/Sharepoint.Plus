function fixedTableHeader() {
	var $table = $('.list-detail');

	// clone table
	var $headerClone = $table.clone();
	$headerClone.find('tbody').remove();
	$headerClone.find('thead tr').append($('<th/>').width(100));
	$headerClone.appendTo('.header-container');

	$table.find('thead').hide();

	// Set fixed width of header & body tables
	var $columnCount = $headerClone.find('thead th').size();
	for ( var $i = 0; $i < $columnCount; $i++) {
		var $w = Math.max($headerClone.find('tr th:eq(' + $i + ')').width(), $table.find('tr td:eq(' + $i + ')').width());
		$headerClone.find('tr th:eq(' + $i + ')').css({
			width : $w,
			minWidth : $w,
			maxWidth : $w
		});
		$table.find('tr td:eq(' + $i + ')').css({
			width : $w,
			minWidth : $w,
			maxWidth : $w
		});
	}

	$('.body-container').scroll(function() {
		$('.header-container').scrollLeft($(this).scrollLeft());
	});
}
$(function() {
	JSRequest.EnsureSetup();
	var $id = JSRequest.QueryString['id'];
	chrome.tabs.getSelected(null, function($tab) {
		chrome.tabs.sendRequest($tab.id, {
			method : "call-getListDetail",
			listid : $id
		}, function($response) {
			if ($response.method == "call-getListDetail") {
				// error check
				if ($response.data.errorTypeName) {
					$('<h4/>').addClass('error').text($response.data.errorTypeName).appendTo('body');
					$('<h5/>').addClass('error').text($response.data.message).appendTo('body');
					return;
				}

				$('.loading-icon').remove();
				$('.navbar, .header-container, .body-container').show();
				var $data = $response.data.fields;
				var $root = $response.data.root.substr(0, $response.data.root.length - 1);

				$('.list-title').text($response.data.listtitle);
				$('.list-image').attr('src', $response.data.listicon);
				$('.new-query').attr('href', 'listQuery.html?id=' + $response.data.listid + '&title=' + encodeURIComponent($response.data.listtitle) + '&icon=' + encodeURIComponent($response.data.listicon));

				// collect field name
				var $propertySet = {};
				for ( var $i = 0; $i < $data.length; $i++) {
					for ( var $n in $data[$i]) {
						$propertySet[$n] = true;
					}
				}
				var $pNames = [ 'Title', 'InternalName', 'StaticName', 'TypeDisplayName', 'TypeAsString', 'TypeShortDescription' ];
				var $propertyName = [];
				for ( var $n in $propertySet) {
					$propertyName.push($n);
				}
				$propertyName.sort();
				// remove specific property
				$.each($pNames, function($index) {
					$propertyName.splice($propertyName.indexOf($pNames[$index]), 1);
				})

				var $table = $('<table/>').addClass('table table-hover list-detail').appendTo('.body-container');
				// header
				var $header = $('<thead><tr></tr></thead>').appendTo($table).children('tr');
				$.each($pNames, function($index) {
					$('<th/>').text($pNames[$index]).appendTo($header);
				});
				for ( var $i = 0; $i < $propertyName.length; $i++) {
					$('<th/>').text($propertyName[$i]).appendTo($header);
				}
				// body
				var $body = $('<tbody/>').appendTo($table);
				for ( var $i = 0; $i < $data.length; $i++) {
					var $obj = $data[$i];
					var $row = $('<tr/>').appendTo($body);

					$.each($pNames, function($index) {
						$('<td/>').attr('title', $obj[$pNames[$index]]).append($('<span/>').addClass('single').text($obj[$pNames[$index]])).appendTo($row);
					});

					for ( var $n = 0; $n < $propertyName.length; $n++) {
						var $property = $propertyName[$n];
						if ($property in $obj) {
							if ($obj[$property] == null) {
								$('<td class="null-value" />').appendTo($row);
							} else {
								$('<td />').attr('title', $obj[$property]).append($('<span/>').addClass('single').text($obj[$property])).appendTo($row);
							}
						} else {
							$('<td class="lacked-value" />').appendTo($row);
						}
					}
				}

				fixedTableHeader();
			}
			$('<small class="prhythm" style="clear: both; display: block; text-align: center;">Powered by Prhythm</small>').appendTo('body');
		});
	});
});