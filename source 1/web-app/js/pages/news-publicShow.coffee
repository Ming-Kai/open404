$ ->
        $('#progressBar').progressbar(value: 0)
        $('#progressBar').progressbar(value: 100)
        setTimeout (->
                $('#progressBarMessage').animate(height: '1em', 500).css(display: "block")
                $.post '../markRead', {id: $('#id').val()}, ->
        ), 3000
