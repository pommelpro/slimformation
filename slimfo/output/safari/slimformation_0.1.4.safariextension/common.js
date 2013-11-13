var IGNORED_DOMAINS = null;
var _storeIgnoredDomains = null;
var _retrieveIgnoredDomains = null;
var cleanURLMeta = null;
var URLMeta = null;
var ignore = null;

var urlDomain = function(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
};

var setup = function() {

    URLMeta = kango.storage.getItem('URL_meta');

    _storeIgnoredDomains = function() {
        kango.storage.setItem('IGNORED_DOMAINS', IGNORED_DOMAINS);
    };

    _retrieveIgnoredDomains = function() {
        IGNORED_DOMAINS = kango.storage.getItem('IGNORED_DOMAINS');
        if (IGNORED_DOMAINS == null) {
            IGNORED_DOMAINS = [];
            _storeIgnoredDomains();
        }
        return IGNORED_DOMAINS;
    };
    IGNORED_DOMAINS = _retrieveIgnoredDomains();


    cleanURLMeta = function() {
        var newMeta = {};
        for (var key in URLMeta) {
            if (!ignore(key)) {
                newMeta[key] = URLMeta[key];
            } else {
            }
        }
        kango.storage.setItem('URL_meta', newMeta);
        URLMeta = newMeta;
    };

    /**
     * Ignore specified domains and their subdomains.
     */
    ignore = function(url) {
        if (url.indexOf('http') == 0) {
            var domain = urlDomain(url);
            if (IGNORED_DOMAINS.indexOf(domain) >= 0) {
                return true;
            }
            var parts = domain.split('.');
            parts = parts.slice(parts.length-2, parts.length);
            domain = parts.join('.');
            if (IGNORED_DOMAINS.indexOf(domain) >= 0) {
                return true;
            }
        } else {
            return true;
        }
        return false;
    };

};

if (typeof KangoAPI === 'undefined') {
    setup();
} else {
    KangoAPI.onReady(function() {
        setup();
    });
}
