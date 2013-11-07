/* popup_utils.js */

test( "hello test", function() {
  ok( 1 == "1", "Passed!" );
});

test( "pieChartData test", function() {
  ok( pieChartData(), "pieChartData");
  _data = pieChartData();
  equal( _data[0].y.toPrecision(4), 16.67, "unititialize percentage is 1/6 for each category");
});

test( "formatTime test", function() {
  _ms = "foo";
  equal( formatTime(_ms), _ms, "formatTime 'foo'");
  equal( formatTime(0), "0m", "formatTime 0 ms");
  equal( formatTime(1000 * 60), "1m", "formatTime 1 m");
});

test( "buildActivityTable test", function() {
  ok( !buildActivityTable(), "buildActivityTable");
});

test( "readingDiversity test", function() {
  ok( readingDiversity("foo", { domains: ["foo", "bar"]}), "readingDiversity");
});

test( "buildPrescription test", function() {
  _goals = {
    categoryGoal: function(name) {},
    goalsTotal: function() {}
  };
  _category = {
    readingLevelAverage: function() {}
  };
  ok( !buildPrescription(_category, _goals, "totalGoalsTime"), "buildPrescription");
});

test( "buildOverallDistribution test", function() {
  _goals = {
    categoryGoal: function(name) {},
    goalsTotal: function() {}
  };
  ok( !buildOverallDistribution(_goals), "buildOverallDistribution");
});

test( "buildGoalsOverview test", function() {
  _categories = {};
  _goals = {
    categoryGoal: function(name) {},
    goalsTotal: function() {}
  };
  ok( !buildGoalsOverview(_categories, _goals), "buildGoalsOverview");
});

test( "updateSliderValue test", function() {
  _event = {
    currentTarget: null,
    value: null
  };
  _goals = {
    categoryGoal: function(name) {},
    goalsTotal: function() {},
    setCategoryGoal: function(cat, val) {}
  };
  ok( updateSliderValue(_event, _goals), "readingDiversity");
});

/* category.js */

test( "categoryData test", function() {
  ok( categoryData(), "categoryData");
  _data = categoryData();
  _expect = [
    "Other",
    "Politics",
    "Science",
    "Business",
    "Entertainment",
    "Technology",
    "Sports"
  ];
  deepEqual( _.keys(_data), _expect, "unititialized category keys");
});

