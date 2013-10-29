var pieChartData = function() {
    var data = [];
    var categories = categoryData();
    $.each(CATEGORY_NAMES, function(i, name) {
        console.log(name);
        var cat = categories[name];
        data[data.length] = { key:name, y:cat['time']|1 };
    });
    return data;
}; // pieChartData

var formatTime = function(ms) {
    var s = ms / 1000;
    var m = s / 60;
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
      $('table#cat-source-table tbody').append(
        '<tr style="background-color:#f9f9f9"><td><b>'
        + category.name + '</b></td><td></td></tr>');
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
          '<tr><td>' + top1[0] + '</td><td>'
           + formatTime(top1[1]) + '</td></tr>');
      }
      if (top2[0] !== null) {
        $('table#cat-source-table tbody').append(
          '<tr><td>' + top2[0] + '</td><td>'
          + formatTime(top2[1]) + '</td></tr>');
      }
      if (top3[0] !== null) {
        $('table#cat-source-table tbody').append(
          '<tr><td>' + top3[0] + '</td><td>'
          + formatTime(top3[1]) + '</td></tr>');
      }
      $('table#cat-source-table tbody').append(
        '<tr><td></td><td></td></tr>');
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
  if (biasedDomains.length > 0) {
    domainDiversity = biasedTemplate({
      category: category, domains: biasedDomains.join(', ') });
  } else {
    domainDiversity = diverseTemplate({ category: category });
  }
  return '<div><p><b>Diversity:</b> ' + domainDiversity + '</p></div>';
}; // readingDiversity

var buildPrescription = function(category, goals, totalGoalsTime) {
    var diff = category.time/totalGoalsTime -
        goals.categoryGoal(category.name)/goals.goalsTotal();
    var prescriptionGoals = metGoalTemplate({ category: category.name });
    if (isNaN(diff) || diff < -0.05) {
        prescriptionGoals = unmetGoalTemplate({ category: category.name });
    } else if (diff > 0.05) {
        prescriptionGoals = overBudgetTemplate({ category: category.name });
    } 
    var prescriptionId = '#' + category.name + '-prescription';
    $(prescriptionId).html('');
    $(prescriptionId).append('<div><p><b>Goals:</b> '
        + prescriptionGoals + '</p></div>');
    if (!isNaN(diff) && category.time > 0) {
        $(prescriptionId).append(readingDiversity(category.name, category));
    }
    var readingLevelAverage = category.readingLevelAverage();
    if (isNaN(readingLevelAverage)) {
        $(prescriptionId).append('<div><p><b>Reading Level:</b> No data collected so far. Try viewing more sites.</p></div>');
    } else {
        var readingLevelPrescription = fleschKincaidTemplate({
            category: category.name,
            readingLevel: readingLevelAverage
        });
        console.log('Reading level avg: ' + readingLevelAverage);
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
    totalTime += cat['time'];
  });
  $('#reading-budgets').html('');
  $.each(CATEGORY_NAMES, function(i, name) {
    if (name === 'Other') { return true; } // continue
    var cat = categoryData()[name];
    $('#reading-budgets').append(readingBudgetTemplate({
      category: name,
      actualTime:cat['time']/totalTime*100,
      goalTime: goals.categoryGoal(name) / goals.goalsTotal() * 100
    }));
    buildPrescription(cat, goals, totalTime);
  }); // end each categories
};

var updateSliderValue = function(event, goals) {
  /* TODO: update goals overview */
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

var TRANSITION_DURATION = 500;

KangoAPI.onReady(function() {
  $('.content-pane').hide();
  $('#activity').show();
  initGoals();
  buildActivityTable();

  $('#popup-close').click(function(event) {
    KangoAPI.closeWindow()
  });

  $('#activity-nav').click(function() {
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
    $('.content-pane').hide({
      duration: TRANSITION_DURATION
    });
    $('#activity').show({
      duration: 0
    });
  });

  $('#goals-nav').click(function() {
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
    $('.content-pane').hide({
      duration: TRANSITION_DURATION
    });
    $('#goals').show({
      duration: 0
    });
  });

  $('#prescription-nav').click(function() {
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
    $('.content-pane').hide({
      duration: TRANSITION_DURATION
    });
    $('#prescription').show({
      duration: 0
    });
  });

  nv.addGraph(function() {
    var width = 320;
    var height = 300;
    var chart = nv.models.pieChart()
      .x(function(d) { return d.key; })
      .values(function(d) {
          return d;
      })
      .showLabels(false)
      .color(PIE_CHART_COLORS)
      .donut(true);
    d3.select('#chart svg')
      .datum([pieChartData()])
      .transition().duration(1200)
      .attr('width', width)
      .attr('height', height)
      .call(chart);
    return chart;
  });

  $('#goals-chart').hide();

  $('#edit-goals').click(function() {
    $('#goals-summary').hide();
    $('#goals-chart').show();
  });

  $('#save-edited-goals').click(function() {
    $('#goals-chart').hide();
    $('#goals-summary').show();
  });

  $('.prescription').hide();

  $('.prescription-nav').click(function() {
    $('.prescription').hide();
    var category = $(this)[0].id.split('-')[0];
    var divId = category + '-prescription';
    $('#' + divId).show()
  });
});


