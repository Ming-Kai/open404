$ ->
        window.startLoad = (f = ->) ->
                $("#loadingOverlay").fadeIn('fast', f)
        window.endLoad = (f = ->) ->
                $("#loadingOverlay").fadeOut('fast', f)
        window.bindErrorToField = (pid = "", alertMesg) ->
                $("#{pid}ul.errors").each ->
                        $(this).children("li[data-field-id]").each ->
                                id = $(this).data("field-id")
                                grab1 = $ eid "#{pid}##{id}"

                                if (grab1.length == 0)
                                        grab1 = $ eid "#{pid}[name='#{id}']"

                                if (grab1.length > 1)
                                        grab1 = grab1.parents ".error"

                                if (grab1.length == 1)
                                        grab1.removeData "qtip"
                                        grab1.qtip
                                                content:
                                                        text: $(this).text()
                                                style:
                                                        classes: "qtip-error-icon qtip-red qtip-rounded qtip-large-font qtip-shadow"
                                                position:
                                                        viewport: $(window)

                if (alertMesg)
                        alert(alertMesg)

        bindErrorToField()
