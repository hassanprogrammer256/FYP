from django.urls import path
from .views import *

urlpatterns=[
    path('details/',StudentDetails.as_view(),name="student-details"),
    path('project/',StudentProjectView.as_view(),name="student-project-details"),
    path('submit-activity/',SubmissionView.as_view(),name="submit-activity"),
    path('view-feedbacks/',SubmissionView.as_view(),name="view-feedbacks"),
    path('update-details/',UpdateStudentDetailsView.as_view(), name='update-student-details')
    
]