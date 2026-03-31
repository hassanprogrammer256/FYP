from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login
from django.db.models import Count, Avg, Q, Sum, Case, When, Value, CharField
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import *
from .models import *
import json
from datetime import timedelta

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            role = None
            reg_no = None
            if Student.objects.filter(user=user).exists():
                role = 'student'
            elif Supervisor.objects.filter(user=user).exists():
                role = 'supervisor'
            else:
                role = 'admin'
            
            if role == 'student':
                reg_no = Student.objects.get(user=user).reg_no
            elif role == 'supervisor':
                reg_no = Supervisor.objects.get(user=user).reg_no
            else:
                reg_no= None
            
            return Response({
                'success': True,
                'message': 'Logged in successfully',
                'user': {
                    'reg_no': reg_no,
                    'role': role,
         
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

class SupervisorViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SupervisorSerializer
    queryset = Supervisor.objects.all()
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get supervisor dashboard data"""
        supervisor_id = request.query_params.get('supervisor_id')
        if not supervisor_id:
            return Response({'error': 'Supervisor ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            supervisor = Supervisor.objects.get(id=supervisor_id)
            
            # Get all students under this supervisor
            students = Student.objects.filter(supervisor=supervisor)
            total_students = students.count()
            
            # Calculate pending reviews
            pending_reviews = Supervision.objects.filter(
                student__in=students,
                status='pending'
            ).count()
            
            # Calculate project statistics
            projects = Project.objects.filter(supervisor=supervisor)
            completed_projects = projects.filter(status='completed').count()
            
            # Calculate progress statistics
            on_track = 0
            at_risk = 0
            total_progress = 0
            
            for student in students:
                progress = self.calculate_student_progress(student)
                total_progress += progress
                if progress >= 70:
                    on_track += 1
                elif progress < 40:
                    at_risk += 1
            
            avg_progress = total_progress / total_students if total_students > 0 else 0
            
            # Get submitted drafts
            submitted_drafts = Supervision.objects.filter(
                student__in=students
            ).count()
            
            # Get top performers
            top_performers = self.get_top_performers(supervisor)
            
            # Calculate feedback statistics
            feedbacks = Feedback.objects.filter(supervisor=supervisor)
            highest_score = feedbacks.aggregate(max_score=Avg('grade'))['max_score'] or 0
            lowest_score = feedbacks.aggregate(min_score=Avg('grade'))['min_score'] or 0
            revision_requests = feedbacks.filter(grade__lt=3.0).count()
            
            # Calculate average submission time
            avg_submission_time = self.calculate_avg_submission_time(students)
            
            project_report = {
                'total_students': total_students,
                'pending_reviews': pending_reviews,
                'upcoming_defenses': 0,
                'avg_progress': round(avg_progress, 1),
                'completed': completed_projects,
                'on_track': on_track,
                'at_risk': at_risk,
                'submitted_drafts': submitted_drafts,
                'highest_score': round(highest_score, 1),
                'lowest_score': round(lowest_score, 1),
                'avg_submission_time': avg_submission_time,
                'revision_requests': revision_requests,
                'top_performers': top_performers
            }
            
            return Response({
                'role': 'supervisor',
                'bio': SupervisorSerializer(supervisor).data,
                'projectReport': project_report
            })
            
        except Supervisor.DoesNotExist:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def students(self, request):
        """Get all students under supervision"""
        supervisor_id = request.query_params.get('supervisor_id')
        if not supervisor_id:
            return Response({'error': 'Supervisor ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            supervisor = Supervisor.objects.get(id=supervisor_id)
            students = Student.objects.filter(supervisor=supervisor)
            serializer = StudentSerializer(students, many=True)
            return Response({'students': serializer.data})
        except Supervisor.DoesNotExist:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def pending_reviews(self, request):
        """Get all pending reviews"""
        supervisor_id = request.query_params.get('supervisor_id')
        if not supervisor_id:
            return Response({'error': 'Supervisor ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            supervisor = Supervisor.objects.get(id=supervisor_id)
            students = Student.objects.filter(supervisor=supervisor)
            
            pending_submissions = Supervision.objects.filter(
                student__in=students,
                status='pending'
            ).select_related('student', 'activity')
            
            reviews_data = []
            for submission in pending_submissions:
                reviews_data.append({
                    'id': submission.id,
                    'student_name': f"{submission.student.first_name} {submission.student.last_name}",
                    'activity_title': submission.activity.title,
                    'submission_date': submission.submission_date,
                    'file_url': submission.file_name.url if submission.file_name else None,
                    'student_id': submission.student.id
                })
            
            return Response({'reviews': reviews_data})
        except Supervisor.DoesNotExist:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def review_submission(self, request):
        """Review a student submission"""
        submission_id = request.data.get('submission_id')
        grade = request.data.get('grade')
        comments = request.data.get('comments')
        
        if not submission_id or not grade:
            return Response({'error': 'Submission ID and grade required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            submission = Supervision.objects.get(id=submission_id)
            
            # Create feedback
            feedback = Feedback.objects.create(
                supervision=submission,
                supervisor=submission.student.supervisor,
                comments=comments or '',
                grade=grade
            )
            
            # Update submission status
            submission.status = 'reviewed'
            submission.save()
            
            return Response({
                'message': 'Submission reviewed successfully',
                'feedback_id': feedback.id
            })
        except Supervision.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def calculate_student_progress(self, student):
        """Calculate student's project completion percentage"""
        project = Project.objects.filter(
            course=student.course,
            faculty=student.faculty
        ).first()
        
        if not project:
            return 0
        
        total_activities = Activity.objects.filter(project=project).count()
        if total_activities == 0:
            return 0
        
        completed_activities = Supervision.objects.filter(
            student=student,
            activity__project=project,
            status='reviewed'
        ).count()
        
        return (completed_activities / total_activities) * 100
    
    def get_top_performers(self, supervisor, limit=5):
        """Get top performing students"""
        students = Student.objects.filter(supervisor=supervisor)
        
        performers = []
        for student in students:
            progress = self.calculate_student_progress(student)
            project = Project.objects.filter(
                course=student.course,
                faculty=student.faculty
            ).first()
            
            performers.append({
                'name': f"{student.first_name} {student.last_name}",
                'project_title': project.title if project else 'No Project',
                'progress': round(progress, 1)
            })
        
        performers.sort(key=lambda x: x['progress'], reverse=True)
        return performers[:limit]
    
    def calculate_avg_submission_time(self, students):
        """Calculate average submission time in days"""
        submissions = Supervision.objects.filter(student__in=students)
        
        if not submissions.exists():
            return '0'
        
        # Calculate average days between activity start and submission
        total_days = 0
        for submission in submissions:
            days = (submission.submission_date.date() - submission.activity.start_date).days
            total_days += max(days, 0)
        
        avg_days = total_days / submissions.count()
        return f"{round(avg_days, 1)}"

class StudentViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get student dashboard data"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'Student ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(reg_no=student_id)
            project = Project.objects.filter(
                supervisor=student.supervisor).first()
            
            milestones = self.calculate_milestones(student, project)
            submissions = Supervision.objects.filter(
                student=student,
                activity__project=project
            ) if project else []
            
            feedback_count = Feedback.objects.filter(
                supervision__student=student,
                supervision__activity__project=project
            ).count() if project else 0
            
            # Calculate completion percentage
            completion_percentage = self.calculate_completion_percentage(student, project)
            
            # Get deadline days left
            days_left = self.calculate_deadline_days_left(project)
            
            # Count chapters completed
            chapters_completed = self.count_chapters_completed(project)
            
            project_report = {
                'title': project.title if project else None,
                'supervisor_name': f"{student.supervisor.first_name} {student.supervisor.last_name}" if student.supervisor and project else None,
                'completion_percentage': completion_percentage,
                'status': project.status if project else 'No Project Assigned',
                'deadline_days_left': days_left,
                'chapters_completed': chapters_completed,
                'feedback_count': feedback_count,
                # 'draft_submissions': submissions.count(),
                'milestones': milestones
            }
            
            return Response({
                'role': 'student',
                'bio': StudentSerializer(student).data,
                'projectReport': project_report
            })
            
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def projects(self, request):
        """Get projects assigned to the student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'Student ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(reg_no=student_id)
            projects = Project.objects.filter(
                course=student.course,
                faculty=student.faculty
            )
            serializer = ProjectSerializer(projects, many=True)
            return Response({'projects': serializer.data})
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def submit_activity(self, request):
        """Submit an activity"""
        student_id = request.data.get('student_id')
        activity_id = request.data.get('activity_id')
        file_data = request.data.get('file_data')
        
        if not student_id or not activity_id:
            return Response({'error': 'Student ID and Activity ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(user_id=student_id)
            activity = Activity.objects.get(id=activity_id)
            
            # Check if already submitted
            if Supervision.objects.filter(activity=activity, student=student).exists():
                return Response({'error': 'Already submitted for this activity'}, status=status.HTTP_400_BAD_REQUEST)
            
            submission = Supervision.objects.create(
                activity=activity,
                student=student,
                file_name=file_data or 'submission.pdf'
            )
            
            return Response({
                'message': 'Activity submitted successfully',
                'submission_id': submission.id
            }, status=status.HTTP_201_CREATED)
            
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def submissions(self, request):
        """Get all submissions for a student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'Student ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(reg_no=student_id)
            submissions = Supervision.objects.filter(student=student)
            serializer = SupervisionSerializer(submissions, many=True)
            return Response({'submissions': serializer.data})
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def feedbacks(self, request):
        """Get all feedbacks for a student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'Student ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(reg_no=student_id)
            feedbacks = Feedback.objects.filter(supervision__student=student)
            serializer = FeedbackSerializer(feedbacks, many=True)
            return Response({'feedbacks': serializer.data})
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def calculate_completion_percentage(self, student, project):
        """Calculate student's project completion percentage"""
        if not project:
            return 0
        
        total_activities = Activity.objects.filter(project=project).count()
        if total_activities == 0:
            return 0
        
        completed_activities = Supervision.objects.filter(
            student=student,
            activity__project=project,
            status='reviewed'
        ).count()
        
        return round((completed_activities / total_activities) * 100, 1)
    
    def calculate_milestones(self, student, project):
        """Calculate milestones for student"""
        milestones = [
            {'label': 'Proposal', 'status': 'pending', 'date': ''},
            {'label': 'Literature Review', 'status': 'pending', 'date': ''},
            {'label': 'Methodology', 'status': 'pending', 'date': ''},
            {'label': 'Implementation', 'status': 'pending', 'date': ''},
            {'label': 'Final Report', 'status': 'pending', 'date': ''}
        ]
        
        if not project:
            print ("No project assigned, returning default milestones")
            return milestones
        completed_activities = Activity.objects.filter(
            project=project,
        )
        print(f"Completed activities for project {project.id}: {completed_activities.count()}")
        all_activities = Activity.objects.filter(project=project).order_by('start_date')
        print(f"All activities for project {project.id}: {all_activities.count()}")
    
        return all_activities.values('title', 'start_date','status')
    
    def count_chapters_completed(self, project):
        """Count completed chapters"""
        if not project:
            return 0
        
        completed = Supervision.objects.filter(
            activity__project=project,
            status='reviewed'
        ).count()
        
        return min(completed, 6)
    
    def calculate_deadline_days_left(self, project):
        """Calculate days left until deadline"""
        if not project or not project.start_date:
            return 0
        
        # Assuming 6 months deadline
        deadline = project.start_date + timedelta(days=180)
        days_left = (deadline - timezone.now().date()).days
        return max(days_left, 0)

class AdminViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get admin dashboard data"""
        # Get statistics
        total_projects = Project.objects.count()
        active_students = Student.objects.count()
        total_supervisors = Supervisor.objects.count()
        completed_projects = Project.objects.filter(status='completed').count()
        
        # Department statistics
        faculties = Faculty.objects.all()
        department_stats = []
        for faculty in faculties:
            department_stats.append({
                'name': faculty.name,
                'count': Project.objects.filter(faculty=faculty).count()
            })
        
        # Submission statistics
        total_submissions = Supervision.objects.count()
        on_time = Supervision.objects.filter(
            submission_date__lte=timezone.now()
        ).count()
        late = Supervision.objects.filter(
            submission_date__gt=timezone.now()
        ).count()
        pending = Supervision.objects.filter(status='pending').count()
        
        submission_stats = {
            'onTime': on_time,
            'late': late,
            'pending': pending
        }
        
        # Supervisor load
        avg_students_per_supervisor = active_students / total_supervisors if total_supervisors > 0 else 0
        
        # Success rate
        success_rate = (completed_projects / total_projects * 100) if total_projects > 0 else 0
        
        # Recent projects
        recent_projects = Project.objects.all().order_by('-start_date')[:5]
        recent_projects_list = []
        for project in recent_projects:
            student = Student.objects.filter(
                course=project.course,
                faculty=project.faculty
            ).first()
            
            recent_projects_list.append({
                'title': project.title,
                'student_name': f"{student.first_name} {student.last_name}" if student else 'N/A',
                'department': project.faculty.name if project.faculty else 'N/A',
                'status': project.status
            })
        
        project_report = {
            'total_projects': total_projects,
            'active_students': active_students,
            'total_supervisors': total_supervisors,
            'completed_projects': completed_projects,
            'department_stats': department_stats,
            'submission_stats': submission_stats,
            'avg_students_per_supervisor': round(avg_students_per_supervisor, 1),
            'success_rate': round(success_rate, 1),
            'recent_projects': recent_projects_list
        }
        
        return Response({
            'role': 'admin',
            'projectReport': project_report
        })
    
    @action(detail=False, methods=['get'])
    def all_students(self, request):
        """Get all students"""
        students = Student.objects.all().select_related('course', 'faculty', 'supervisor')
        serializer = StudentSerializer(students, many=True)
        return Response({'students': serializer.data})
    
    @action(detail=False, methods=['post'])
    def assign_supervisor(self, request):
        """Assign a supervisor to a student"""
        student_id = request.data.get('student_id')
        supervisor_id = request.data.get('supervisor_id')
        
        if not student_id or not supervisor_id:
            return Response({'error': 'Student ID and Supervisor ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(id=student_id)
            supervisor = Supervisor.objects.get(id=supervisor_id)
            
            student.supervisor = supervisor
            student.save()
            
            return Response({'message': 'Supervisor assigned successfully'})
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Supervisor.DoesNotExist:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def create_project(self, request):
        """Create a new project"""
        title = request.data.get('title')
        abstract = request.data.get('abstract')
        supervisor_id = request.data.get('supervisor_id')
        course_id = request.data.get('course_id')
        faculty_id = request.data.get('faculty_id')
        status_val = request.data.get('status', 'available')
        
        if not all([title, abstract, supervisor_id, course_id, faculty_id]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            supervisor = Supervisor.objects.get(id=supervisor_id)
            course = Course.objects.get(id=course_id)
            faculty = Faculty.objects.get(id=faculty_id)
            
            project = Project.objects.create(
                title=title,
                abstract=abstract,
                status=status_val,
                supervisor=supervisor,
                course=course,
                faculty=faculty
            )
            
            serializer = ProjectSerializer(project)
            return Response({
                'message': 'Project created successfully',
                'project': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Supervisor.DoesNotExist:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_404_NOT_FOUND)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except Faculty.DoesNotExist:
            return Response({'error': 'Faculty not found'}, status=status.HTTP_404_NOT_FOUND)

class ProjectViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    
    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for a project"""
        project = self.get_object()
        activities = Activity.objects.filter(project=project)
        serializer = ActivitySerializer(activities, many=True)
        return Response({'activities': serializer.data})

class FacultyViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = FacultySerializer
    queryset = Faculty.objects.all()

class CourseViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    
    @action(detail=False, methods=['get'])
    def by_faculty(self, request):
        """Get courses by faculty"""
        faculty_id = request.query_params.get('faculty_id')
        if faculty_id:
            courses = Course.objects.filter(faculty_id=faculty_id)
            serializer = CourseSerializer(courses, many=True)
            return Response({'courses': serializer.data})
        return Response({'courses': []})

class ActivityViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
    
    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """Get all submissions for an activity"""
        activity = self.get_object()
        submissions = Supervision.objects.filter(activity=activity)
        serializer = SupervisionSerializer(submissions, many=True)
        return Response({'submissions': serializer.data})

class FeedbackViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

class SupervisionViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SupervisionSerializer
    queryset = Supervision.objects.all()