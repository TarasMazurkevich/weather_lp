'use strict';


// Preloader
$(window).on('load', function () {
	var preloader = $('.loaderArea'),
    	loader = preloader.find('.loader');
	loader.delay(1000).fadeOut('slow');
	preloader.fadeOut('slow');
});


// Back to Top - btn
var btnTop = $('.btn-top');

$(window).on('scroll', function(){
	if($(window).scrollTop() >= $('.head').height() / 2){
		btnTop.fadeIn('slow');
	} else {
		btnTop.fadeOut('slow');
	};
});

btnTop.on('click', function(){
	$('html, body').animate({scrollTop:0}, 1000);
});


// Scrolling anchor
$('a[data-target^="anchor"]').bind('click.smoothscroll', function(){
	var elementClick = $(this).attr('href'),
		destination = $(elementClick).offset().top;

	$('html, body').animate({scrollTop: destination}, 1000);
	return false;
});


// Slider
$('.next').click(function(){

	var currentImg = $('.slider-img.active'),
		currentImgIndex = currentImg.index(),
		nextImgIndex = currentImgIndex + 1,
		prevImgIndex = currentImgIndex - 1,
		nextImg = $('.slider-img').eq(nextImgIndex),
		prevImg = $('.slider-img').eq(prevImgIndex);

	currentImg.css({
		"transition-property": "all",
		"transition-duration": "1s"
	});
	currentImg.removeClass('active').addClass('img-prev');
	prevImg.css({
		"transition-property": "all",
		"transition-duration": "1s"
	});
	prevImg.removeClass('img-prev').addClass('img-next');
	nextImg.css({
		"transition-property": "all",
		"transition-duration": "1s"
	});
	nextImg.removeClass('img-next').addClass('active');

	if(nextImgIndex == ($('.slider-img:last').index() + 1)){
		$('.slider-img').eq(0).css({
			"transition-property": "all",
			"transition-duration": "1s"
		});
		$('.slider-img').eq(0).addClass('active');
	} else {
		nextImg.css({
			"transition-property": "all",
			"transition-duration": "1s"
		});
		nextImg.addClass('active');
	};

});

$('.prev').click(function(){

	var currentImg = $('.slider-img.active'),
		currentImgIndex = currentImg.index(),
		nextImgIndex = currentImgIndex + 1,
		prevImgIndex = currentImgIndex - 1,
		nextImg = $('.slider-img').eq(nextImgIndex),
		prevImg = $('.slider-img').eq(prevImgIndex);

	currentImg.css({
		"transition-property": "all",
		"transition-duration": "1s"
	});
	currentImg.removeClass('active').addClass('img-next');
	prevImg.css({
		"transition-property": "all",
		"transition-duration": "1s"
	});
	prevImg.removeClass('img-prev').addClass('active');
	nextImg.css({
		"transition-property": "all",
		"transition-duration": "1s"
	});
	nextImg.removeClass('img-next').addClass('img-prev');

});