const DEFAULT_REPORTING_DAYS = 30;
var IGNORED_DOMAINS = null;
var _storeIgnoredDomains = null;
var _retrieveIgnoredDomains = null;
var cleanURLMeta = null;
var URLMeta = null;
var ignore = null;
var numReportingDays = null;
var setReportingDays = null;

var urlDomain = function(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
};

var cleanDailyTimes = function(data, numDays, currentDate) {
    if (currentDate == null) {
        currentDate = new Date();
    }
    cutoffDate = new Date();
    cutoffDate.setDate(currentDate.getDate() - numDays * 1.2);
    if (data['dailyTimes'] === undefined) {
        return data;
    }
    var newDailyTimes = {};
    $.each(data['dailyTimes'], function(dateKey, time) {
        var dt = new Date(dateKey);
        if (dt >= cutoffDate) {
            newDailyTimes[dateKey] = time;
        }
    });
    data['dailyTimes'] = newDailyTimes;
    return data;
};

var setup = function() {

    URLMeta = kango.storage.getItem('URL_meta');

    setReportingDays = function(numDays) {
        kango.storage.setItem('numReportingDays', numDays);
        numReportingDays = numDays;
    };

    _getReportingDays = function() {
        var days = kango.storage.getItem('numReportingDays');
        if (days == null) {
            days = DEFAULT_REPORTING_DAYS;
        }
        return days;
    };

    numReportingDays = _getReportingDays();

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
                newMeta = cleanDailyTimes(newMeta, numReportingDays);
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

var dateFormat = function(date) {
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    return y + '-' + (m + 1) + '-' + d;
};

