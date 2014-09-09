$(function() {
	JSRequest.EnsureSetup();
	$('.list-image').attr('src', decodeURIComponent(JSRequest.QueryString['icon']));
	$('.list-title').text(decodeURIComponent(JSRequest.QueryString['title']));
	$('.header-container, .body-container').hide();
	$('<small class="prhythm" style="clear: both; display: block; text-align: center;">Powered by Prhythm</small>').appendTo('body');

	$('.execute-button').click(function() {
		var $button = $(this);
		if ($button.data('loading'))
			return;
		$button.data('loading', 'loading');

		$('.caml-input').addClass('caml-loading');
		$('.header-container, .body-container').hide();
		$('.list-detail').remove();
		$('.alert').remove();

		chrome.tabs.getSelected(null, function($tab) {
			chrome.tabs.sendRequest($tab.id, {
				method : "call-getListQuery",
				view : $('.caml-input').val(),
				listid : JSRequest.QueryString['id']
			}, function($response) {
				$button.removeData('loading');
				$('.caml-input').removeClass('caml-loading');
				if ($response.method == "call-getListQuery") {
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

					$('.header-container, .body-container').show();
					var $data = $response.data.items;
					var $root = $response.data.root.substr(0, $response.data.root.length - 1);

					// collect field name
					var $propertySet = {};
					for ( var $i = 0; $i < $data.length; $i++) {
						for ( var $n in $data[$i]) {
							$propertySet[$n] = true;
						}
					}

					var $propertyName = [];
					for ( var $n in $propertySet) {
						$propertyName.push($n);
					}
					$propertyName.sort();

					var $table = $('<table/>').addClass('table table-hover list-detail').appendTo('.body-container');
					// header
					var $header = $('<thead><tr></tr></thead>').appendTo($table).children('tr');
					for ( var $i = 0; $i < $propertyName.length; $i++) {
						$('<th/>').text($propertyName[$i]).appendTo($header);
					}
					// body
					var $body = $('<tbody/>').appendTo($table);
					for ( var $i = 0; $i < $data.length; $i++) {
						var $obj = $data[$i];
						var $row = $('<tr/>').appendTo($body);

						for ( var $n = 0; $n < $propertyName.length; $n++) {
							var $property = $propertyName[$n];
							if ($property in $obj) {
								var $v = $obj[$property];

								if ($v == null) {
									$('<td class="null-value" />').appendTo($row);
								} else if ($v && $v.constructor == Array) {
									$('<td />') //
									.attr('title', $v.join('; ')) //
									.append($('<span/>') //
									.addClass('single') //
									.text($v.join('; '))) //
									.appendTo($row);
								} else if ($v && $v.constructor == Object) {
									if ('url' in $v && 'description' in $v) {
										var $a = $('<a/>', {
											href : $v.url
										}).text($v.description ? $v.description : $v.url);
										$('<td />') //
										.attr('title', $v.description ? $v.description : $v.url) //
										.append($('<span/>') //
										.addClass('single') //
										.append($a)) //
										.appendTo($row);
									} else {
										$('<td />').attr('title', $v).append($('<span/>').addClass('single').text($v)).appendTo($row);
									}
								} else {
									$('<td />').attr('title', $v).append($('<span/>').addClass('single').text($v)).appendTo($row);
								}
							} else {
								$('<td class="lacked-value" />').appendTo($row);
							}
						}
					}

					fixedTableHeader();
				}
			});
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
				filename : decodeURIComponent(JSRequest.QueryString['title']) + '.xls',
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