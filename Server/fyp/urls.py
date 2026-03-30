from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/',include('User.urls')),
    path('student/',include('Student.urls')),
    path('supervisor/',include('Supervisor.urls')),
    ]
