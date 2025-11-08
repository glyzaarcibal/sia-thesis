from django.contrib import admin

# Register your models here.
from .models import SleepEntry  # Update this line

admin.site.register(SleepEntry) 
