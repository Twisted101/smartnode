(function($) {
	$.fn.extend({
		scrollspy: function(options) {
			//参数和默认值
			var defaults = {
				el: $(this),
				container: $(window),
				liNumber: 'auto'
			};

			return this.each(function() {
				//this是DOM对象
				var o,
					p,
					el,
					w,
					pw,
					st,
					ln,
					ul,
					mouseWhellTimer,
					resizeTimer;

				o = $.extend(defaults, options); //参
				p = o.container;
				el = o.el;
				st = o.styleType;
				ln = o.liNumber;
				ul = o.ulDom;

				var pl,
					ell,
					lis,
					eachWidth,
					presentIndex;

				function resizeFun() {
					w = el.width();
					pw = p.width();
					o.liNumber === "auto" ? ln = Math.ceil(w / pw) : ln;
					ul.html('');
					if(ln == 1) {
						return;
					}
					var i = 0;
					! function() {
						if(i < ln) {
							i++;
							ul.append("<li></li>");
							arguments.callee();
						}
					}();
					lis = ul.children();
					lis.each(function(index) {
						$(this).on('click', function() {
							w = el.width();
							pw = p.width();
							lis.removeClass('active');
							lis.eq(index).addClass('active');
							//重新计算 
							var len = lis.length;
							var elOffsetLeft = (w + 60 - pw) * (index / (len - 1)); //偏移 +

							var currentLeft = $('body').scrollLeft();

							var scrollTimer = null;
							if(currentLeft < elOffsetLeft) {
								var intervalTime = (1000 / (elOffsetLeft - currentLeft)).toFixed(5);
								var nowLeft = currentLeft;
								scrollTimer = setInterval(function() {
									if(nowLeft < elOffsetLeft) {
										nowLeft += 15;
										$('body').scrollLeft(nowLeft)
									} else {
										$('body').scrollLeft(elOffsetLeft)
										clearInterval(scrollTimer)
									}

								}, intervalTime)
							};
							if(currentLeft > elOffsetLeft) {
								var intervalTime = (1000 / (currentLeft - elOffsetLeft)).toFixed(5);
								var nowLeft = currentLeft;
								scrollTimer = setInterval(function() {
									if(nowLeft > elOffsetLeft) {
										nowLeft -= 15;
										$('body').scrollLeft(nowLeft)
									} else {
										$('body').scrollLeft(elOffsetLeft)
										clearInterval(scrollTimer)
									}

								}, intervalTime)
							};

						})
					})
					eachWidth = w / ln; //等分宽度
					mousewhellFun();
				};

				function mousewhellFun() {
					if(lis) {
						p.is($(window)) ? pl = 0 : pl = p.offset().left;
						ell = el.offset().left;
						if(ln == 2) {
							var averageLen = (w - pw) / 2;
							if((pl - ell) <= averageLen) {
								lis.removeClass('active');
								lis.eq(0).addClass('active');
							};
							if((pl - ell) > averageLen) {
								lis.removeClass('active');
								lis.eq(1).addClass('active');
							};
							return;
						}
						presentIndex = Math.round((pl - ell) / eachWidth);
						lis.removeClass('active');
						lis.eq(presentIndex).addClass('active');
					}
				};
				//初始化

				resizeFun();
				mousewhellFun();

				mouseWhellTimer = null;
				$('body').bind('mousewheel', function() {
					clearTimeout(mouseWhellTimer);
					mouseWhellTimer = setTimeout(mousewhellFun, 100);
				});

				resizeTimer = null;
				$(window).bind('resize', function() {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(resizeFun, 100);
				});

			}); //return
		}
	});
})(jQuery);