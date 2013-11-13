from __future__ import division
from flask import Flask
from flask import jsonify
from flask import request
from flask import render_template
import importlib
import os
import traceback
import sys
import json
import re
import urllib, urllib2
from urlparse import urlparse

CWD = os.path.dirname(os.path.realpath(__file__))

#CATEGORY_URL = 'http://access.alchemyapi.com/calls/url/URLGetCategory'
CATEGORY_URL = 'http://textract.knightlab.com/classify'
TEXT_URL = 'http://access.alchemyapi.com/calls/url/URLGetText'
WORDS_PAT = re.compile('\w+')
VOWELS_PAT = re.compile('[aeiouy]{1,2}')
SENTENCE_END_PAT = re.compile(
    '(\. |\." |\.$|\."$|\? |\?" |\?$|\?"$|! |!" |!$|!"$)')
IGNORED_DOMAINS = \
    json.dumps(open(os.path.join(CWD, 'ignore_domains.txt')).read().split('\n'))

# Set default FLASK_SETTINGS_MODULE for debug mode
if __name__ == "__main__":
    if not os.environ.get('FLASK_SETTINGS_MODULE', ''):
        os.environ['FLASK_SETTINGS_MODULE'] = 'core.settings.loc'

app = Flask(__name__)



# Import settings module for the inject_static_url context processor.
settings_module = os.environ.get('FLASK_SETTINGS_MODULE')

try:
    importlib.import_module(settings_module)
except ImportError, e:
    raise ImportError(
        "Could not import settings '%s' (Is it on sys.path?): %s" \
        % (settings_module, e))

settings = sys.modules[settings_module]


@app.context_processor
def inject_static_url():
    """
    Inject the variable 'static_url' into the templates to avoid hard-coded
    paths to static files. Grab it from the environment variable STATIC_URL, 
    or use the default.

    Note:  The template variable will always have a trailing slash.
    """
    static_url = settings.STATIC_URL or app.static_url_path
    if not static_url.endswith('/'):
        static_url += '/'
    return dict(static_url=static_url)


def get_category_info(url):
    #query = urllib.urlencode({
    #    'url': url,
    #    'apikey': settings.ALCHEMY_API_KEY,
    #    'outputMode': 'json'
    #})
    query = urllib.urlencode({
        'url': url,
        '_accept': 'application/json'
    })
    return json.loads(urllib2.urlopen(CATEGORY_URL + '?%s' % query).read())


def get_text(url):
    query = urllib.urlencode({
        'url': url,
        'apikey': settings.ALCHEMY_API_KEY,
        'outputMode': 'json'
    })
    return json.loads(urllib2.urlopen(TEXT_URL + '?%s' % query).read())


def word_syllables(word):
    if len(word) <= 3:
      return 1
    word = word.lower()
    word = re.sub('(?:[^laeiouy]es|ed|[^laeiouy]e)$', '', word)
    word = re.sub('^y', '', word)
    word = re.sub('[0-9]+', '', word)
    return len(VOWELS_PAT.findall(word))


def num_words(text):
    return len(WORDS_PAT.findall(text))


def num_sentences(text):
    return len(SENTENCE_END_PAT.findall(text))


def num_syllables(text):
    return sum([word_syllables(word) for word in WORDS_PAT.findall(text)])


def flesch_kincaid(text):
    words = num_words(text)
    sentences = num_sentences(text)
    syllables = num_syllables(text)
    if sentences == 0:
        q1 = 0
    else:
        q1 = words / sentences
    if words == 0:
        q2 = 0
    else:
        q2 = syllables / words
    return 206.835 - 1.015 * q1 - 84.6 * q2


@app.route('/')
def main():
    return render_template('index.html')

@app.route('/categorize')
def categorize():
    url = request.args['url'].encode('utf-8')
    category_data = get_category_info(url)
    #if category_data['status'] == 'OK' and category_data['score'] > 0:
    if category_data['status'] == 'OK':
        category = category_data['categories'][0][0]
    else:
        category = 'undefined'
    text_data = get_text(url)
    if text_data['status'] == 'OK':
        text = text_data['text']
    else:
        text = ''
    domain = urlparse(url)[1]
    return jsonify(
        url=url,
        category=category,
        domain=domain,
        #readingScore="%.2f"%flesch_kincaid(text)
        readingScore=flesch_kincaid(text)
    )

@app.route('/ignore-domains')
def ignore_domains():
    return IGNORED_DOMAINS

        
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
