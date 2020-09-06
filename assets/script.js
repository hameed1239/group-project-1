$(document).ready(function () {
$('.carousel-control').click(function(e){
	e.preventDefault();
	$('#myCarousel').carousel( $(this).data() );
});
});