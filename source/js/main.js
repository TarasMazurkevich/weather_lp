'use strict';


// Back to Top - btn
var btnTop = $('.btn-top');

$(window).on('scroll', function(){
	if($(window).scrollTop() >= 670){
		btnTop.fadeIn();
	} else {
		btnTop.fadeOut();
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