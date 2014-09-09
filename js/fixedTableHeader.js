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