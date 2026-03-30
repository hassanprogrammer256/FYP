from django.dispatch import receiver
from django.db.models.signals import pre_save,post_save
from .models import *
from django.db import transaction


@transaction.atomic()
@receiver(pre_save,sender=Supervisor)
def create_user_profile(instance,*args,**kwargs):
    if not instance.user:
        user = User.objects.create_user(
            username=instance.reg_no,
            password=None  
        )
        instance.user = user


        