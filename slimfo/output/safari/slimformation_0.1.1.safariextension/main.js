kango.ui.browserButton.setPopup({url:'popup.html', width: 420, height:520})

var currentURL = null;
var currentURLStartTime = null;
var URLMeta = kango.storage.getItem('URL_meta');
if (URLMeta == null) {
    URLMeta = {};
    kango.storage.setItem('URL_meta', URLMeta);
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
            // add'l response fields: direction, next_page_id
            // short_url, author, dek, total_pages, title, excerpt,
            // lead_image_url, date_published, rendered_pages
            var info = {
                category: data.response['category'],
                domain: data.response['domain'],
                //content: data.response['content'],
                url: data.response['url'],
                //wordCount: data.response['word_count']
                readingScore: data.response['readingScore']
            };
            //var readingScore = new ReadingScore(info['content']);
            var meta =  {
                category: info['category'],
                domain: info['domain'],
                url: info['url'],
                //wordCount: info['wordCount'],
                //readingScore: readingScore.fleschKincaid(),
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

var newURL = function(event) {
    var time = new Date();
    if (currentURL != null && currentURL.indexOf('http') == 0) {
        var delta = time - currentURLStartTime;
        var meta = URLMeta[currentURL];
        if (meta != null) {
            meta['totalTime'] = meta['totalTime'] + delta;
            URLMeta[currentURL] = meta;
            kango.storage.setItem('URL_meta', URLMeta);
        }
    }
    currentURLStartTime = time;
    currentURL = event.target.getUrl();
    if (currentURL.indexOf('http') == 0) {
      if (URLMeta[currentURL] == null) {
        fetchUrlInfo(currentURL); 
      }
    }
}

kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, newURL);
kango.browser.addEventListener(kango.browser.event.BEFORE_NAVIGATE, newURL);
