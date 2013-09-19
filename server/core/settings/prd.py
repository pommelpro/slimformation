"""Production settings and globals."""
import sys
import os
from .base import *

# Import secrets
sys.path.append(
    os.path.normpath(os.path.join(PROJECT_ROOT, '../../secrets/slimformation/prd'))
)
from secrets import *

# Set static URL
STATIC_URL = 'http://media.knightlab.us/slimformation/'

#DATABASES = {
#    'default': {
#        'ENGINE': 'mongo',
#        'NAME': 'slimformation',
#        'HOST': 'prd-mongo1.knilab.com',
#        'PORT': 27017,
#    }
#}
