(function() {
	plus.getListCollection(function($values) {
		var $result = document.createElement('span');
		$result.setAttribute('class', 'sp-result');
		$result.oninput = $values;
		document.body.appendChild($result);
	});
})();