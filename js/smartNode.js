(function($) {
	$.StartScreen = function() {
		! function() {
			var groups = $(".tile-group");
			var tileAreaWidth = 80;
			var _width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
			$.each(groups, function(i, t) {
				if(_width <= 640) {
					tileAreaWidth = _width;
				} else {
					tileAreaWidth += $(t).outerWidth() + 80;
				}
			});
			$(".tile-area").css({
				width: tileAreaWidth
			});
			$(".tile-area").css({
				width: tileAreaWidth
			});
		}();

		//鼠标滚轮事件
		$("body").mousewheel(function(event, delta, deltaX, deltaY) {
			if(document.documentElement.clientWidth > 768) {
				var page = $('body');
				var scroll_value = delta * 50;
				page.scrollLeft(page.scrollLeft() - scroll_value);
				return false;
			}
		});
	}()

	//	改变窗口大小后，重新设置【.tile-group】的宽度  重新生成footer
	var resizeTimer;
	$(window).bind('resize', function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			if(document.documentElement.clientWidth > 768) {
				var _allWidth = 0;
				$.each($(".tile-group"), function(index, value) {
					var _width = $(value).outerWidth();
					_allWidth = _allWidth + _width + 80; //80 为.tile-group的margin-left
				});
				_allWidth = _allWidth + 80;
				$('.tile-area').css({
					width: _allWidth
				});
			};
		}, 500);
	});

	$("#tbColor").colorPicker();

	var $grid = $('.tile-container').isotope({
		layoutMode: 'masonryHorizontal',
		itemSelector: '.tile',
		animationEngine: 'css'
	});

	var i = 0;
	var len = $grid.length;

	$grid.on('arrangeComplete', function() {
		i++;
		if(i == len) {
			setTimeout(scrollspy, 1000);
			i = 0;
			return;
		}
	}).isotope();

	$grid.on('layoutComplete', function() {
		i++;
		if(i == len) {
			scrollspy();
			i = 0;
			return;
		}
	});

	function scrollspy() {
		$('#container').scrollspy({
			liNumber: 'auto',
			ulDom: $('.scrollspy'),
			liNumber: 'auto'
		});
	};

	$('.bgc').click(function() {
		$('.bgc').removeClass("element-selected");
		$(this).addClass("element-selected");
		var bg = 'bgc' + ($(this).index() + 1);
		$('body').removeClass();
		$('body').addClass(bg);
	})
	
	$(document).ready(function() {
		$(window).resize();
	});
	
	$('body').click(function(e) {
		if(e.target.className != 'iconfont menu-icon') {
			$('.menu-ul').slideUp(300);
		};
		if(e.target.className != 'iconfont user-icon') {
			$('.user-ul').slideUp(300);
		}
	})
	
	$('.menu').click(function() {
		$('.menu-ul').stop().slideToggle(300);
	})
	$('.user').click(function() {
		$('.user-ul').stop().slideToggle(300);
	})

})(jQuery);