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

test( "setIgnoreDomain test", function() {
  var origIgnoredDomains = _retrieveIgnoredDomains();
  _storeIgnoredDomains = function(){};
  IGNORED_DOMAINS = [ 'foo' ]
  setIgnoreDomain('bar');
  deepEqual(IGNORED_DOMAINS, ["foo","bar"], "add ignored domain, true default");
  setIgnoreDomain('bat', true);
  deepEqual(IGNORED_DOMAINS, ["foo","bar","bat"], "add ignored explicit");
  setIgnoreDomain('bar', false);
  deepEqual(IGNORED_DOMAINS, ["foo","bat"], "remove ignored domain");

  console.log(_retrieveIgnoredDomains());
  deepEqual(origIgnoredDomains, _retrieveIgnoredDomains(),
        "Check local storage is not affected");
});

/* category.js */

test( "categoryData test", function() {
  ok( categoryData(), "categoryData");
  _data = categoryData();
  var _expect = [
    "Other",
    "Politics",
    "SciTech",
    "Business",
    "Culture",
    "Sports"
  ];
  deepEqual( _.keys(_data), _expect, "unititialized category keys");
});

/* common.js */

test( "ignore test", function() {
  IGNORED_DOMAINS = [ 'foo1.com', 'foo2.com' ]
  ok(ignore("http://foo1.com"), "ignore blacklisted domain");
  ok(ignore("http://bar.foo1.com"), "ignore blacklisted subdomain");
  ok(!ignore("http://foo3.com"), "don't ignore unlisted domain");
});

test( "cleanDailyTimes test", function() {
  var data = { foo: "bar" };
  deepEqual(cleanDailyTimes(data, 30), data, "missing dailyTimes");
  d1 = dateFormat(new Date("October 1, 2013"));
  d2 = dateFormat(new Date("November 1, 2013"));
  d3 = dateFormat(new Date("December 1, 2013"));
  dt = new Date("November 22, 2013");
  var dailyTimes = {};
  dailyTimes[d1] = 0;
  dailyTimes[d2] = 0;
  dailyTimes[d3] = 0;
  data = { dailyTimes: dailyTimes};
  var _expect = { dailyTimes: $.extend({},data['dailyTimes']) }; 
  delete _expect['dailyTimes'][d1];
  console.log(_expect);
  deepEqual(cleanDailyTimes(data, 30, dt), _expect, "remove old data");
});
