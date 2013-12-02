GoalsCollection = (function() {
  function GoalsCollection() {
    this.loadGoals();
    this._goalsTotal = null;
  }
  GoalsCollection.prototype.loadGoals = function() {
    var goals = DEFAULT_GOALS;
    var storedGoals = kango.storage.getItem('userReadingGoals');
    if (storedGoals === null) {
      storedGoals = {};
    }
    $.each(storedGoals, function(goal, value) {
      goals[goal] = value;
    });
    kango.storage.setItem('userReadingGoals', goals);
    this.goals = goals;
  };
  GoalsCollection.prototype.goalsTotal = function() {
    if (this._goalsTotal === null) {
      var obj = this;
      $.each(this.goals, function(cat, val) {
        obj._goalsTotal += val;
      });
    }
    return this._goalsTotal;
  };
  GoalsCollection.prototype.categoryGoal = function(category) {
    return this.goals[category];
  };
  GoalsCollection.prototype.setCategoryGoal = function(category, value) {
      this.goals[category] = value;
      kango.storage.setItem('userReadingGoals', this.goals); 
      this._goalsTotal = null;
  };
  return GoalsCollection;
})();
