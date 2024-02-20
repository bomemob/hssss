jQuery(document).ready(function ($){
    var acs_action = 'alit_autocomplete_search';
    $("input[name=s]").autocomplete({
        source: function(req, response){
        	$.ajax({
                url: alit_ajax.ajaxurl+'?callback=?&action='+acs_action,
                dataType: "json",
                data: {
                    term : req.term,
                    category : $(".apus-search-form .dropdown_product_cat").val(),
                    post_type : $(".apus-search-form .post_type").val()
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        select: function(event, ui) {
            window.location.href = ui.item.link;
        },
        create: function() {
            $(this).data('ui-autocomplete')._renderItem = function( ul, item ) {
                var string = '';
                if ( item.image != '' ) {
                    var string = '<a href="' + item.link + '" title="'+ item.label +'"><img class="pull-left" src="'+ item.image+'" style="margin-right:10px;"></a>';
                }
                string = string + '<div class="name"><a href="' + item.link + '" title="'+ item.label +'">'+ item.label +'</a></div>';
                if ( item.price != '' ) {
                    string = string + '<div class="price">'+ item.price +'</div> ';
                }
                return $( "<li>" ).append( string ).appendTo( ul );
            };
        },
        minLength: 3
    });

});