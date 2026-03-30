from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractUser
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None,**extra_fields):
        if not username:
            raise ValueError("Username is Required")
        
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        return self.create_user(username, password, **extra_fields)

class User(AbstractUser):
    username = models.CharField(_('user Name'),max_length=50, unique=True,null=True)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
    
    def __str__(self):
        return self.username





GENDER_CHOICES = [
        ('male',"Male"),
        ('female',"Female")
    ]
USER_ROLES = [
    ('student','Student'),
    ('supervisor','Supervisor'),
    ('admin','Admin')
]
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile',null=True)
    role = models.CharField(max_length=12,editable=False,choices=USER_ROLES,default='student')
    email = models.EmailField(unique=True)
    first_name = models.CharField(_("First Name"),max_length=50)
    last_name = models.CharField(_("Last Name"),max_length=50)
    reg_no = models.CharField(_("Registration Number"),max_length=16,unique=True,primary_key=True)
    phone_number = models.CharField(_("Phone Number"),max_length=15,unique=True)
    gender = models.CharField(_("Gender"),choices=GENDER_CHOICES,default = "male")
    academic_year=models.IntegerField(_("Academic Year"))
    #relationships
    faculty  = models.ForeignKey("Faculty",on_delete=models.CASCADE,related_name="Students")
    course  = models.ForeignKey("Course",on_delete=models.CASCADE,related_name="Students")
    supervisor  = models.ForeignKey("Supervisor",on_delete=models.CASCADE,related_name="Students")
    
    
    def __str__(self):
        return f"{self.first_name} - {self.last_name} ({self.reg_no})"

    
class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='voter_profile',null=True)
    role = models.CharField(max_length=12,editable=False,choices=USER_ROLES,default='supervisor')
    email = models.EmailField(unique=True)
    first_name = models.CharField(_("First Name"),max_length=50)
    last_name = models.CharField(_("Last Name"),max_length=50)
    reg_no = models.CharField(_("Registration Number"),max_length=16,unique=True,primary_key=True)
    phone_number = models.CharField(_("Phone Number"),max_length=15,unique=True)
    gender = models.CharField(_("Gender"),choices=GENDER_CHOICES,default = "male")
    #relationships
    faculty  = models.ForeignKey("Faculty",on_delete=models.CASCADE,related_name="Supervisors")
    course  = models.ForeignKey("Course",on_delete=models.CASCADE,related_name="Supervisors")
    
    
    def __str__(self):
        return f"{self.first_name} - {self.last_name} ({self.reg_no})"
    
class Project(models.Model):
    PROJECT_STATUSES = [
        ("available", "Available"),
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("completed", "Completed"),
        ("closed", "Closed")
    ]
    title = models.CharField(_("Project Title"), max_length=50,unique=True)
    abstract = models.TextField(_("Project Abstract"))
    status = models.CharField(_("Status"),max_length=10,choices=PROJECT_STATUSES,default="available")
    start_date=models.DateField(auto_now_add=True)
    
    #relationships
    supervisor  =models.ForeignKey("Supervisor",on_delete=models.CASCADE,related_name="Projects")
    course = models.ForeignKey("Course",on_delete=models.SET_NULL,related_name="Projects",null=True)
    faculty = models.ForeignKey("Faculty",on_delete=models.SET_NULL,related_name="Projects",null=True)
    
    def __str__(self):
        return f"{self.title} by {self.supervisor}"
    
class Faculty(models.Model):
    name = models.CharField(_("Faculty Name"),max_length=30,unique=True)
    code = models.CharField(_("Faculty Code"),max_length=2,unique=True)
    
    def __str__(self):
        return self.name
    
class Course(models.Model):
    name = models.CharField(_("Course Name"),max_length=50,unique=True)
    code = models.CharField(_("Course Code"),max_length=3,unique=True)
    #relationships
    faculty = models.ForeignKey(Faculty,on_delete=models.CASCADE,related_name="Courses")
    
    def __str__(self):
        return self.name
    
class Activity(models.Model):
    ACTIVITY_STATUSES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("rejected", "Rejected")
    ]
    project = models.ForeignKey("Project",on_delete=models.CASCADE,related_name="Activities")
    title = models.CharField(_("Activity Title"), max_length=50,unique=True)
    description = models.TextField(_("Activity Description"))
    status = models.CharField(_("Status"),max_length=10,choices=ACTIVITY_STATUSES,default="pending")
    start_date=models.DateField(auto_now_add=True)
    weight = models.DecimalField(_("Weight / Credit Units"),max_digits=1,decimal_places=1,default=0.0)
    
    def __str__(self):
        return self.title
    
class Feedback(models.Model):
    supervision = models.ForeignKey("Supervision",on_delete=models.CASCADE,related_name="Feedbacks")
    supervisor = models.ForeignKey("Supervisor",on_delete=models.CASCADE,related_name="Feedbacks")
    comments  =models.TextField(_("Comments"))
    grade= models.DecimalField(_("Grade"),max_digits=1,decimal_places=1)
    
    def __str__(self):
        return f'{self.supervisor.first_name}`s feedback'
    
class Supervision(models.Model):
    SUPERVISION_STATUSES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed")
    ]
    activity = models.ForeignKey("Activity",on_delete=models.CASCADE,related_name="Submissions")
    student = models.ForeignKey("Student",on_delete=models.CASCADE,related_name="Submissions")
    file_name=models.FileField(_("File Name"),upload_to='data/submissions/')
    submission_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(_("Status"),max_length=10,choices=SUPERVISION_STATUSES,default="pending")
    
    def __str__(self):
        return f'{self.activity.title} by {self.student.first_name}'