from rest_framework.generics import ListAPIView,ListCreateAPIView,RetrieveUpdateAPIView
from django.shortcuts import get_object_or_404
from User.models import *
from User.serializers import *
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
from rest_framework.decorators import permission_classes
import re

class StudentDetails(ListAPIView):
    permission_classes=[AllowAny]
    def get(self,request):
        student_id = request.data.get("student_id")
        if not student_id:
            return({
                "success":False,
                "error": "Student Not Found"
            })
        user= get_object_or_404(User,id=student_id)
        if user:
            student = Student.objects.get(user=user)
            data = StudentSerializer(student).data
            return Response ({
                "success": True,
                "data":data})
        else:
            return Response({
                "success":False,
                "error": "Student Not Found"
            })
            
class StudentProjectView(ListCreateAPIView):
    permission_classes = [AllowAny]
    def get(self,request):
        #this views all the projects the student is doing
        student_id = request.data.get("student_id")
        user= User.objects.get(id=student_id)
        if not user:
            return Response({
                "success":False,
                "error":"User Not Found"
            })
        else:
            student = Student.objects.get(user=user)
            if not student:
                return Response({
                    "success":False,
                    "error": "Student Not Found"
                })
            else:
                supervisor = Supervisor.objects.get(user_id=student.supervisor.user_id)
                projects_count = Project.objects.filter(supervisor=supervisor).count()
                if projects_count > 0:
                    projects =  Project.objects.filter(supervisor=supervisor)
                    data = ProjectSerializer(projects,many=True).data
                    return Response({
                        "success": True,
                        "data":{
                            "supervisor": f'{supervisor.first_name} - {supervisor.last_name}',
                            "projects_count": projects_count,
                            "projects": data
                            
                        }
                    })
                else:
                     return Response({
                        "success": True,
                        "data":{
                            "supervisor": f'{supervisor.first_name} - {supervisor.last_name}',
                            "projects_count": 0
                            
                        }
                    })

class SubmissionView(ListCreateAPIView): 
    permission_classes = [AllowAny] 
    def post(self,request):
        student_id = request.data.get('student_id')
        activity_id = request.data.get('activity_id')
        student = Student.objects.get(user_id = student_id)
        activity = Activity.objects.get(id=activity_id)
        data  = request.data.get("data")
        Supervision.objects.create(
            activity = activity,
            student = student,
            file_name = data)    
        return Response({
            "success": True,
            "message": "Activity Submitted Successfully"
        },status=status.HTTP_201_CREATED)         
        
    def get(self,request):
        student_id = request.data.get("student_id")
        student = Student.objects.get(user_id=student_id)
        supervision = Supervision.objects.filter(student=student)
        data = SupervisionSerializer(supervision,many=True).data
        
        return Response({
            "success":True,
            "data":data
        })

class FeedbackView(ListAPIView):
    def get(self,request):
        student_id = request.data.get("student_id")
        student = Student.objects.get(user__id = student_id)
        data = Feedback.objects.filter(supervisor__id = student.supervisor.id)
        return Response({
        "success":True,
        "data":data
        })
       
@permission_classes([AllowAny])   
class UpdateStudentDetailsView(RetrieveUpdateAPIView):
    def put(self, request):
        reg_no = request.data.get('reg_no')
        data = request.data.get('data', {})
        
        # Validate required fields
        if not reg_no:
            return Response({
                "success": False, 
                "error": "Registration number is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not data:
            return Response({
                "success": False, 
                "error": "No data sent"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(reg_no=reg_no)
            
            # Field validators
            validators = {
                'email': lambda x: re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', x),
                'phone_number': lambda x: re.match(r'^[0-9]{10,15}$', x),
                
            }
            
            # Validate fields before updating
            errors = {}
            for field, value in data.items():
                if field in validators:
                    if not validators[field](str(value)):
                        errors[field] = f"Invalid {field} format"
            
            if errors:
                return Response({
                    "success": False,
                    "error": "Validation failed",
                    "errors": errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update allowed fields
            allowed_fields = ['email', 'phone_number']
            
            updated_fields = []
            
            # Handle regular fields
            for field in allowed_fields:
                if field in data:
                    old_value = getattr(student, field)
                    new_value = data[field]
                    
                    if old_value != new_value:
                        setattr(student, field, new_value)
                        updated_fields.append(field)
            
            if not updated_fields:
                return Response({
                    "success": True,
                    "message": "No changes detected",
                    "data": StudentSerializer(student).data
                }, status=status.HTTP_200_OK)
            
            # Save the updated student
            student.save()
            
            # Update associated User model if it exists
            if hasattr(student, 'user') and 'email' in data:
                student.user.email = data['email']
                student.user.save()
            
            serializer = StudentSerializer(student)
            return Response({
                "success": True,
                "message": f"Student details updated successfully: {', '.join(updated_fields)}",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
            
        except Student.DoesNotExist:
            return Response({
                "success": False, 
                "error": f"Student with registration number '{reg_no}' not found"
            }, status=status.HTTP_404_NOT_FOUND)
            
        except ValidationError as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print(str(e))
            return Response({
                "success": False,
                "error": f"An unexpected error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)