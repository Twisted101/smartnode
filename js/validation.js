(function() {
	function Validation() {
		// 扩展ko，添加numeric
		ko.extenders.validation = function(target, validationOption) {
			var validate = [],
				validateConfig,
				_type,
				hasError = ko.observable(true),
				vMsg = ko.observable('#默认的验证消息#');

			if(!validationOption) {
				validate.push(function() {
					return {
						err: true,
						msg: ''
					};
				});
			} else {
				if(!(validationOption instanceof Array)) {
					validationOption = [validationOption];
				}

				$.each(validationOption, function(index, value) {
					if(!value) {
						return;
					}

					var _tmpValidate;
					if(typeof value.validate === 'string') { // 默认支持的类型
						_type = value.validate;
						validateConfig = Validation.type[_type];
						if(!validateConfig) {
							throw new Error("Validation 不支持类型:" + _type);
						}
						_tmpValidate = validateConfig.validate;
						if(_type === 'digit') {
							_tmpValidate = $.proxy(_tmpValidate, this, value.min, value.max)
						} else if(_type === 'strlen') {
							_tmpValidate = $.proxy(_tmpValidate, this, value.max);
						} else if(_type === 'integer') {
							_tmpValidate = $.proxy(_tmpValidate, this, value.min, value.max)
						} else if(_type === 'integerAllow0') {
							_tmpValidate = $.proxy(_tmpValidate, this, value.min, value.max)
						} else if(_type === "intStrlen") {
							_tmpValidate = $.proxy(_tmpValidate, this, value.maxLen)
						} else if(_type === "password") {
							_tmpValidate = $.proxy(_tmpValidate, this, value.minLen, value.maxLen)
						}
					} else {
						_tmpValidate = value.validate;
					}

					validate.push(_tmpValidate);
				});
			}

			//create a writeable computed observable to intercept writes to our observable
			var result = ko.computed({
				read: target, //always return the original observables value
				write: function(newValue) {
					var current = target(),
						err = false,
						//valueToWrite,
						_msg = '';

					for(var i = 0; i < validate.length; i++) {
						var _tmpError = validate[i](newValue);
						if(_tmpError.err) {
							err = _tmpError.err;
							_msg = _tmpError.msg;
							break;
						}
					}
					target(newValue);
					vMsg(_msg);
					hasError(err);
				}
			}).extend({
				notify: 'always'
			});

			result.hasError = hasError;
			result.vMsg = vMsg;
			//initialize with current value to make sure it is rounded appropriately
			result(target());
			//return the new computed observable
			return result;
		};
	}

	Validation();

	Validation.type = {
		'notnull': {
			validate: function(val) {
				var _error = val == null || $.trim(val) == '';
				return {
					err: _error,
					msg: '不能为空！'
				};
			}
		},
		'digit': {
			validate: function(min, max, val) {
				var err = false,
					msg = '数字正确！';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					//err = !/^[0-9]+$/.test(val);
					err = !(!isNaN(parseFloat(val)) && isFinite(val));
					if(!err) {
						if(min != null && val < min) {
							err = true;
							msg = '不能小于' + min;
						}

						if(max != null && val > max) {
							err = true;
							msg = '不能大于' + max;
						}
					} else {
						msg = '只能为数字!';
					}
				}

				return {
					err: err,
					msg: msg
				};
			}
		},
		'integer': {
			validate: function(min, max, val) {
				var err = false,
					msg = '数字正确！';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					err = !/^[0-9.]+$/.test(val);
					if(!err) {
						if(val.includes(".")) {
							var _split = val.split(".");
							if(val.charAt(0) == "." || val.charAt(val.length - 1) == "." || _split.length > 2) {
								return {
									err: true,
									msg: "小数点位置或者个数不对"
								};
							}
						}
						if(min != null && val < min) {
							err = true;
							msg = '不能小于' + min;
						}

						if(max != null && val > max) {
							err = true;
							msg = '不能大于' + max;
						}
					} else {
						msg = '只能为整数或浮点数';
					}
				}
				return {
					err: err,
					msg: msg
				};
			}
		},
		'enumValue': {
			validate: function(val) {
				var err = false,
					msg = '数字正确！';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					err = !/^[0-9,.]+$/.test(val);
					if(!err) {
						if(val.includes(",")) {
							var _list = val.split(",");
							var _listHasError = false;
							$.each(_list, function(index, value) {
								if(value.includes(".")) {
									var _split = value.split(".");
									if(value.charAt(0) == "." || value.charAt(value.length - 1) == "." || _split.length > 2) {
										_listHasError = true;
										return false;
									}
								}
							});
							if(_listHasError) {
								return {
									err: true,
									msg: "枚举值中小数点位置或者个数不对"
								};
							}
						}

					} else {
						msg = '枚举值只能为整数和浮点数，以逗号分隔';
					}
				}
				return {
					err: err,
					msg: msg
				};
			}
		},
		'integerAllow0': {
			validate: function(min, max, val) {
				var err = false,
					msg = '数字正确！';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					err = !/^[0-9-.]+$/.test(val);
					if(!err) {
						if(0 != val) {
							if(min != null && val < min) {
								err = true;
								msg = '不能小于' + min;
							}

							if(max != null && val > max) {
								err = true;
								msg = '不能大于' + max;
							}
						}

					} else {
						msg = '只能为数字!';
					}
				}
				return {
					err: err,
					msg: msg
				};
			}
		},
		'intStrlen': {
			validate: function(max, val) {
				var err = false,
					msg = '数字正确！';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					err = !/^[0-9]+$/.test(val);
					if(!err) {
						if(val.length != max) {
							err = true;
							msg = '字符长度应该等于' + max;
						}
					} else {
						msg = '只能为数字';
					}
				}
				return {
					err: err,
					msg: msg
				};
			}
		},
		'ratio': {
			validate: function(val) {
				var err = false;
				var msg = '';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					err = !/^(\d+)\/(\d+)$/.test(val);
					if(err) {
						err = true;
						msg = '变比的输入格式为:【数字/数字】';
					}
				}
				return {
					err: err,
					msg: msg
				}
			}
		},
		'port': {
			validate: function(val) {
				var err = false,
					msg = '';

				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					val = $.trim(val);
					err = !/^[0-9]+$/.test(val);
					if(!err) {
						if(val < 1024 || val > 65535) {
							err = true;
							msg = '自定义端口号范围为1024-65535!';
						}
					} else {
						msg = '端口只能为数字';
					}
				}

				return {
					err: err,
					msg: msg
				}
			}
		},
		'alpha': {
			validate: function(val) {
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^[a-zA-Z]+$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: '只能为字母'
				};
			}
		},
		'alphanum': {
			validate: function(val) {
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^[a-zA-Z0-9_]+$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: '只能为数字或字母'
				};
			}
		},
		'alphanumHex': {
			validate: function(val) {
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^[a-fA-F0-9- ]+$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: '只能为16进制数和空格'
				};
			}
		},
		'alphanumscore': {
			validate: function(val) {
				// 'Slug' /^[a-z0-9-]+$/
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^[a-zA-Z0-9-_]+$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: '只能为数字，字母,-,_'
				};
			}
		},
		'charnumscore': {
			validate: function(val) {
				// 'Slug' /^[a-z0-9-]+$/
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^[\u4e00-\u9fa5a-zA-Z0-9-_/（）()\[\] ]*$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: '只能为中文，数字，字母,-,_,(),[]'
				};
			}
		},
		'ip': {
			validate: function(val) {
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					_error = !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: 'IP地址不正确'
				};
			}
		},
		'url': {
			validate: function(val) {
				var _error = false;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: 'URL地址不正确'
				};
			}
		},
		'strlen': {
			validate: function(maxLen, val) {
				var err = false,
					msg = '正确！';
				var tmp = val;
				//如果存在中文，将一个中文字符替换为“01”英文字符串
				if(undefined == tmp) {
					tmp = "";
				}
				tmp = tmp.replace(/[^\x00-\xff]/g, "01");
				if(val && (typeof val === 'string') && tmp.length > maxLen) {
					err = true;
					msg = '字符个数超过了' + maxLen + '个';
				}
				return {
					err: err,
					msg: msg
				};
			}
		},
		'email': {
			validate: function(val) {
				var _error;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					 _error = !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($.trim(val));
				}
				return {
					err: _error,
					msg: '邮箱格式不正确'
				};
			}
		},
		'password': {
			validate: function(minLen, maxLen, val) {
				var _error = false;
				var msg;
				if(val && (typeof val === 'string') && ('' != $.trim(val))) {
					var _error = !/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test($.trim(val));
					if(!_error) {
						if(val && (typeof val === 'string') && tmp.length > maxLen) {
							err = true;
							msg = '密码长度不能大于' + maxLen + '位';
						}

						if(val && (typeof val === 'string') && tmp.length < minLen) {
							err = true;
							msg = '密码长度不能少于' + maxLen + '位';
						}

					} else {
						msg = '只能为数字!';
					}
				}
				return {
					err: _error,
					msg: msg
				};
			}
		}
	};

	ko.data = ko.data || {};
	ko.data.Validation = Validation;
}());