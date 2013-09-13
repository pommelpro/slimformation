var DEFAULT_GOALS = {
  'Science': 16,
  'Sports': 16,
  'Technology': 16,
  'Business': 16,
  'Entertainment': 16,
  'Politics': 16
};

var READING_LEVELS = {
  1: {
    threshold: 90,
    message: ' You are currently reading at the same level as an 11-year old. Try to step it up!'
  },
  2: { 
    threshold: 60,
    message: ' You are currently reading at the level of a high schooler. Not bad, but you can do better!'
  },
  3: {
    threshold: 30,
    message: ' You are currently reading at the level of a college student. Good work!'
  },
  4: {
    message: ' You are reading at an extremely high level. Be proud of yourself!'
  }
}

var CATEGORY_MAP = {
    'undefined': 'Other',
    'computer_internet': 'Technology',
    'arts_entertainment': 'Entertainment',
    'recreation': 'Entertainment',
    'science_technology': 'Science',
    'religion': 'Other',
    'business': 'Business',
    'culture_politics': 'Politics',
    'sports': 'Sports',
    'health': 'Other',
    'gaming': 'Entertainment', 
    'law_crime': 'Other',
    'politics': 'Politics',
    'science': 'Science',
    'entertainment': 'Entertainment',
    'technology': 'Technology' 
};

/* these are now in CSS
var CATEGORY_COLORS = {
    'Other': '#e377c2',
    'Technology': '#E67E22',
    'Entertainment': '#F1C40F',
    'Science': '#E74C3C',
    'Business': '#9B59B6',
    'Politics': '#3498DB',
    'Sports': '#2ECC71'
}
*/
var PIE_CHART_COLORS = [
  '#e377c2', // Other
  '#E67E22', // Technology
  '#F1C40F', // Entertainment
  '#E74C3C', // Science
  '#9B59B6', // Business
  '#3498DB', // Politics
  '#2ECC71'  // Sports
];

