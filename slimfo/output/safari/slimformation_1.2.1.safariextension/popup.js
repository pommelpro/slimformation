var pieChartData = function() {
    var data = [];
    $.each(categoryData(), function(i, cat) {
        data[data.length] = { key:i, y:cat['time'] };
    });
    return data;
}; // pieChartData

function buildActivityTable() {
  // TODO: show top n domains only
  $.each(categoryData(), function(i, category) {
      $('table#cat-source-table tbody').append(
        '<tr><td><b>' + category.name + '</b></td><td></td></tr>');
      $.each(category.domains, function(url, time) {
        $('table#cat-source-table tbody').append(
        '<tr><td>' + url + '</td><td>' + moment.duration(time).humanize()
        + '</td></tr>');
      });
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
        goals.categoryGoal(category.name)/goals.goalsTotal;
    var prescriptionGoals = metGoalTemplate({ category: category.name });
    if (diff < -0.05) {
        prescriptionGoals = unmetGoalTemplate({ category: category.name });
    } else if (diff > 0.05) {
        prescriptionGoals = overBudgetTemplate({ category: category.name });
    } 
    var prescriptionId = '#' + category.name + '-prescription';
    $(prescriptionId).append('<div><p><b>Goals:</b> '
        + prescriptionGoals + '</p></div>');
    $(prescriptionId).append(readingDiversity(category.name, category));
    var readingLevelAverage = category.readingLevelAverage();
    if (isNaN(readingLevelAverage)) {
        $(prescriptionId).append('<div><p><b>Reading Level:</b> No data collected so far. Try viewing more sites.</p></div>');
    } else {
        var readingLevelPrescription = fleschKincaidTemplate({
            category: category.name,
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
}; // buildPrescription

var buildOverallDistribution = function(goals) {
  $('#overall-distribution').html('');
  $.each(categoryData(), function(i, cat) {
    $('#overall-distribution').append(
      readingDistributionTemplate({
        width: goals.categoryGoal(i) / goals.goalsTotal()*100,
        category:i
    }));
  });
}; // buildOverallDistribution

var updateSliderValue = function(event, goals) {
  /* TODO: update goals overview */
  var cat = $(event.currentTarget).attr('data-slider-category');
  goals.setCategoryGoal(cat, event.value);
  buildOverallDistribution(goals);
  return goals;
}; // updateSliderValue

var initGoals = function() {
  var categories = categoryData();
  var totalTime = 0;
  var goals = new GoalsCollection();
  buildOverallDistribution(goals);
  $.each(categories, function(i, cat) {
    if (i === 'Other') { return true; } // continue
    totalTime += cat['time'];
  });
  $.each(categories, function(i, cat) {
    if (i === 'Other') { return true; } // continue
    $('#reading-budgets').append(readingBudgetTemplate({
      category: i,
      actualTime:cat['time']/totalTime*100,
      goalTime: goals.categoryGoal(i) / goals.goalsTotal() * 100
    }));
    $('#user-reading-goals').append(
        userReadingGoalTemplate({
          category: i,
          goal: goals.categoryGoal(i)
        }));
    buildPrescription(cat, goals, totalTime);
  }); // end each categories
  $('#user-reading-goals input').slider()
    .on('slideStop', function(event) {
        goals = updateSliderValue(event, goals);
  });
}; // initGoals

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
    $('.content-pane').hide();
    $('#activity').show();
  });

  $('#goals-nav').click(function() {
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
    $('.content-pane').hide();
    $('#goals').show();
  });

  $('#prescription-nav').click(function() {
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
    $('.content-pane').hide();
    $('#prescription').show();
  });

  nv.addGraph(function() {
    var width = 320;
    var height = 400;
    var chart = nv.models.pieChart()
      .x(function(d) { return d.key; })
      .values(function(d) {
          return d;
      })
      .showLabels(false)
      .color(PIE_CHART_COLORS)
      .width(width)
      .height(height)
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

