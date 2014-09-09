$(function() {
	chrome.tabs.getSelected(null, function($tab) {
		chrome.tabs.sendRequest($tab.id, {
			method : "call-getListCollection"
		}, function($response) {
			if ($response.method == "call-getListCollection") {
				// error check
				if ($response.data.errorTypeName) {
					$('<h4/>').addClass('error').text($response.data.errorTypeName).appendTo('body');
					$('<h5/>').addClass('error').text($response.data.message).appendTo('body');
					return;
				}

				$('html,body').css({
					minWidth : 620
				});
				$('.loading-icon').remove();
				var $template = '<tr class="splist">\
								 	<td class="icon"><img class="list-icon" src="{ImageUrl}" /></td>\
									<td class="title"><a href="listDetail.html?id={ID}">{Title}</a></td>\
								 	<td class="type">{BaseTemplate}</td>\
								 	<td class="items">{ItemCount}</td>\
								 	<td class="last-modified">{LastItemModifiedDate}</td>\
									<td>\
										<a href="listDetail.html?id={ID}" title="Column Detail"><img class="list-icon" src="img/column.png" alt="Column Detail" /></a>\
										<a href="listQuery.html?id={ID}&title=%title%&icon=%ImageUrl%" title="New Query"><img class="list-icon" src="img/item.png" alt="New Query" /></a>\
									</td>\
								 </tr>';
				var $data = $response.data.lists;
				var $root = $response.data.root.substr(0, $response.data.root.length - 1);

				for ( var $b = 0; $b <= 5; $b++) {
					var $isHeaderRendered = false;
					var $table = $('<table/>').addClass('table').addClass('table-hover');
					for ( var $i = 0; $i < $data.length; $i++) {
						var $obj = $data[$i];
						if ($obj.BaseType != $b)
							continue;
						if ($obj.Hidden)
							continue;

						if (!$isHeaderRendered) {
							$isHeaderRendered = true;
							$('<h4/>').addClass('base-type').text($obj.BaseTypeName).appendTo('body');
							$table.appendTo('body');
						}
						var $row = $template;
						$row = $row.replace(/\{ID\}/gi, $obj.Id);
						$row = $row.replace(/\{ImageUrl\}/gi, $root + $obj.ImageUrl);
						$row = $row.replace(/%ImageUrl%/gi, encodeURIComponent($root + $obj.ImageUrl));
						$row = $row.replace(/\{Title\}/gi, $obj.Title);
						$row = $row.replace(/%Title%/gi, encodeURIComponent($obj.Title));
						$row = $row.replace(/\{BaseTemplate\}/gi, $obj.BaseTemplateName || $obj.BaseTemplate);
						$row = $row.replace(/\{ItemCount\}/gi, $obj.ItemCount);
						$row = $row.replace(/\{LastItemModifiedDate\}/gi, new Date($obj.LastItemModifiedDate).format('yyyy-mm-dd HH:MM'));
						$($row).appendTo($table);
					}
				}
				$('<small class="prhythm" style="clear: both; display: block; text-align: center;">Powered by Prhythm</small>').appendTo('body');
			}
		});
	});
});