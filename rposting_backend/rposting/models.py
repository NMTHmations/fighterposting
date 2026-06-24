from django.db import models
from django.core.validators import MinLengthValidator,FileExtensionValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.timezone import now
import datetime

# Create your models here.

def user_directory_path(instance, filename):
    # If the instance is new and doesn't have an ID yet, assign a temporary unique ID
    if not instance.pk:
        return f"uploads/temp/{filename}"
    return f"uploads/{instance.id}/{filename}"

class AdminManager(BaseUserManager):
    def create_user(self,email,password,**extra_fields):
        if not email:
            raise ValueError("User must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
    
    def create_superuser(self,email,password,**extra_fields):
        return self.create_user(email,password)

class Admin(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True,default="test@example.com")
    objects = AdminManager()
    USERNAME_FIELD = 'email'
    
    def __str__(self):
        return self.email

class DeviceHandler(models.Model):
    id = models.AutoField(primary_key=True)
    deviceName = models.CharField(null=False,max_length=125)
    devicePAT = models.TextField(null=False,max_length=3000)
    TTL = models.DateField(default=now().date())

class SenderData(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(null=False,max_length=3000)
    photo = models.FileField(upload_to=user_directory_path,null=True,validators=[FileExtensionValidator(['jpg','png','jpeg','gif','webm'])])
    
    def __str__(self):
        return self.name

class FightClubTextMessages(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(null=False)
    message = models.TextField(null=False,max_length=300)
    socialPostType = models.CharField(null=False, max_length=256,choices={
        "TK": "TikTok",
        "FB": "Facebook",
        "IG": "Instagram",
        "YT": "YouTube",
        "TH": "Threads",
        "X": "X"})
    socialUrl = models.TextField(null=False,max_length=3000)
    sender = models.ForeignKey(SenderData, on_delete=models.CASCADE, null=True)

class ReviewPost(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(null=False,max_length=255,default=str)
    image_source = models.FileField(upload_to=user_directory_path,null=True,validators=[FileExtensionValidator(['jpg','png','jpeg','gif','webm'])])
    posted = models.BooleanField(null=False,default=False)
    
    def __str__(self):
        return f"{self.id}/{self.image_source}: {self.comment_text}"

class ActivePost(models.Model):
    id = models.AutoField(primary_key=True)
    post = models.OneToOneField(ReviewPost, on_delete=models.CASCADE)
    oneStar = models.IntegerField(null=False,default=0)
    twoStar = models.IntegerField(null=False,default=0)
    threeStar = models.IntegerField(null=False,default=0)
    fourStar = models.IntegerField(null=False,default=0)
    fiveStar = models.IntegerField(null=False,default=0)
    starAvg = models.FloatField(null=False,default=0.0)

class BlogPosts(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=128, null=False)
    post = models.TextField(null=False,max_length=3000)
    date = models.DateTimeField(default=now())