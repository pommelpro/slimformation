
var readingBudgetTemplate = _.template(
  '<div id="<%- category %>-budget" class="budget-row">'
+ '  <div class="sl-label" style="width: 110px"><%- category %></div>'
+ '  <div class="sl-pair" style="width: 250px;">'
+ '    <div class="sl-left" style="width: 75px">actual</div>'
+ '    <div class="progress sl-left" style="width:150px">'
+ '      <div class="bar actual-bar" style="width: <%- actualTime %>%;"> '
+ '      </div>'
+ '    </div>'
+ '  </div>'
+ '  <div class="sl-pair" style="width: 250px;">'
+ '    <div class="sl-left" style="width: 75px">goal</div>'
+ '    <div class="progress sl-left" style="width:150px">'
+ '      <div class="bar <%- category %>-budget projected-bar"'
+ '         style="width: <%- goalTime %>%; '
+ '         ">'
+ '      </div>'
+ '    </div>'
+ '  </div>'
+ '</div>'
+ '');

var userReadingGoalTemplate = _.template(
  '<div class="indiv-slider span2" style="text-align:center;'
+ '    margin: 5px 0px 5px;width:350px;" id="<%- category %>-slider">'
+ '  <input data-slider-category="<%- category %>" style="width:200px; '
+ '    float:right;" type="text" class="span2" value="<%- goal %>"'
+ '    data-slider-min="0" data-slider-max="100" data-slider-step="1"'
+ '    data-slider-value="<%- goal %>"'
+ '    data-slider-orientation="horizontal" data-slider-selection="before"'
+ '    data-slider-tooltip="hide">'
+ '  <div style="float:left;width:125px;text-align:right"><b><%- category %>'
+ '  </div>'
+ '</div>'); 

var readingDistributionTemplate = _.template(
    '<div class="bar <%- category %>-distribution" '
  + ' data-slider-category="<%- category %>"'
  + ' style="width: <%- width %>%;"> '
  + ' </div>');

var diverseTemplate = _.template(
    'You have been doing well in terms of getting content about '
   + ' <%- category %> from different sources!');

var biasedTemplate = _.template(
    "Oh no! You've been viewing too much content about <%- category %>"
    + " from <%- domains %>. Try some other sources!");

var metGoalTemplate = _.template(
    'Congrats! You met your goal for <%- category %>.');

var unmetGoalTemplate = _.template(
    "You didn't meet your goal for <%- category %>. Try to focus on "
    + " reading more about <%- category %>.");

var overBudgetTemplate = _.template(
    'Oops! You went over your budget for <%- category %>. Try cutting '
    + 'back on <%- category %> reading.');

var fleschKincaidTemplate = _.template(
    'Weighted Average Flesch-Kincaid score for <%- category %> is <%- readingLevel %>.');
