// Generated by CoffeeScript 1.6.1
(function() {

  $(function() {
    window.startLoad = function(f) {
      if (f == null) {
        f = function() {};
      }
      return $("#loadingOverlay").fadeIn('fast', f);
    };
    window.endLoad = function(f) {
      if (f == null) {
        f = function() {};
      }
      return $("#loadingOverlay").fadeOut('fast', f);
    };
    window.bindErrorToField = function(pid, alertMesg) {
      if (pid == null) {
        pid = "";
      }
      $("" + pid + "ul.errors").each(function() {
        return $(this).children("li[data-field-id]").each(function() {
          var grab1, id;
          id = $(this).data("field-id");
          grab1 = $(eid("" + pid + "#" + id));
          if (grab1.length === 0) {
            grab1 = $(eid("" + pid + "[name='" + id + "']"));
          }
          if (grab1.length > 1) {
            grab1 = grab1.parents(".error");
          }
          if (grab1.length === 1) {
            grab1.removeData("qtip");
            return grab1.qtip({
              content: {
                text: $(this).text()
              },
              style: {
                classes: "qtip-error-icon qtip-red qtip-rounded qtip-large-font qtip-shadow"
              },
              position: {
                viewport: $(window)
              }
            });
          }
        });
      });
      if (alertMesg) {
        return alert(alertMesg);
      }
    };
    return bindErrorToField();
  });

}).call(this);