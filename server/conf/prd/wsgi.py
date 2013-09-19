"""
WSGI config for {{ project_name }} project.
"""
import os
import sys
import site

site.addsitedir('/home/apps/env/{{ project_name }}/lib/python2.7/site-packages')
sys.path.append('/home/apps/sites/{{ project_name }}')
sys.stdout = sys.stderr

os.environ.setdefault('FLASK_SETTINGS_MODULE', 'core.settings.prd')

from api import app as application
