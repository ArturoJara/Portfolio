;(function($) {

  'use strict'; // Using strict mode

  // Vertical lines
  $('body').append('<div class="l1"></div><div class="l2"></div><div class="l3"></div>')

  // Page transitions

  $('a[href!=#][data-toggle!=tab][data-toggle!=collapse][target!=_blank][class!=anchor]').addClass('smooth');

  $('.smooth-transition').animsition({
    linkElement: '.smooth',
    inDuration: 500,
    outDuration: 500,
  });

  $('html').on('click', function(e){
    $('.navigation, .nav-trigger').removeClass('tapped');
  });

  $('.nav-trigger').on('click', function(e){
    e.stopPropagation();
    $('.navigation').toggleClass('tapped');
    if($('.navigation').hasClass('tapped'))
      $('.nav-trigger').addClass('tapped');
    else
      $('.nav-trigger').removeClass('tapped');
  });

  $('.navigation li').on('click', function(e){
    e.stopPropagation();
    $(this).toggleClass('tapped');
  });

  // Grid functions

  var $grid = $('.grid');

  $grid.imagesLoaded(function(){
    // Initialize Masonry after the images are loaded
    $grid.packery({
      itemSelector: '.item', // Portfolio item
    });
  });

  $('.filter-trigger').on('click', function(e){
    e.preventDefault();
    $('body').addClass('filters-active');
    $('html,body').animate({
      scrollTop: $('.grid').offset().top+'px'
    }, 500);
    $('.filter-container').fadeIn();
  });

  $('.filter-container').on('click', function(e){
    e.preventDefault();
    $('body').removeClass('filters-active');
    $('.filter-container').fadeOut();
  });

  $('.filter').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var selected = $(this).attr('data-filter');
    $('.filter.active').removeClass('active');
    $(this).addClass('active');
    $('.grid').find('.item:not(.'+selected+')').css({
      '-webkit-transition' : 'all .25s',
      'transition' : 'all .25s',
      '-webkit-transform' : 'scale(0)',
      'transform' : 'scale(0)',
      '-webkit-opacity' : '0',
      'opacity' : '0',
    });
    setTimeout(function(){
      $('.grid').find('.item:not(.'+selected+')').hide(0);
      $('.grid').find('.'+selected).show(0).css({
        '-webkit-transform' : 'scale(1)',
        '-webkit-opacity' : '1',
        'transform' : 'scale(1)',
        'opacity' : '1'
      });
      $grid.packery('layout');
    }, 250);
  });

  $(window).on('resize', function(){
    // Change Masonry on resize
    setTimeout(function(){
      $grid.packery('layout');
      window.requestAnimationFrame(inView); // Make new items visible
    }, 1500);
  });

  // You can use anchor links, using the .anchor class
  $('.anchor').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var href = $(this).attr('href');
    $('html,body').animate({
      scrollTop : $(href).offset().top+'px'
    });
  });

  // Parallax background script, use the ".parallax" class.
  var parallaxSpeed = 0.15;

  function parallax(){
    // Parallax scrolling function
    $('.parallax').each(function(){
      var el = $(this);
      var yOffset = $(window).scrollTop(),
          parallaxOffset = yOffset * parallaxSpeed,
          parallaxOffset = +parallaxOffset.toFixed(2);
      if(el.hasClass('fs')){
        el.css('transform','translate3d(-50%,-'+(50-parallaxOffset*0.15)+'%,0)');
      } else {
        el.css('transform','translate3d(0,'+parallaxOffset+'px,0)');
      }
    });
  }

  // Initialize functions on scroll
  $(window).on('scroll', function(){
    window.requestAnimationFrame(parallax); // Parallax
  });

  var $animation_elements = $('.item, .fadein'); // The fly-in element, used for elements that fly-in the window after they're visible on screen

  function inView() { // Function when element is in view
    var window_height =   $(window).height();
    var window_top_position =   $(window).scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    $.each($animation_elements, function() {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top-100;
      var element_bottom_position = (element_top_position + element_height);

      //check to see if this current container is within viewport
      if ((element_bottom_position >= window_top_position) &&
        (element_top_position <= window_bottom_position)) {
        $element.addClass('in-view');
      } else {
        $element.removeClass('in-view');
      }
    });
  }

  $(window).on('scroll resize', function(){
    window.requestAnimationFrame(inView);
    $('.anchor').each(function(){
      var id = '#'+$('.in-view').attr('id');
      if(id == $(this).attr('href')){
        $('.anchor').removeClass('active');
        $(this).addClass('active');
      }
    });
  });

  $(window).on('load', function(){
    window.requestAnimationFrame(inView);
  });

  $(window).on('pageshow', function(event) {
      if (event.originalEvent.persisted) {
          window.location.reload()
      }
  });

  // Contact form submission
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    
    // Basic form validation
    var $form = $(this);
    var $name = $form.find('input[name="name"]');
    var $email = $form.find('input[name="email"]');
    var $message = $form.find('textarea[name="message"]');
    var $status = $('#form-status');
    
    // Reset previous error states
    $('.form-control').removeClass('error');
    $status.empty();
    
    // Validate required fields
    var isValid = true;
    if (!$name.val().trim()) {
      $name.addClass('error');
      isValid = false;
    }
    if (!$email.val().trim() || !isValidEmail($email.val())) {
      $email.addClass('error');
      isValid = false;
    }
    if (!$message.val().trim()) {
      $message.addClass('error');
      isValid = false;
    }
    
    if (!isValid) {
      $status.html('<div class="alert alert-danger">Please fill in all required fields correctly.</div>');
      return;
    }
    
    // Disable submit button and show loading state
    var $submitBtn = $('#send');
    $submitBtn.prop('disabled', true).text('Sending...');
    $status.html('<div class="alert alert-info">Sending your message...</div>');
    
    // Get form data
    var formData = $form.serialize();
    
    // Send AJAX request
    $.ajax({
      type: 'POST',
      url: 'php/mail.php',
      data: formData,
      dataType: 'json',
      success: function(response) {
        if (response.status === 'success') {
          $status.html('<div class="alert alert-success">' + response.message + '</div>');
          // Reset form
          $form[0].reset();
        } else {
          $status.html('<div class="alert alert-danger">' + (response.message || 'An error occurred. Please try again.') + '</div>');
        }
      },
      error: function(xhr, status, error) {
        console.error('Form submission error:', error);
        $status.html('<div class="alert alert-danger">An error occurred while sending your message. Please try again later.</div>');
      },
      complete: function() {
        // Re-enable submit button
        $submitBtn.prop('disabled', false).text('Send message');
      }
    });
  });

  // Email validation helper function
  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

})(jQuery);
