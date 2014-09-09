function bodyOnLoadWrapperForChrome() {
	if (typeof (_spBodyOnLoadWrapper) != 'undefined') {
		if (typeof (_spBodyOnloadCalled) == 'undefined' || !_spBodyOnloadCalled) {
			console.log('Sharepoint.plus: Start _spBodyOnLoadWrapper');
			_spBodyOnLoadWrapper();
		}
	} else {
		setTimeout(bodyOnLoadWrapperForChrome, 100);
	}
}
bodyOnLoadWrapperForChrome();