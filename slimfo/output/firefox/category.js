var getDomain = function(url) {
    var a = document.createElement ('a');
    a.href = url;
    return a.hostname;
};

Category = (function() {
  function Category(name) {
    this.name = name;
    this.time = 0;
    this.urls = [];
    this.domains = {};
    this.readingScoreTotal = 0;
    this.urlCount = 0;
  }
  Category.prototype.readingLevelAverage = function() {
    return Math.round(this.readingScoreTotal/this.urlCount * 100)/100;
  };
  return Category;
})();

var _categories = null;
var categoryData = function() {
    if (_categories !== null) {
        return categories;
    }
    categories = {
        Other: new Category('Other'),
        Politics: new Category('Politics'),
        SciTech: new Category('SciTech'),
        Business: new Category('Business'),
        Culture: new Category('Culture'),
        Sports: new Category('Sports')
    };
    var meta = kango.storage.getItem('URL_meta');
    if (meta == null) {
        meta = {};
        kango.storage.setItem('URL_meta', meta);
    }
    $.each(meta, function(i, elem){
        var domain = getDomain(i);
        var category = categories[CATEGORY_MAP[elem['category']]];
        if (category === undefined) {
            category = {
                time: 0,
                readingScoreTotal: 0,
                urlCount: 0,
                urls: {},
                domains: {} 
            };
        }
        var cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - numReportingDays);
        elem['totalTime'] = 0;
        if (elem['dailyTimes'] == undefined) { return; }
        $.each(elem['dailyTimes'], function(date, time) {
            date = new Date(date);
            if (date >= cutoffDate) {
                console.log('Keep date: ' + date);
                category.time += time;
                elem['totalTime'] += time;
            } else {
                console.log('Ignore date: ' + date);
            }
        });
        if (elem['totalTime'] > 0) {
            category.readingScoreTotal += elem['readingScore'];
            category.urlCount += 1;
            category.urls[i] = elem['totalTime'];
            if (category.domains[domain] == null) {
                category.domains[domain] = 0; 
            }
            category.domains[domain] += elem['totalTime'];
        }
    });
    _categories = categories;
    return categories;
};

var reloadCategories = function() {
    _categories = null;
    return categoryData();
}; 
