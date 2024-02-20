(function($) {
	
	// Ajax QuickView
	jQuery(document).ready(function(){
		jQuery('a.quickview').click(function (e) {
			e.preventDefault();
			var self = $(this);
			self.parent().parent().parent().addClass('loading');
		    var productslug = jQuery(this).data('productslug');
		    var url = alit_ajax.ajaxurl + '?action=alit_quickview_product&productslug=' + productslug;
		    
	    	jQuery.get(url,function(data,status){
		    	$.magnificPopup.open({
					mainClass: 'apus-mfp-zoom-in',
					items    : {
						src : data,
						type: 'inline'
					}
				});
				// variation
                if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
                    $( '.variations_form' ).each( function() {
                        $( this ).wc_variation_form().find('.variations select:eq(0)').change();
                    });
                }
                var config = {
                    loop: false,
                    nav: true,
                    dots: false,
                    items: 1,
                    navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
                    responsive: {
	                    0:{
	                        items: 1
	                    },
	                    320:{
	                        items: 1
	                    },
	                    768:{
	                        items: 1
	                    },
	                    980:{
	                        items: 1
	                    },
	                    1280:{
	                        items: 1
	                    }
	                }
                };
                $(".quickview-owl").owlCarousel( config );
                
				self.parent().parent().parent().removeClass('loading');
		    });
		});
	});
	
	// thumb image
	$('.thumbnails-image .thumb-link, .lite-carousel-play .thumb-link').each(function(e){
		$(this).click(function(event){
			event.preventDefault();
			$('.main-image-carousel').trigger("to.owl.carousel", [e, 0, true]);
			
			$('.thumbnails-image .thumb-link').removeClass('active');
			$(this).addClass('active');
			return false;
		});
	});
	$('.main-image-carousel').on('changed.owl.carousel', function(event) {
		setTimeout(function(){
			var index = 0;
			$('.main-image-carousel .owl-item').each(function(i){
				if ($(this).hasClass('active')){
					index = i;
				}
			});
			$('.thumbnails-image .thumb-link').removeClass('active');
			
			if ( $('.thumbnails-image .lite-carousel-play').length > 0 ) {
				$('.thumbnails-image li').eq(index).find('.thumb-link').addClass('active');
			} else {
				$('.thumbnails-image .owl-item').eq(index).find('.thumb-link').addClass('active');
			}
		},50);
    });
	// change thumb variants
	$( 'body' ).on( 'found_variation', function( event, variation ) {
    	if ( variation && variation.image_src && variation.image_src.length > 1 ) {
    		$('.main-image-carousel .owl-item').each(function(i){
    			var src = $('img', $(this)).attr('src');
    			if (src === variation.image_src) {
    				$('.main-image-carousel').trigger("to.owl.carousel", [i, 0, true]);
    			}
    		});
    	}
	});

	// review
    $('.woocommerce-review-link').click(function(){
        $('.woocommerce-tabs a[href="#tabs-list-reviews"]').click();
        $('html, body').animate({
            scrollTop: $("#reviews").offset().top
        }, 1000);
        return false;
    });
    
    if ( $('.comment-form-rating').length > 0 ) {
        var $star = $('.comment-form-rating .filled');
        var $review = $('#rating');
        $star.find('li').on('mouseover',
            function () {
                $(this).nextAll().find('span').removeClass('fa-star').addClass('fa-star-o');
                $(this).prevAll().find('span').removeClass('fa-star-o').addClass('fa-star');
                $(this).find('span').removeClass('fa-star-o').addClass('fa-star');
                $review.val($(this).index() + 1);
            }
        );
    }
    // login/register
    $('body').on( 'click', '.register-login-action', function(e){
    	e.preventDefault();
    	var href = $(this).attr('href');
    	setCookie('alit_login_register', href, 0.5);
    	$('.register_login_wrapper').removeClass('active');
    	$(href).addClass('active');
    } );
    $('.login-link').click(function(){
    	setCookie('alit_login_register', '#customer_login', 0.5);
    });
    $('.register-link').click(function(){
    	setCookie('alit_login_register', '#customer_register', 0.5);
    });

    // thumb image
	$('.product-deal2 .thumbs img').each(function(e){
		$(this).click(function(event){
			event.preventDefault();
			$('.product-deal2 .product-deal-image').trigger("to.owl.carousel", [e, 0, true]);
			
			$('.product-deal2 .thumbs img').removeClass('active');
			$(this).addClass('active');
			return false;
		});
	});
	$('.product-deal2 .product-deal-image').on('changed.owl.carousel', function(event) {
		setTimeout(function(){
			var index = 0;
			$('.product-deal2 .product-deal-image .owl-item').each(function(i){
				if ($(this).hasClass('active')){
					index = i;
				}
			});
			$('.product-deal2 .thumbs img').removeClass('active');
			$('.product-deal2 .thumbs img').eq(index).addClass('active');
		},50);
    });

	// accessories
    var alitAccessories = {
    	init: function() {
    		var self = this;
			// variation
    		self.variation();
    		// add to cart
    		self.add_to_cart();
    	},
    	add_to_cart: function() {
    		var self = this;
    		$('body').on('click', '.add-all-items-to-cart:not(.loading)', function(e){
    			e.preventDefault();
    			var self_this = $(this);
    			self_this.addClass('loading');
				var pids = self.get_product_ids();
				var current_id = $('.accessoriesproducts').data('current-pid');
				var current_type = $('.accessoriesproducts').data('current-type');

				if( pids.length <= 0 ) {
					var alert_msg = alit_woo.empty;
				} else if( current_type == 'variable' && self.is_variation_selected() === false ) {
					var alert_msg = alit_woo.no_variation;
				} else {
					for (var i = 0; i < pids.length; i++ ) {
						if ( pids[i] == current_id && current_type == 'variable' ) {
							var variation_id  = $('.variations_form .variations_button').find('input[name^=variation_id]').val();
							var variation = {};
							if( $( '.variations_form' ).find('select[name^=attribute]').length ) {
								$( '.variations_form' ).find('select[name^=attribute]').each(function() {
									var attribute = $(this).attr("name");
									variation[attribute] = $(this).val();
								});
							} else {
								$( '.variations_form' ).find('.select').each(function() {
									var attribute = $(this).attr("data-attribute-name");
									variation[attribute] = $(this).find('.selected').attr('data-name');
								});
							}
							$.ajax({
								type: "POST",
								async: false,
								url: alit_ajax.ajaxurl,
								data: { 'action': 'alit_variable_add_to_cart',
									'product_id': pids[i],
									'variation_id': variation_id,
									'variation': variation
								},
								success : function( response ) {
									self.refresh_fragments( response );
								}
							});
						} else {
							$.ajax({
								type: "POST",
								async: false,
								url: alit_ajax.ajaxurl,
								data: {
									'action': 'woocommerce_add_to_cart',
									'product_id': pids[i]
								},
								success : function( response ) {
									self.refresh_fragments( response );
								}
							});
						}
					}
					var alert_msg = alit_woo.success;
				}
				$( '.alit-msg' ).html(alert_msg);
				self_this.removeClass('loading');
			});
    	},
    	variation: function() {
    		var self = this;
    		// variation
    		$( 'body' ).on( 'found_variation', function( event, variation ) {
				$('.accessoriesproducts .accessory-product').each(function() {
					if ( $(this).data( 'type' ) == 'variable' ) {
						$(this).data( 'price', variation.display_price );
						$(this).siblings( 'span.accessory-price' ).html( $(variation.price_html).html() );
					}
				});
			});
    		// variation changed
			$( 'body' ).on( 'woocommerce_variation_has_changed', function( event ) {
				var tprice = self.get_total_price();
				$.ajax({
					type: "POST",
					url: alit_ajax.ajaxurl,
					data: {
						'action': 'alit_get_total_price',
						'data': tprice
					},
					success : function( response ) {
						$( 'span.total-price .amount' ).html( response );
					}
				})
			});
    	},
		// get total price
		get_total_price(){
			var tprice = 0;
			$('.accessoriesproducts .accessory-product').each(function() {
				tprice += parseFloat( $(this).data( 'price' ) );
			});
			return tprice;
		},
		// get product ids
		get_product_ids(){
			var pids = [];
			$('.accessoriesproducts .accessory-product').each(function() {
				pids.push( $(this).data( 'id' ) );
			});
			return pids;
		},
		is_variation_selected: function() {
			if ($(".single_add_to_cart_button").is(":disabled") || $(".single_add_to_cart_button").hasClass('disabled') ) {
				return false;
			}
			return true;
		},
		refresh_fragments: function( response ){
			var frags = response.fragments;

			if ( frags ) {
				$.each( frags, function( key ) {
					$( key ).addClass( 'updating' );
				});
			}

			if ( frags ) {
				$.each( frags, function( key, value ) {
					$( key ).replaceWith( value );
				});
			}
		}
    }
    alitAccessories.init();
    
})(jQuery)

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}