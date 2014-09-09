(function() {
	// get param
	var $paramObj = document.getElementById('sp-param-call-getListQuery');
	var $param = {};
	if ($paramObj) {
		for ( var $i = 0; $i < $paramObj.attributes.length; $i++) {
			var $attr = $paramObj.attributes[$i];
			$param[$attr.nodeName] = $attr.nodeValue;
		}
	}
	plus.getListQuery($param, function($values) {
		var $result = document.createElement('span');
		$result.setAttribute('class', 'sp-result');
		$result.oninput = $values;
		document.body.appendChild($result);
	});
})();