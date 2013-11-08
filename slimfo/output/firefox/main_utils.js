
var IGNORED_DOMAINS = [];
var setIgnoredDomains = function() {
    var url = 'http://slimformation.knightlab.com/ignore-domains';
    details = { url: url, contentType: 'json' };
    kango.xhr.send(details, function(data) {
        if ( (data.status == 200 || data.status == 202)
             && data.response != null) {
                IGNORED_DOMAINS = data.response;
        }
    });
};
setIgnoredDomains();

var urlDomain = function(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
};

var ignore = function(url) {
    console.log(IGNORED_DOMAINS);
    if (url.indexOf('http') == 0) {
      if (IGNORED_DOMAINS.indexOf(urlDomain(url)) < 0) {
        return false;
      } else {
        return true;
      }
    } else {
        return true;
    }
};
