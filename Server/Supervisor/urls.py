from django.urls import path
from .views import *



urlpatterns =[
    path('details',SupervisorDetailsView.as_view(),name="supervisor-details"),
    path('project',SupervisorProjectsView.as_view(),name="supervisor-project-details"),
]