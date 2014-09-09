JSRequest = {
    QueryString: null,
    FileName: null,
    PathName: null,
    EnsureSetup: function () {
        if (JSRequest.QueryString != null) return;
        JSRequest.QueryString = new Array();
        var queryString = window.location.search.substring(1);
        var pairs = queryString.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var p = pairs[i].indexOf("=");
            if (p > -1) {
                var key = pairs[i].substring(0, p);
                var value = pairs[i].substring(p + 1);
                JSRequest.QueryString[key] = value;
            }
        }
        var path = JSRequest.PathName = window.location.pathname;
        var p = path.lastIndexOf("/");
        if (p > -1) {
            JSRequest.FileName = path.substring(p + 1);
        } else {
            JSRequest.PageName = path;
        }
    }
};