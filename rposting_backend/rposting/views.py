import random
from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.response import Response
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
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from .serializers import AdminTokenObtainPairSerializer
from django_ratelimit.decorators import ratelimit
from rest_framework import status
import traceback
from rest_framework_simplejwt.authentication import JWTAuthentication

class MySwaggerView(SpectacularSwaggerView):
    authentication_classes = [JWTAuthentication]

# Before deployment: set secure to True from False

@method_decorator(ratelimit(key='ip', rate='1/10m',  method='POST', block=False), name='dispatch')
class AdminTokenGenerator(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer
    
    def post(self, request: Request, *args, **kwargs) -> Response:
        if getattr(request, 'limited', False):
            return Response(
                {"detail": "Too many login attempts."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise InvalidToken(e.args[0]) from e
        
        refresh = serializer.validated_data.get('refresh')
        access = serializer.validated_data.get('access')
        
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=False,
            samesite='Strict' or "Lax",
            max_age=600,
            path='/'
        )
        
        response.set_cookie(
            key='refresh_token',
            value=refresh,
            httponly=True,
            secure=False,
            samesite='Strict' or "Lax",
            max_age=600,
            path='/'
        )

        return response

class AdminRefreshToken(TokenRefreshView):
    serializer_class = TokenRefreshSerializer
    
    def post(self, request: Request, *args, **kwargs) -> Response:
        raw_token = request.COOKIES.get("refresh_token")
        if not raw_token:
            return Response({"detail": "No refresh token in cookies."}, status=400)
        serializer = self.serializer_class(data={"refresh": raw_token})

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise InvalidToken(e.args[0]) from e
        
        access = serializer.validated_data.get('access')
        
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=False,
            samesite='Strict',
            max_age=600,
            path='/'
        )

        return response

class getReviewPosts(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            listOfReviews = []
            reviews = ReviewPost.objects.filter(posted=False).order_by("-id")
            partialList = []
            for i in range(len(reviews)):
                item = {
                    "id": reviews[i].id,
                    "title": reviews[i].title,
                    "image_source": reviews[i].image_source.url,
                    "posted": reviews[i].posted
                }
                partialList.append(item)
                if (i + 1) % 10 == 0 or i == len(reviews) - 1:
                    listOfReviews.append(partialList)
                    partialList = []
            result = json.dumps(listOfReviews,ensure_ascii=False,default=str)
            return JsonResponse(result,safe=False)
        except Exception as e:
            error_details = traceback.format_exc()
            return JsonResponse({"error": error_details}, safe=False)
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

@api_view(["GET"])
def getRecommended(request):
    try:
        active = random.choice(ActivePost.objects.all())
        result = {
            "id" : active.id,
            "title": active.post.image_source.url
        }
        return Response(result,status=status.HTTP_200_OK)
    except:
        return Response({"message":"Error happened!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@api_view(['GET'])
def getAllPosts(request):
    try:
            listOfReviews = []
            actives = ActivePost.objects.order_by("-id")
            partialList = []
            for i in range(len(actives)):
                item = {
                    "id": actives[i].id,
                    "title": actives[i].post.title,
                    "image_source": actives[i].post.image_source.url,
                    "starAvg": actives[i].starAvg
                }
                partialList.append(item)
                if (i + 1) % 10 == 0 or i == len(actives) - 1:
                    listOfReviews.append(partialList)
                    partialList = []
            result = json.dumps(listOfReviews,ensure_ascii=False,default=str)
            return JsonResponse(result,safe=False)
    except Exception as e:
            error_details = traceback.format_exc()
            return JsonResponse({"error": error_details}, safe=False)

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
            review = ReviewPost(title=data, image_source=file_obj, posted=False)
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
            review.posted = True
            active.save()
            review.save()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})

class deletePost(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request, slug):
        try:
            active = ActivePost.objects.get(id=slug)
            review = ReviewPost.objects.get(id=active.post.id)
            review.posted = False
            review.save()
            active.delete()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})

class deleteReview(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request, slug):
        try:
            review = ReviewPost.objects.get(id=slug)
            review.image_source.delete(save=False)
            review.delete()
            return JsonResponse({'Response':200})
        except:
            return JsonResponse({'Response': 500})

@method_decorator(csrf_exempt, name='dispatch')
class modifyTitle(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'id': {
                        'type': 'string',
                        'description': 'id of string',
                        'default': '1'
                    },
                    'title': {
                        'type': 'string',
                        'description': 'Title of post',
                        'default': 'test title'
                    }
                },
                'required': ['id', 'title']
            }
        },
        responses={200: OpenApiResponse(description='Upload success')}
    )
    def patch(self,request):
        try:
            id = request.data.get('id')
            if not id:
                return Response({"message":"Error happened!"},status=status.HTTP_400_BAD_REQUEST)
            title = request.data.get('title')
            if not title:
                return Response({"message":"Error happened!"},status=status.HTTP_400_BAD_REQUEST)
            review = ReviewPost.objects.get(id=id)
            review.title = title
            review.save()
            return Response({"message":"ok"},status=status.HTTP_200_OK)
        except:
            return Response({"message":"Error happened!"},status=status.HTTP_404_NOT_FOUND)