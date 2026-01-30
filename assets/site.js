// @ts-ignore
jQuery(function($) {
    var sending = false;
    var $copyBtn = $("#copy-btn");
    
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
                $copyBtn.addClass("is-invisible");
            },
            success: function(res) {
                $submitBtn.removeClass("is-loading is-disabled");
                if (res.indexOf("error:") > -1) {
                    alert(res);
                } else if (res.indexOf("http") === 0) {
                    $form[0].reset();
                    $("#url")
                        .val(res.trim())
                        .removeClass("is-invisible").focus();
                    $copyBtn.removeClass("is-invisible");
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

    // Copy to clipboard functionality
    $copyBtn.on("click", function() {
        var url = $("#url").val();
        if (!url) return;
        
        navigator.clipboard.writeText(url).then(function() {
            var originalText = $copyBtn.text();
            $copyBtn.text("✓ Copied!");
            setTimeout(function() {
                $copyBtn.text(originalText);
            }, 2000);
        }).catch(function() {
            // Fallback for older browsers
            $("#url").select();
            document.execCommand("copy");
            $copyBtn.text("✓ Copied!");
            setTimeout(function() {
                $copyBtn.text("📋 Copy");
            }, 2000);
        });
    });
});
