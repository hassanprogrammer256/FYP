from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register(r"supervisor",SupervisorViewSet,basename="Supervisor")
router.register(r"student",StudentViewSet,basename="student")
router.register(r"project",ProjectViewSet,basename="project")
router.register(r"faculty",FacultyViewSet,basename="faculty")
router.register(r"course",CourseViewSet,basename="course")
router.register(r"activity",ActivityViewSet,basename="activity")
router.register(r"feedback",FeedbackViewSet,basename="feedback")
router.register(r"supervision",SupervisionViewSet,basename="supervision")


urlpatterns = [
    path("",include(router.urls)),
    path('login/',LoginView.as_view() ,name='user-login')
]