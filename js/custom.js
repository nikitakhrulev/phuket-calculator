$(function(){
	'use-strict';

	function youTubes_makeDynamic() {
		var $ytIframes = $('iframe[src*="youtube.com"]');
		$ytIframes.each(function (i,e) {
			var $ytFrame = $(e);
			var ytKey; var tmp = $ytFrame.attr('src').split(/\//); tmp = tmp[tmp.length - 1]; tmp = tmp.split('?'); ytKey = tmp[0];
			var $ytLoader = $('<div class="ytLoader">');
			$ytLoader.append($('<img class="cover" src="https://i.ytimg.com/vi/'+ytKey+'/hqdefault.jpg">'));
			$ytLoader.append($('<img class="playBtn" src="../img/youtube.png">'));
			$ytLoader.data('$ytFrame',$ytFrame);
			$ytFrame.replaceWith($ytLoader);
			$ytLoader.click(function () {
				var $ytFrame = $ytLoader.data('$ytFrame');
				$ytFrame.attr('src',$ytFrame.attr('src')+'?autoplay=1');
				$ytLoader.replaceWith($ytFrame);
			});
		});
	};

	// sidenav control left
	$(".sidenav-control-left").sideNav({

		edge: 'left',
		closeOnClick: false

	});

	// // sidenav control right
	// $(".sidenav-control-right, .open-right-panel").sideNav({
		
	// 	edge: 'right',
	// 	closeOnClick: false

	// });

	// panel collapse icon
	$(document).on("click",".collapsible-header",function(){
	    $(this).find('span i').toggleClass('fa-chevron-down')
	});

	// slick slider
	// $('.slider-slick').slick({
		
	// 	infinite: true,
	// 	speed: 300,
	// 	slidesToShow: 1,
	// 	autoplay: true

	// });
	
	// faq collapse icon
	$(document).on("click",".faq-collapsible",function(){
	    $(this).find('i').toggleClass('fa-minus')
	});

	// testimonial
	// $("#testimonial").owlCarousel({
 
  //     	slideSpeed : 300,
  //     	paginationSpeed : 400,
  //     	singleItem: true,

  // 	});

	// tabs
	$('ul.tabs').tabs(); 

	// form date picker
	$('.datepicker').pickadate({
	    selectMonths: true, 
	    selectYears: 15
	});

	// form select
	$('select').material_select();
        
	$(document).ready(function () {youTubes_makeDynamic()});
});