jQuery(document).ready(function($) {
    $('#configure-pressai-settings').click(function(e) {
        e.preventDefault();

        var data = {
            'name': 'pressai_first_time_loading',
            'value': true
        };

        $.ajax({
            method: 'POST',
            url: '/wp-json/press_ai/v1/set_option',
            data: JSON.stringify(data),
            contentType: 'application/json',
        })
            .done(function(response) {
                if(response.status === true) {
                    window.location.href = $('#configure-pressai-settings').attr('href');
                } else {
                    // Handle error here
                    console.error('Error updating option');
                }
            });
    });
});