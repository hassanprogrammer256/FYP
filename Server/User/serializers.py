from rest_framework.serializers import ModelSerializer, CharField, ValidationError,PrimaryKeyRelatedField,SerializerMethodField,StringRelatedField
from django.utils.translation import gettext_lazy as _
from .models import *

# ==================== Nested Serializers ====================

class FacultySerializer(ModelSerializer):
    class Meta:
        model = Faculty
        fields = "__all__"


class CourseSerializer(ModelSerializer):
    faculty = FacultySerializer(read_only=True)
    faculty_id =PrimaryKeyRelatedField(
        queryset=Faculty.objects.all(),
        source='faculty',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Course
        fields = "__all__"


class SupervisorSerializer(ModelSerializer):
    password = CharField(write_only=True, required=True, label=_("password"))
    full_name =SerializerMethodField()
    
    class Meta:
        model = Supervisor
        fields = "__all__"
        read_only_fields = ["user"]
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}" if obj.first_name and obj.last_name else obj.reg_no
    
    def validate_password(self, value):
        if value and len(value) < 4:
            raise ValidationError("Password must be at least 4 characters long")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            username=validated_data['reg_no'],
            password=password
        )

        supervisor = Supervisor.objects.create(
            user=user,
            **validated_data
        )
        
        return supervisor
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        if password:
            instance.user.set_password(password)
            instance.user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class StudentSerializer(ModelSerializer):
    password = CharField(write_only=True, required=True, label=_("password"))
    
    # Nested serializers for read operations
    course_detail = CourseSerializer(source='course', read_only=True)
    faculty_detail = FacultySerializer(source='faculty', read_only=True)
    supervisor_detail = SupervisorSerializer(source='supervisor', read_only=True)
    
    # Simplified string representations (alternative)
    course_name = StringRelatedField(source='course', read_only=True)
    faculty_name = StringRelatedField(source='faculty', read_only=True)
    supervisor_name = SerializerMethodField()
    
    # Write-only fields for foreign keys
    course_id = PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True,
        required=False,
        allow_null=True
    )
    faculty_id = PrimaryKeyRelatedField(
        queryset=Faculty.objects.all(),
        source='faculty',
        write_only=True,
        required=False,
        allow_null=True
    )
    supervisor_id = PrimaryKeyRelatedField(
        queryset=Supervisor.objects.all(),
        source='supervisor',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Student
        fields = [
          'reg_no','first_name', 'last_name', 'image',
            'phone_number', 'gender',
            'academic_year','password','email',
            'course_detail', 'faculty_detail', 'supervisor_detail',
            'course_name', 'faculty_name', 'supervisor_name',
            # Write-only fields
            'course_id', 'faculty_id', 'supervisor_id'
        ]
        read_only_fields = ["user"]
    
    def get_supervisor_name(self, obj):
        if obj.supervisor:
            return f"{obj.supervisor.first_name} {obj.supervisor.last_name}"
        return None
    
    def validate_password(self, value):
        if value and len(value) < 4:
            raise ValidationError("Password must be at least 4 characters long")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Create User first with the provided password
        user = User.objects.create_user(
            username=validated_data['reg_no'],
            password=password
        )
        
        # Create Student and link to User
        student = Student.objects.create(
            user=user,
            **validated_data
        )
        
        return student
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        if password:
            # Update the associated user's password
            instance.user.set_password(password)
            instance.user.save()
        
        # Update other student fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class ProjectSerializer(ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    supervisor_detail = SupervisorSerializer(source='supervisor', read_only=True)
    student_name = StringRelatedField(source='student', read_only=True)
    supervisor_name = SerializerMethodField()
    
    class Meta:
        model = Project
        fields = "__all__"
    
    def get_supervisor_name(self, obj):
        if obj.supervisor:
            return f"{obj.supervisor.first_name} {obj.supervisor.last_name}"
        return None


class ActivitySerializer(ModelSerializer):
    project_detail = ProjectSerializer(source='project', read_only=True)
    student_detail = StudentSerializer(source='student', read_only=True)
    
    class Meta:
        model = Activity
        fields = "__all__"


class FeedbackSerializer(ModelSerializer):
    activity_detail = ActivitySerializer(source='activity', read_only=True)
    supervisor_detail = SupervisorSerializer(source='supervisor', read_only=True)
    student_detail = StudentSerializer(source='student', read_only=True)
    
    class Meta:
        model = Feedback
        fields = "__all__"


class SupervisionSerializer(ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    supervisor_detail = SupervisorSerializer(source='supervisor', read_only=True)
    project_detail = ProjectSerializer(source='project', read_only=True)
    
    class Meta:
        model = Supervision
        fields = "__all__"