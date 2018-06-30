// @ts-ignore
jQuery(function($) {
    var sending = false;
    $("#form-paste").on("submit", function() {
        if (sending) return false;
        var $submitBtn = $("#submit-btn");
        var $form = $(this);
        var content = $("#content").val().trim();
        if(!content.length) return false;
        $.ajax({
            url: "./api/pastes",
            type: "POST",
            data: {
                content: content
            },
            beforeSend: function() {
                $submitBtn.addClass("is-loading is-disabled");
                sending = true;
                $("#url")
                    .val("")
                    .addClass("is-invisible");
            },
            success: function(res) {
                $submitBtn.removeClass("is-loading is-disabled");
                if (res.indexOf("error:") > -1) {
                    alert(res);
                } else if (res.indexOf("http") === 0) {
                    $form[0].reset();
                    $("#url")
                        .val(res)
                        .removeClass("is-invisible").focus();
                    $("#notification").removeClass("is-invisible");
                }
            },
            error: function(xhr, status, error) {
                alert(error || status);
                $submitBtn.removeClass("is-loading is-disabled");
            }
        }).always(function() {
            sending = false;
        });
        return false;
    });
});
