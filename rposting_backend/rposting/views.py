from django.shortcuts import render
from .models import ReviewPost, ActivePost
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.views import SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import AdminTokenObtainPairSerializer
from django_ratelimit.decorators import ratelimit

class MySwaggerView(SpectacularSwaggerView):
    authentication_classes = [JWTAuthentication]

@method_decorator(ratelimit(key='ip', rate='1/5m', block=True), name='dispatch')
class AdminTokenGenerator(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer

class getReviewPosts(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        reviews = ReviewPost.objects.all().values()
        result = json.dumps(list(reviews),ensure_ascii=False,default=str)
        return JsonResponse(result,safe=False)

class getReviewPost(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request, slug):
        try:
            review = ReviewPost.objects.get(id=slug)
            result = {
                "id": review.id,
                "title": review.title,
                "image_source": review.image_source.url
            }
            result = json.dumps(result,ensure_ascii=False,default=str)
            return JsonResponse(result,safe=False)
        except:
            result = json.dumps({'error': '404'},ensure_ascii=False,default=str)
            return JsonResponse(result,safe=False)

@api_view(['GET'])
def getPost(request,slug):
    try:
        active = ActivePost.objects.get(id=slug)
        result = {
            "id": active.id,
            "title": active.post.title,
            "image_source": active.post.image_source.url,
            "starAvg": active.starAvg
        }
        result = json.dumps(result,ensure_ascii=False,default=str)
        return JsonResponse(result,safe=False)
    except:
        result = json.dumps({'error': '404'},ensure_ascii=False,default=str)
        return JsonResponse(result,safe=False)

@api_view(['GET'])
def getAllPosts(request):
    actives = ActivePost.objects.all().values("id","post__title","post__image_source","starAvg")
    result = json.dumps(list(actives),ensure_ascii=False,default=str)
    return JsonResponse(result,safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class InsertReview(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'title': {
                        'type': 'string',
                        'description': 'Title of post',
                        'default': 'test title'
                    },
                    'file': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Image file (jpg, png, gif)'
                    }
                },
                'required': ['title', 'file']
            }
        },
        responses={200: OpenApiResponse(description='Upload success')}
    )
    def post(self,request, *args, **kwargs):
        try:
            data = request.data.get('title')
            if not data:
                return JsonResponse(json.dumps([{'result':'Invalid request'}]),safe=False)
            if "file" not in request.FILES:
                return JsonResponse({'Response': 400, 'Message': 'No file provided'})
            file_obj = request.FILES["file"]
            file_extension = file_obj.name.split('.')[-1].lower()
            if file_extension not in ['jpg','jpeg','png','gif']:
                return JsonResponse({'Response': 400, 'Message': 'Invalid file format, only jpg,png or gif allowed'})
            review = ReviewPost(title=data, image_source=file_obj)
            review.save()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})
        

@method_decorator(csrf_exempt, name='dispatch')
class InsertPost(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'id': {
                        'type': 'string',
                        'description': 'Reviewed Post id',
                        'default': '1'
                    }
                },
                'required': ['id']
            }
        },
        responses={200: OpenApiResponse(description='Upload success')}
    )
    def post(self,request, *args, **kwargs):
        try:
            data = request.data.get('id')
            if not data:
                return JsonResponse(json.dumps([{'result':'Invalid request'}]),safe=False)
            review = ReviewPost.objects.get(id=data)
            active = ActivePost(post=review,oneStar=0,twoStar=0,threeStar=0,fourStar=0,fiveStar=0,starAvg=0)
            active.save()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})

class deletePost(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request, slug):
        try:
            active = ActivePost.objects.get(id=slug)
            active.delete()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})

class deleteReview(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request, slug):
        try:
            review = ReviewPost.objects.get(id=slug)
            review.delete()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})