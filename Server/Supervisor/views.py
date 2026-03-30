from rest_framework.generics import ListAPIView,ListCreateAPIView
from User.models import *
from User.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated


class SupervisorDetailsView(ListAPIView):
    permission_classes=[AllowAny]
    def get(self,request):
        supervisor_id = request.data.get("supervisor_id")
        try:
            supervisor = Supervisor.objects.get(user_id = supervisor_id)
            if not supervisor:
                return Response({
                    "success": False,
                    "error": "Supervisor Not Found"
                },status=status.HTTP_404_NOT_FOUND)
            else:
                data = SupervisorSerializer(supervisor).data
                return Response ({
                    "success":True,
                    "data":data
                })
        except Supervisor.DoesNotExist:
            return Response({
                "success":False,
                "error": "User Not Found"
            },status= status.HTTP_500_INTERNAL_SERVER_ERROR)
                
class SupervisorProjectsView(ListAPIView):
    def get(self,request):
        supervisor_id = request.data.get("student_id")
        try:
            supervisor = Supervisor.objects.get(user_id=supervisor_id)
            supervisor_projects = Project.objects.select_related("Supervisors").filter(user_id = supervisor_id)
            projects_count = supervisor_projects.count()
            data = ProjectSerializer(supervisor_projects,many=True).data
            return Response({
                "success":True,
                "total_projects":projects_count,
                "data":data
            })
        except Supervisor.DoesNotExist:
            return Response({
                "success":False,
                "error":"Supervisor Not Found"
            })
            