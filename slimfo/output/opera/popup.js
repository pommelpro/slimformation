var TRANSITION_DURATION = 500;

KangoAPI.onReady(function() {
  $('.content-pane').hide();
  $('#activity').show();
  initGoals();
  buildActivityTable();

  $('#popup-close').click(function(event) {
    KangoAPI.closeWindow()
  });

  $('#activity-nav,#activity-link').click(function() {
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

  $('.ignore-domain').click(function(e) {
    var target = $(e.target);
    var domain = target.data('domain');
    setIgnoreDomain(domain);
    cleanURLMeta();
    reloadCategories();
    target.closest('tr').remove(); 
  });

  $('.settings-icon').click(function() {
    console.log('settings');
    $('ul.nav li').removeClass('active');
    $('.content-pane').hide({
      duration: TRANSITION_DURATION
    });
    $('#settings').show({
      duration: 0
    });
    showSettings();
  });
});


