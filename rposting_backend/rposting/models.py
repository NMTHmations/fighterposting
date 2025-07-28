from django.db import models
from django.core.validators import MinLengthValidator,FileExtensionValidator

# Create your models here.

def user_directory_path(instance, filename):
    # If the instance is new and doesn't have an ID yet, assign a temporary unique ID
    if not instance.pk:
        return f"uploads/temp/{filename}"
    return f"uploads/{instance.id}/{filename}"

class Admin(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255,null=False)
    password = models.CharField(validators=[MinLengthValidator(8)],null=False,max_length=255)

class ReviewPost(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(null=False,max_length=255,default=str)
    image_source = models.FileField(upload_to=user_directory_path,null=True,validators=[FileExtensionValidator(['jpg','png','jpeg','gif','webm'])])
    
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