function bodyOnLoadWrapperForChrome() {
	if (typeof (_spBodyOnLoadWrapper) != 'undefined') {
		if (typeof (_spBodyOnloadCalled) == 'undefined' || !_spBodyOnloadCalled) {
			console.log('Sharepoint.plus: Start _spBodyOnLoadWrapper');
			_spBodyOnLoadWrapper();

			ExecuteOrDelayUntilScriptLoaded(function() {
				plus = new SPPlus();
			}, 'sp.js');
		}
	} else {
		setTimeout(bodyOnLoadWrapperForChrome, 100);
	}
}
function SPPlus() {
	var plus = this;
	plus.getAbsoluteUrl = function($path) {
		var $a = document.createElement('a');
		$a.href = $path;
		return $a.toString();
	};
	plus.fillObject = function($target, $source) {
		if (null == $source) {
			return $target;
		} else {
			for ( var $n in $source) {
				var $v = $source[$n];
				if (null == $v) {
					$target[$n] = $v;
				} else {
					$target[$n] = plus.lookforValue($v);
				}
			}
			return $target;
		}
	}
	plus.lookforValue = function($v) {
		switch ($v.constructor.getName()) {
		case 'SP.FieldUserValue':
		case 'SP.FieldLookupValue':
			return $v.get_lookupValue();
		case 'SP.FieldUrlValue':
			return {
				url : $v.get_url(),
				description : $v.get_description()
			};
		case 'SP.ContentTypeId':
			return $v.get_typeId();
		case 'SP.Guid':
			return $v.toString();
		case 'Array':
			var $a = [];
			for ( var $i = 0; $i < $v.length; $i++) {
				$a.push(plus.lookforValue($v[$i]));
			}
			return $a;
		default:
			return $v;
		}
		return $target;
	}
	plus.getBaseTypeName = function($baseType) {
		for ( var $n in SP.BaseType) {
			if ($baseType == SP.BaseType[$n]) {
				var $l = $n.split('');
				var $t = [];
				for ( var $i = 0; $i < $l.length; $i++) {
					if ($i == 0) {
						$t.push($l[$i].toUpperCase());
					} else if ($l[$i].toUpperCase() == $l[$i]) {
						$t.push(' ');
						$t.push($l[$i]);
					} else {
						$t.push($l[$i]);
					}
				}
				return $t.join('');
			}
		}
		return null;
	}
	plus.getListBaseTempldateName = function($baseTempldate) {
		for ( var $n in SP.ListTemplateType) {
			if ($baseTempldate == SP.ListTemplateType[$n]) {
				var $l = $n.split('');
				var $t = [];
				for ( var $i = 0; $i < $l.length; $i++) {
					if ($i == 0) {
						$t.push($l[$i].toUpperCase());
					} else if ($l[$i].toUpperCase() == $l[$i]) {
						$t.push(' ');
						$t.push($l[$i]);
					} else {
						$t.push($l[$i]);
					}
				}
				return $t.join('');
			}
		}
		return null;
	};
	plus.checkClientContext = function($callback) {
		if (typeof (SP) == 'undefined' || typeof (SP.ClientContext) == 'undefined') {
			$callback({
				errorTypeName : 'ObjectNotFoundException',
				message : 'Can not find sharepoint client script object SP.ClientContext.'
			});
			return false;
		} else {
			return true;
		}
	}
	plus.getListCollection = function($callback) {
		if (!plus.checkClientContext($callback)) {
			return;
		}
		var $clientContext = new SP.ClientContext.get_current();
		var $web = $clientContext.get_web();
		$clientContext.load($web);
		var $lists = $web.get_lists();
		$clientContext.load($lists);

		$clientContext.executeQueryAsync(//
		Function.createDelegate(this, function(sender, args) {
			var $enumerator = $lists.getEnumerator();
			var $listCollection = [];
			while ($enumerator.moveNext()) {
				var $list = $enumerator.get_current();
				$list = $list.get_objectData();
				$list = $list.get_properties();
				var $obj = plus.fillObject({}, $list);
				$obj.BaseTemplateName = plus.getListBaseTempldateName($obj.BaseTemplate);
				$obj.BaseTypeName = plus.getBaseTypeName($obj.BaseType);
				$listCollection.push($obj);
			}
			$callback({
				root : plus.getAbsoluteUrl('/'),
				web : plus.getAbsoluteUrl($web.get_serverRelativeUrl()),
				lists : $listCollection
			});
		}), //
		Function.createDelegate(this, function($sender, $args) {
			$callback({
				errorTypeName : $args.get_errorTypeName(),
				message : $args.get_message()
			});
		}));
	};
	plus.getListDetail = function($param, $callback) {
		if (!plus.checkClientContext($callback)) {
			return;
		}
		var $clientContext = new SP.ClientContext.get_current();
		var $web = $clientContext.get_web();
		$clientContext.load($web);
		var $list = $web.get_lists().getById($param.listid);
		$dd = $list;
		$clientContext.load($list);
		var $listFields = $list.get_fields();
		$clientContext.load($listFields);

		$clientContext.executeQueryAsync(//
		Function.createDelegate(this, function(sender, args) {
			var $fieldCollection = [];
			var $enumerator = $listFields.getEnumerator();
			while ($enumerator.moveNext()) {
				var $field = $enumerator.get_current();
				$aa = $field;
				$field = $field.get_objectData();
				$field = $field.get_properties();
				var $obj = plus.fillObject({}, $field);

				$fieldCollection.push($obj);
			}

			$callback({
				root : plus.getAbsoluteUrl('/'),
				web : plus.getAbsoluteUrl($web.get_serverRelativeUrl()),
				listid : $list.get_id().toString(),
				listtitle : $list.get_title(),
				listicon : plus.getAbsoluteUrl($list.get_imageUrl()),
				fields : $fieldCollection
			});
		}), //
		Function.createDelegate(this, function($sender, $args) {
			$callback({
				errorTypeName : $args.get_errorTypeName(),
				message : $args.get_message()
			});
		}));
	};
	plus.getListQuery = function($param, $callback) {
		if (!plus.checkClientContext($callback)) {
			return;
		}
		var $clientContext = new SP.ClientContext.get_current();
		var $web = $clientContext.get_web();
		$clientContext.load($web);
		var $list = $web.get_lists().getById($param.listid);
		$clientContext.load($list);
		var $camlQuery = new SP.CamlQuery();
		$camlQuery.set_viewXml($param.view);
		var $listItems = $list.getItems($camlQuery);
		$clientContext.load($listItems);

		$clientContext.executeQueryAsync(//
		Function.createDelegate(this, function(sender, args) {
			var $itemCollection = [];
			var $guids = [ 'Id' ];
			var $enumerator = $listItems.getEnumerator();
			while ($enumerator.moveNext()) {
				$item = $enumerator.get_current();
				$item = $item.get_objectData();
				$item = $item.get_methodReturnObjects()['$m_dict'];
				var $obj = plus.fillObject({}, $item);

				$itemCollection.push($obj);
			}

			$callback({
				root : plus.getAbsoluteUrl('/'),
				web : plus.getAbsoluteUrl($web.get_serverRelativeUrl()),
				listid : $list.get_id().toString(),
				items : $itemCollection
			});
		}), //
		Function.createDelegate(this, function($sender, $args) {
			$callback({
				errorTypeName : $args.get_errorTypeName(),
				message : $args.get_message()
			});
		}));
	};
	plus.export = function($param) {
		var $t = (new Date()).getTime().toString() + '.tmp';
		window.webkitRequestFileSystem(window.TEMPORARY, 128 * 128, function($fs) {
			$fs.root.getFile($t, {
				create : true
			}, function($fileEntry) {
				$fileEntry.createWriter(function($fileWriter) {
					// var $arr = new Uint8Array($param.data.length);
					// for ( var $i = 0; $i < $param.data.length; $i++) {
					// $arr[$i] = $param.data.charCodeAt($i);
					// }
					// var $blob = new Blob([ $arr ]);
					var $blob = new Blob([ $param.data ], {
						type : 'application/vnd.ms-excel'
					})

					$fileWriter.addEventListener("writeend", function() {
						// download
						var $a = document.createElement('a');
						$a.href = $fileEntry.toURL();
						$a.download = $param.filename;
						$a.click();
					}, false);

					$fileWriter.write($blob);
				}, function() {
				});
			}, function() {
			});
		}, function() {
		});
	}
}
