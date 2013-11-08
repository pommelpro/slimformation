kango.ui.browserButton.setPopup({url:'popup.html', width: 420, height:520})

var currentURL = null;
var currentURLStartTime = null;
var URLMeta = kango.storage.getItem('URL_meta');

var cleanURLMeta = function() {
    var newMeta = {};
    for (var key in URLMeta) {
       if (!ignore(key)) {
           console.log("keeping: " + key);
           newMeta[key] = URLMeta[key];
       } else {
           console.log("ignoring: " + key);
       }
    }
    kango.storage.setItem('URL_meta', newMeta);
};

if (URLMeta == null) {
    URLMeta = {};
    kango.storage.setItem('URL_meta', URLMeta);
} else {
    cleanURLMeta();
}


var fetchUrlInfo = function(url) {
    //serviceURL = 'http://calm-thicket-4369.herokuapp.com/categorize.json';
    //serviceURL = 'http://127.0.0.1:5000/categorize';
    //serviceURL = 'http://slimformation.knilab.com/categorize';
    serviceURL = 'http://slimformation.knightlab.com/categorize';
    details = { url: serviceURL + "?url=" + url, contentType: 'json' };
    kango.xhr.send(details, function(data) {
        if ( (data.status == 200 || data.status == 202)
             && data.response != null) {
            var info = {
                category: data.response['category'],
                domain: data.response['domain'],
                url: data.response['url'],
                readingScore: data.response['readingScore']
            };
            var meta =  {
                category: info['category'],
                domain: info['domain'],
                url: info['url'],
                readingScore: info['readingScore'],
                totalTime: 0
            };
            if (URLMeta[url] != null) {
                meta['totalTime'] = URLMeta[url]['totalTime'];
            }
            URLMeta[url] = meta;
            kango.storage.setItem('URL_meta', URLMeta);
        } else {
            console.log('Error: could not retrieve URL info at: '
                + serviceURL + ' for URL: ' + url);
        }
    });
}


var newURL = function(event, url) {
    var time = new Date();
    if (currentURL != null && !ignore(currentURL)) {
        var delta = time - currentURLStartTime;
        console.log('' + delta + ': ' + currentURL);
        var meta = URLMeta[currentURL];
        if (meta != null) {
            meta['totalTime'] = meta['totalTime'] + delta;
            URLMeta[currentURL] = meta;
            kango.storage.setItem('URL_meta', URLMeta);
        }
    }
    currentURLStartTime = time;
    if (event != null) {
        currentURL = event.target.getUrl();
    } else if (url != null) {
        currentURL = url;
    }
    if (!ignore(currentURL)) {
      if (URLMeta[currentURL] == null) {
        fetchUrlInfo(currentURL); 
      }
    }
}

kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, newURL);
// binding to DOCUMENT_COMPLETE instead of BEFORE_NAVIGATE since we want
// newURL to get the newly loaded URL 
kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, newURL);

var updateURL = function() {
  console.log(document.visibilityState);
  if (document.webkitHidden) {
      console.log('hidden');
  }
  var name = kango.browser.getName();
  if (name == 'chrome') {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(array_of_Tabs) {
      var tab = array_of_Tabs[0];
      var url = tab.url;
      if (url != currentURL) {
         newURL(null, url);
      }
    });
  } else if (name == 'firefox') {
    var currentWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
    var currBrowser = currentWindow.getBrowser();
    var currURL = currBrowser.currentURI.spec;
    console.log(currURL);
    if (currURL != currentURL) {
        newURL(null, currURL);
    }
  }
};

// updateURL every 10 seconds -- in case the user has multiple browser
// instances open, since there does not seem to be an event we can bind to
// for switching between browser instances
setInterval(updateURL, 10000);
