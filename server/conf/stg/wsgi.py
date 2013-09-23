"""
WSGI config for slimformation project.
"""
import os
import sys
import site

site.addsitedir('/home/apps/env/slimformation/lib/python2.7/site-packages')
sys.path.append('/home/apps/sites/slimformation/server')
sys.stdout = sys.stderr

os.environ.setdefault('FLASK_SETTINGS_MODULE', 'core.settings.stg')

from slimformation import app as application
