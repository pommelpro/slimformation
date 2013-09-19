"""Staging settings and globals."""
import sys
import os
from .base import *

# Import secrets
sys.path.append(
    os.path.normpath(os.path.join(PROJECT_ROOT, '../../secrets/slimformation/stg'))
)
from secrets import *

# Set static URL
STATIC_URL = 'http://media.knilab.com/slimformation/'

#DATABASES = {
#    'default': {
#        'ENGINE': 'mongo',
#        'NAME': '{{ project_name }}',
#        'HOST': 'stg-mongo1.knilab.com',
#        'PORT': 27017,
#    }
#}
