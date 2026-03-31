from django.dispatch import receiver
from django.db.models.signals import pre_save,post_save
from .models import *
from django.db import transaction
from celery import shared_task
import cloudinary.uploader
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.files.base import ContentFile
import os
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

@transaction.atomic()
@receiver(pre_save,sender=Supervisor)
def create_user_profile(instance,*args,**kwargs):
    if not instance.user:
        user = User.objects.create_user(
            username=instance.reg_no,
            password=None  
        )
        instance.user = user

# @shared_task
# def upload_image_to_cloudinary_async(student_id, image_path, public_id):
#     """
#     Async task to upload image to Cloudinary.
#     This prevents blocking the main thread.
#     """
#     try:
#         upload_result = cloudinary.uploader.upload(
#             image_path,
#             public_id=public_id,
#             overwrite=True,
#             folder='students/profile_images/',
#             transformation=[
#                 {'width': 500, 'height': 500, 'crop': 'fill'},
#                 {'quality': 'auto'},
#                 {'fetch_format': 'auto'}
#             ]
#         )
        
#         # Update the student record with the Cloudinary URL
#         from .models import Student
#         student = Student.objects.get(id=student_id)
#         student.image = upload_result['secure_url']
#         student.save(update_fields=['image'])
        
#         return upload_result['secure_url']
#     except Exception as e:
#         logger.error(f"Async upload failed for student {student_id}: {str(e)}")
#         raise


# @receiver(post_save, sender=Student)
# def trigger_async_upload(sender, instance, created, **kwargs):
#     """
#     Trigger async upload to Cloudinary after saving the student.
#     Recommended for production environments.
#     """
#     if instance.image and not instance.image.startswith('http'):
#         # Only trigger if image is local (not already a Cloudinary URL)
#         from django.conf import settings
        
#         if not settings.DEBUG:  # In production
#             public_id = f'students/profile_images/{instance.reg_no}_{instance.first_name}_{instance.last_name}'
#             upload_image_to_cloudinary_async.delay(
#                 student_id=instance.id,
#                 image_path=instance.image.path,
#                 public_id=public_id
#             )