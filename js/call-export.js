var plus;
(function(plus) {
	if (!plus) {
		plus = new SPPlus();
	}
	// get param
	var $paramObj = document.getElementById('sp-param-call-export');
	var $param = {};
	if ($paramObj) {
		for ( var $i = 0; $i < $paramObj.attributes.length; $i++) {
			var $attr = $paramObj.attributes[$i];
			$param[$attr.nodeName] = $attr.nodeValue;
		}
	}
	plus.export($param);
	var $result = document.createElement('span');
	$result.setAttribute('class', 'sp-result');
	document.body.appendChild($result);
})(plus || false);