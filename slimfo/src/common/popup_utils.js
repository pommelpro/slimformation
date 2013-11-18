var setIgnoreDomain = function(domain, ignore) {
    if (ignore === undefined) {
        ignore = true;
    }
    if (ignore) {
        if (IGNORED_DOMAINS.indexOf(domain) < 0) {
            IGNORED_DOMAINS.push(domain);
            _storeIgnoredDomains();
        }
    } else {
        var idx = IGNORED_DOMAINS.indexOf(domain);
        if (idx >= 0) {
            IGNORED_DOMAINS.splice(idx, 1);
            _storeIgnoredDomains();
        }
    }
};

var pieChartData = function() {
    var data = [];
    var categories = categoryData();
    var totalTime = 0;
    $.each(CATEGORY_NAMES, function(i, name) {
      if (categories[name]) {
        totalTime += categories[name]['time'];
      }
    });
    $.each(CATEGORY_NAMES, function(i, name) {
        var cat = categories[name];
        if (cat === undefined) {
            cat = { time: 0 }
        }
        if (totalTime == 0) {
          data[data.length] = { key:name, y:(1/6) * 100 };
        } else {
          data[data.length] = { key:name, y:(cat['time']/totalTime) * 100 };
        }
    });
    return data;
}; // pieChartData

var formatTime = function(ms) {
    var m = ms / 1000 / 60;
    if (isNaN(m)) {
        return ms;
    }
    var h = Math.round(m / 60);
    m = Math.round(m - h * 60);
    if (m < 0) { m = 0; }
    if (h > 0) {
      return '' + h + 'h ' + m + 'm';
    } else {
      return '' + m + 'm';
    }
}

var buildActivityTable = function() {
  $.each(CATEGORY_NAMES, function(i, cat) {
      var category = categoryData()[cat];
      if (category === undefined) {
        category = {
            name: cat,
            domains: {}
        };
      }
      var name = category.name;
      if (name == 'SciTech') {
        name = 'Science & Technology';
      }
      $('table#cat-source-table tbody').append(
        '<tr style="background-color:#f9f9f9"><td><b>'
        + category.name + '</b></td><td></td><td></tr></tr>');
      var top1 = [null, 0];
      var top2 = [null, 0];
      var top3 = [null, 0];
      $.each(category.domains, function(url, time) {
        if (time && time >= top1[1]) {
          top3 = top2;
          top2 = top1;
          top1 = [url, time];
        } else if (time && time >= top2[1]) {
          top3 = top2;
          top2 = [url, time];
        } else if (time && time >= top3[1]) {
          top3 = [url, time];
        }  
      });
      if (top1[0] !== null) {
        $('table#cat-source-table tbody').append(
          '<tr><td>' + top1[0] + '</td><td><span title="ignore ' + top1[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top1[0] + '"></span></td><td>'
           + formatTime(top1[1]) + '</td></tr>');
      }
      if (top2[0] !== null) {
        $('table#cat-source-table tbody').append(
          '<tr><td>' + top2[0] + '</td><td><span title="ignore ' + top2[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top2[0] + '"></span></td><td>'
          + formatTime(top2[1]) + '</td></tr>');
      }
      if (top3[0] !== null) {
        $('table#cat-source-table tbody').append(
          '<tr><td>' + top3[0] + '</td><td><span title="ignore ' + top3[0] + '" class="glyphicon glyphicon-ban-circle ignore-domain" data-domain="' + top3[0] + '"></span></td><td>'
          + formatTime(top3[1]) + '</td></tr>');
      }
      $('table#cat-source-table tbody').append(
        '<tr><td></td><td></td><td></td></tr>');
  });
}; // buildActivityTable

var readingDiversity = function(category, categoryData) {
  var biasedDomains = [];
  $.each(categoryData['domains'], function(domain, domainTime) {
    if (domainTime > .33 * categoryData['time']) {
      if ($.inArray(domain, biasedDomains) < 0) {
        biasedDomains.push(domain);
      }
    }
  });
  var domainDiversity = null;
  var name = category;
  if (name == 'SciTech') { name = 'Science & Technology'; }
  if (biasedDomains.length > 0) {
    domainDiversity = biasedTemplate({
      category: name, domains: biasedDomains.join(', ') });
  } else {
    domainDiversity = diverseTemplate({ category: name });
  }
  return '<div><p><b>Diversity:</b> ' + domainDiversity + '</p></div>';
}; // readingDiversity

var buildPrescription = function(category, goals, totalGoalsTime) {
    var diff = category.time/totalGoalsTime -
        goals.categoryGoal(category.name)/goals.goalsTotal();
    var prescriptionGoals = null;
    var name = category.name;
    if (name == 'SciTech') { name = 'Science & Technology'; }
    if (goals.categoryGoal(category.name) == 0) {
        prescriptionGoals = "<p>Your goal for " + name
            + " is currently set to zero.</p>";
    } else {
        prescriptionGoals = metGoalTemplate({ category: name });
        if (isNaN(diff) || diff < -0.05) {
            prescriptionGoals = unmetGoalTemplate({ category: name });
        } else if (diff > 0.05) {
            prescriptionGoals = overBudgetTemplate({ category: name });
        } 
    }
    var prescriptionId = '#' + category.name + '-prescription';
    $(prescriptionId).html('');
    $(prescriptionId).append('<div><p><b>Goals:</b> '
        + prescriptionGoals + '</p></div>');
    if (goals.categoryGoal(category.name) > 0) {
      if (!isNaN(diff) && category.time > 0) {
        $(prescriptionId).append(readingDiversity(category.name, category));
      }
      var readingLevelAverage = category.readingLevelAverage();
      var name = category.name;
      if (name == 'SciTech') {
        name = 'Science & Technology';
      }
      if (isNaN(readingLevelAverage)) {
        $(prescriptionId).append('<div><p><b>Reading Level:</b> No data collected so far. Try viewing more sites.</p></div>');
      } else {
        var readingLevelPrescription = fleschKincaidTemplate({
            category: name,
            readingLevel: readingLevelAverage
        });
        if (readingLevelAverage >= READING_LEVELS[1]['threshold']) {
            readingLevelPrescription += READING_LEVELS[1]['message'];
        } else if (readingLevelAverage >= READING_LEVELS[2]['threshold']) {
            readingLevelPrescription += READING_LEVELS[2]['message'];
        } else if (readingLevelAverage >= READING_LEVELS[3]['threshold']) {
            readingLevelPrescription += READING_LEVELS[3]['message'];
        } else {
            readingLevelPrescription += READING_LEVELS[4]['message'];
        }
        $(prescriptionId).append('<div><p><b>Reading Level:</b> '
            + readingLevelPrescription + '</p></div>');
      }
    }
}; // buildPrescription

var buildOverallDistribution = function(goals) {
  $('#overall-distribution').html('');
  $.each(CATEGORY_NAMES, function(i, name) {
    if (name === 'Other') { return true; } // continue
    $('#overall-distribution').append(
      readingDistributionTemplate({
        width: goals.categoryGoal(name) / goals.goalsTotal()*100,
        category: name
    }));
  });
}; // buildOverallDistribution

var buildGoalsSliders = function(categories, goals) {
  $('#user-reading-goals').html('');
  $.each(CATEGORY_NAMES, function(i, name) {
    if (name === 'Other') { return true; } // continue
    $('#user-reading-goals').append(
      userReadingGoalTemplate({
        category: name,
        goal: goals.categoryGoal(name)
      }));
  });
};

var buildGoalsOverview = function(categories, goals) {
  var totalTime = 0;
  $.each(CATEGORY_NAMES, function(i, name) {
    if (name === 'Other') { return true; } // continue
    var cat = categoryData()[name];
    if (cat === undefined) {
        cat = {
            time: 0
        };
    }
    totalTime += cat['time'];
  });
  $('#reading-budgets').html('');
  $.each(CATEGORY_NAMES, function(i, name) {
    if (name === 'Other') { return true; } // continue
    var cat = categoryData()[name];
    if (cat === undefined) {
        cat = {
            name: name,
            time: 0,
            readingLevelAverage: function() { return 0; } 
        };
    }
    $('#reading-budgets').append(readingBudgetTemplate({
      category: name,
      actualTime:cat['time']/totalTime*100,
      goalTime: goals.categoryGoal(name) / goals.goalsTotal() * 100
    }));
    buildPrescription(cat, goals, totalTime);
  }); // end each categories
};

var updateSliderValue = function(event, goals) {
  var cat = $(event.currentTarget).attr('data-slider-category');
  goals.setCategoryGoal(cat, event.value);
  buildOverallDistribution(goals);
  return goals;
}; // updateSliderValue

var initGoals = function() {
  var categories = categoryData();
  var goals = new GoalsCollection();
  buildOverallDistribution(goals);
  buildGoalsOverview(categories, goals);
  buildGoalsSliders(categories, goals);
  $('#user-reading-goals input').slider()
    .on('slideStop', function(event) {
        goals = updateSliderValue(event, goals);
        buildGoalsOverview(categories, goals);
  });
}; // initGoals

var showIgnoredDomains = function() {
    var table = $('table#ignored-domains-table');
    table.html('');
    $.each(IGNORED_DOMAINS, function(i, d) {
        table.append('<tr><td><span title="Stop ignoring" class="glyphicon glyphicon-ok-circle remove-ignored-domain"></span><td>' + d + '</td></tr>');
    });
};

var showSettings = function() {
    showIgnoredDomains();
};

$('table#ignored-domains-table').on('click', '.remove-ignored-domain',
        function(evt) {
    var el = $(this);
    var domain = el.closest('td').next().html();
    setIgnoreDomain(domain, false);
    el.closest('tr').remove();
});
