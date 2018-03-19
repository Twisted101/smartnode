(function($) {
	function SmartNode() {
		var _this = this;
		
		$.ajax({
			type:"get",
			url:"data/data.json",
			async:true,
			success:function(data){
				console.log(data)
			}
		});
		
		this.emailItem = {
			newEmail: ko.observable('').extend({
				validation: [{
					validate: 'email'
				}]
			}),
			confirmNewEmail: ko.observable('').extend({
				validation: [{
					validate: 'email'
				}]
			})
		};
		
		this.emailIsValide = ko.computed(function() {
			if(_this.emailItem.newEmail.hasError() ||
				_this.emailItem.confirmNewEmail.hasError() ||
				_this.emailItem.newEmail() != _this.emailItem.confirmNewEmail()) {
				return false
			} else {
				return true
			}
		});

		this.passwordItem = {
			oldPW: ko.observable('').extend({
				validation: [{
					validate: 'notnull'
				}]
			}),
			newPW: ko.observable('').extend({
				validation: [{
					validate: 'notnull'
				}]
			}),
			confirmPW: ko.observable('').extend({
				validation: [{
					validate: 'notnull'
				}]
			})
		};

		this.openEmailModal = function() {
			$('#emailModal').modal()
		};

		this.openPhoneModal = function() {
			$('#phoneModal').modal()
		};

		this.openPasswordModal = function() {
			$('#passwordModal').modal()
		};

		this.modifyPassword = function() {
			if(_this.passwordItem.newPW() != _this.passwordItem.confirmPW()) {
				return;
			}
			var _postData = {};
		};
	}

	ko.applyBindings(new SmartNode());
})(jQuery)