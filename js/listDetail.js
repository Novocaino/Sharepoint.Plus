$(function() {
	JSRequest.EnsureSetup();
	var $id = JSRequest.QueryString['id'];
	chrome.tabs.getSelected(null, function($tab) {
		chrome.tabs.sendRequest($tab.id, {
			method : "call-getListDetail",
			listid : $id
		}, function($response) {
			$('.loading-icon').remove();

			if ($response.method == "call-getListDetail") {
				// error check
				if ($response.data.errorTypeName) {
					$('<div class="alert-exception alert alert-error">\
							<fieldset>\
								<legend>' + $response.data.errorTypeName + '</legend>\
								' + $response.data.message + '\
							</fieldset>\
					   </div>').appendTo('body');
					return;
				}

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

	$('.export-button').click(function() {
		var $button = $(this);
		if ($button.data('loading'))
			return;

		$('.alert').remove();

		if ($('.list-detail').size() == 0) {
			$('<div/>').addClass('alert alert-info').text('There is no data for export action.').appendTo('body');
			return;
		}

		$button.data('loading', 'loading');

		$('.caml-input').addClass('caml-loading');

		var $t = $('.body-container table');
		var $d = {
			title : {
				length : $t.find('thead th').size()
			},
			rows : []
		};
		$t.find('thead th').each(function($i) {
			$d.title[$i] = $(this).text();
		});
		$t.find('tbody tr').each(function($i) {
			var $r = {};
			var $tr = $(this);
			$tr.find('td').each(function($c) {
				$r[$c] = $(this).attr('title');
			});
			$d.rows.push($r);
		});

		chrome.tabs.getSelected(null, function($tab) {
			chrome.tabs.sendRequest($tab.id, {
				method : "call-export",
				filename : $('.list-title').text() + '.xls',
				data : generalSpreadsheet($d),
				listid : JSRequest.QueryString['id']
			}, function($response) {
				$button.removeData('loading');
				$('.caml-input').removeClass('caml-loading');
				if ($response.method == "call-export") {
					// do nothing
				}
			});
		});
	});
});