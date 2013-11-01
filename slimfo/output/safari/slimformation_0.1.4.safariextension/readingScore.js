RE = {
  url: /\b(?:(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,
  number: /[0-9]*\.[0-9]+|[0-9]+/g,
  space: /\s+/g,
  unblank: /\S/,
  punctuation: /[\/\.\,\?\!]/g
};

LexerNode = (function() {
  function LexerNode(string, regex, regexs) {
    var childElements, i, nextRegex, nextRegexes;
    this.string = string;
    this.children = [];
    if (string) {
      this.matches = string.match(regex);
      childElements = string.split(regex);
    }
    if (!this.matches) {
      this.matches = [];
      childElements = [string];
    }
    if (!regexs.length) {
      this.children = childElements;
    } else {
      nextRegex = regexs[0];
      nextRegexes = regexs.slice(1);
      for (i in childElements) {
        this.children.push(new LexerNode(childElements[i], nextRegex, nextRegexes));
      }
    }
  }
  LexerNode.prototype.fillArray = function(array) {
    var child, i, match, _results;
    _results = [];
    for (i in this.children) {
      child = this.children[i];
      if (child.fillArray) {
        child.fillArray(array);
      } else {
        if (RE.unblank.test(child)) {
          array.push(child);
        }
      }
      if (i < this.matches.length) {
        match = this.matches[i];
        if (RE.unblank.test(match)) {
          _results.push(array.push(match));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  LexerNode.prototype.toString = function() {
    var array;
    array = [];
    this.fillArray(array);
    return array.toString();
  };
  return LexerNode;
})();

Lexer = (function() {
  function Lexer() {}

  Lexer.prototype.regexs = [RE.url, RE.number, RE.space, RE.punctuation];

  Lexer.prototype.lex = function(string) {
    var array, node;
    array = [];
    node = new LexerNode(string, this.regexs[0], this.regexs.slice(1));
    node.fillArray(array);
    return array;
  };
  return Lexer;
})();

ReadingScore = (function() {
  function ReadingScore(text) {
    this.words = (new Lexer).lex(text);
  }

  ReadingScore.prototype.newCount = function(word) {
    var w;
    word = word.toLowerCase();
    if (word.length <= 3) {
      return 1;
    }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    word = word.replace(/[0-9]+/, "");
    w = word.match(/[aeiouy]{1,2}/g);
    if (w) {
      return w.length;
    } else {
      return 0;
    }
  };
  ReadingScore.prototype.numSyllables = function() {
    var count;
    return count = _.reduce(this.words, (function(memo, word) {
      return memo + this.newCount(word);
    }), 0, this);
  };

  ReadingScore.prototype.numSentences = function() {
    return _.filter(this.words, (function(word) {
      return /[.?!]/.test(word);
    })).length;
  };

  ReadingScore.prototype.numWords = function() {
    return this.words.length - this.numSentences.length;
  };

  ReadingScore.prototype.fleschKincaid = function() {
    var numWords;
    numWords = this.numWords();
    return 206.835 - 1.015 * (numWords / this.numSentences()) - 84.6 * (this.numSyllables() / numWords);
  };
  return ReadingScore;
})();

