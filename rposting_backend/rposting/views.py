import random
from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.response import Response
from .models import ReviewPost, ActivePost, DeviceHandler, FightClubTextMessages, BlogPosts
from django.http import JsonResponse
import json
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
import requests
from dotenv import dotenv_values
from django.views.decorators.cache import never_cache
import math
import string
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import base64
import jwt
import datetime

def generateRandomString(size = 64):
        return ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for i in range(size))
    

def encrypt_message(message: str, public_key_bytes):
    key = RSA.import_key(public_key_bytes)
    cipher = PKCS1_OAEP.new(key)
    encrypted = cipher.encrypt(message.encode())
    return base64.b64encode(encrypted).decode()

def decrypt_message(encoded_encrypted_msg: str, private_key_bytes):
    key = RSA.import_key(private_key_bytes)
    cipher = PKCS1_OAEP.new(key)
    encrypted_bytes = base64.b64decode(encoded_encrypted_msg)
    decrypted = cipher.decrypt(encrypted_bytes)
    return decrypted.decode()

class MySwaggerView(SpectacularSwaggerView):
    authentication_classes = [JWTAuthentication]

# Before deployment: set secure to True from False

@method_decorator(never_cache, name='dispatch')
@method_decorator(ratelimit(key='ip', rate='1/10m',  method='POST', block=False), name='dispatch')
class AdminTokenGenerator(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer
    
    def post(self, request: Request, *args, **kwargs) -> Response:
        try:
            if getattr(request, 'limited', False):
                return Response(
                    {"detail": "Too many login attempts."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
        
            serializer = self.get_serializer(data=request.data)
        except Exception as e:
            traceback.print_exception()
            print(e.__traceback__.__str__)
            return Response({'Message':'Error happened!'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise InvalidToken(e.args[0]) from e
        
        try:
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
        except Exception as e:
            traceback.print_exception()
            print(e.__traceback__.__str__)
            return Response({'Message':'Error happened!'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(never_cache, name='dispatch')
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
            "starAvg": round(active.starAvg,1)
        }
        return Response(result,status=status.HTTP_200_OK)
    except UnboundLocalError as e:
        return Response(result,status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(result,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
                    "starAvg": round(actives[i].starAvg,1)
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


def verify_captcha(token):
    KEYS = dotenv_values()
    secret_key = KEYS["CAPTCHA_SECRET_KEY"]
    url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        "secret": secret_key,
        "response": token
    }
    response = requests.post(url,data=data)
    result = response.json()
    print(result)
    return result.get("success", False)

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
                print("missing:data")
                return Response({'result':'Invalid request'},status=status.HTTP_400_BAD_REQUEST)
            if "file" not in request.FILES:
                print("missing:file")
                return Response({'Message': 'No file provided'},status=status.HTTP_400_BAD_REQUEST)
            file_obj = request.FILES["file"]
            token = request.data.get("g-recaptcha-response")
            if not token:
                print("missing:captcha")
                return Response({"Message":"Token error"},status=status.HTTP_401_UNAUTHORIZED)
            if not verify_captcha(token):
                print("missing:token")
                return Response({"Message":"Recaptcha failed"},status=status.HTTP_400_BAD_REQUEST)
            file_extension = file_obj.name.split('.')[-1].lower()
            if file_extension not in ['jpg','jpeg','png','gif']:
                return JsonResponse({'Response': 400, 'Message': 'Invalid file format, only jpg,png or gif allowed'})
            review = ReviewPost(title=data, image_source=file_obj, posted=False)
            review.save()
            return JsonResponse({'Response':200})
        except Exception as e:
            traceback.print_exc()
            return Response({'Message': 'Server error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

class LogOut(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request):
        try:
            response = Response({"message":"Logged out!"},status=status.HTTP_200_OK)
            response.delete_cookie(
                'access_token',
                samesite='Strict',
                path='/'
            )
            response.delete_cookie(
                'refresh_token',
                samesite='Strict' or "Lax",
                path='/'
            )
            return response
        except:
            return Response({"message":"Error Happened!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddStar(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
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
                    'star': {
                        'type': 'string',
                        'description': 'Number of deserved star',
                        'default': '1'
                    }
                },
                'required': ['id', 'star']
            }
        },
        responses={200: OpenApiResponse(description='Patch success')}
    )
    def patch(self,request):
        if getattr(request, 'limited', False):
            return Response(
                {"detail": "Too many rate attempts."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        try:
            print("REQUEST DATA:", request.data)
            id = request.data.get('id')
            if not id:
                return Response({"message":"Error happened!"},status=status.HTTP_400_BAD_REQUEST)
            post = ActivePost.objects.get(id=id)
            star = int(request.data.get('star'))
            if not star:
                return Response({"message":"Error happened!"},status=status.HTTP_400_BAD_REQUEST)
            if star == 1:
                post.oneStar += 1
            elif star == 2:
                post.twoStar += 1
            elif star == 3:
                post.threeStar += 1
            elif star == 4:
                post.fourStar += 1
            elif star == 5:
                post.fiveStar += 1
            else:
                return Response({"message":"Error happened!"},status=status.HTTP_400_BAD_REQUEST)
            post.starAvg = ((post.oneStar * 1) + (post.twoStar * 2) + (post.threeStar * 3) + (post.fourStar * 4) + (post.fiveStar * 5)) / (post.oneStar + post.twoStar + post.threeStar + post.fourStar + post.fiveStar)
            post.save()
            return Response({'message':'Successful modification'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Post not found!'},status=status.HTTP_404_NOT_FOUND)

class EdgeToolTokenDelete(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request,slug):
        try:
            device = DeviceHandler.objects.get(id=slug)
            device.delete()
            return Response({'message':'Token deleted succesfully!'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Token could not be deleted!'},status=status.HTTP_404_NOT_FOUND)

class EdgeToolTokenCreate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'name': {
                        'type': 'string',
                        'description': 'PBX device name',
                        'default': 'PBX test'
                    },
                    'ttl': {
                        'type': 'string',
                        'description': 'Title of post',
                        'default': '2026-04-12'
                    }
                },
                'required': ['name']
            }
        },
        responses={200: OpenApiResponse(description='Token created!')}
    )
    def post(self,request):
        try:
            KEYS = dotenv_values()
            with open(KEYS["PUBLIC_KEY"],"rb") as file:
                public_key = file.read()
            deviceName = str(request.data.get('name'))
            device = None
            PAT = encrypt_message(generateRandomString(),public_key_bytes=public_key)
            try:
                ttl_str = request.data.get('ttl')
                ttl = datetime.datetime.strptime(ttl_str, '%Y-%m-%d')
                device = DeviceHandler(deviceName=deviceName,devicePAT=PAT, TTL=ttl)
            except:
                device = DeviceHandler(deviceName=deviceName,devicePAT=PAT)
            device.save()
            return Response({'message':'Token created!',
                             'order_no': device.id},status=status.HTTP_200_OK)
        except:
            return Response({'message':f'Token could not be created!'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EdgeToolTokenGet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,slug):
        try:
            KEYS = dotenv_values()
            with open(KEYS["PRIVATE_KEY"],"rb") as file:
                private_key = file.read()
            try:
                device = DeviceHandler.objects.get(id=slug)
                result = {
                    "name" : device.deviceName,
                    "token" : decrypt_message(device.devicePAT,private_key_bytes=private_key),
                    "ttl": device.TTL
                }
                return Response(result,status=status.HTTP_200_OK)
            except:
                return Response({'message':'Device not found!'},status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'message':'Unexpected server error happened during query'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EdgeToolTokenGetAll(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            KEYS = dotenv_values()
            with open(KEYS["PRIVATE_KEY"],"rb") as file:
                private_key = file.read()
            try:
                results = DeviceHandler.objects.all()
                resultList = []
                for result in results:
                    item = {
                        "id": result.id,
                        "name": result.deviceName,
                        "TTL": result.TTL
                    }
                    resultList.append(item)
                return Response(resultList,status=status.HTTP_200_OK)
            except:
                return Response({'message':'Device not found!'},status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'message':'Unexpected server error happened during query'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def CronAddSocialRaid(request):
    try:
        auth = None
        try:
            auth = request.headers.get("Authorization")
            if not str(auth).startswith("Bearer "):
                return Response({'message':'Authentication failed'},status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({'message':'Authentication failed!'},status=status.HTTP_403_FORBIDDEN)
        
        KEYS = dotenv_values()
        
        private_key_bytes = None
        
        with open(KEYS["PRIVATE_KEY"],"rb") as file:
            private_key_bytes = file.read()
        
        token = auth[7:]
        
        payload = jwt.decode(token,private_key_bytes,["HS256"],options={
            "require": ["ttl","token"]
        })
        tokens = DeviceHandler.objects.all()
        found = False
        decodedToken = decrypt_message(payload["token"],private_key_bytes)
        for token in tokens:
            if token.devicePAT == payload["token"] and decrypt_message(token.devicePAT,private_key_bytes) == decodedToken and token.TTL == payload["ttl"]:
                found = True
                break
        if found == False:
            return Response({'message':'Token is not found!'},status=status.HTTP_404_NOT_FOUND)
        ttl = datetime.datetime.strptime(payload["ttl"],'%Y-%m-%d')
        if datetime.datetime.now().date() > ttl:
            return Response({'message':'Token expired!'},status=status.HTTP_400_BAD_REQUEST)
        try:
            message = str(request.data.get("message"))
            link = str(request.data.get("link"))
            type = str(request.data.get("type"))
            date = datetime.datetime.strptime(request.data.get("date"),'%Y-%m-%d')
            fightSMS = FightClubTextMessages(date=date,message=message,socialPostType=type,socialUrl=link)
            fightSMS.save()
            return Response({'message':'SMS message added!'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Bad or missing requests!'},status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'message':'Unexpected server error happened during social post raid addition'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateFighterSMS(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'description': 'PBX device name',
                        'default': 'PBX test'
                    },
                    'date': {
                        'type': 'string',
                        'description': 'Title of post',
                        'default': '2026-04-12'
                    },
                    'type': {
                        'type': 'string',
                        'description': 'Social post type and source - Facebook, Tiktok X and etc',
                        'default': 'FB'
                    },
                    'link': {
                        'type': 'string',
                        'description': 'Link for the post',
                        'default': 'https://www.facebook.com/share/p/183qXeAYvN/?mibextid=wwXIfr'
                    }
                },
                'required': ['message','date','type','link']
            }
        },
        responses={200: OpenApiResponse(description='Token created!')}
    )
    def post(self, request):
        try:
            message = str(request.data.get("message"))
            link = str(request.data.get("link"))
            type = str(request.data.get("type"))
            date = datetime.datetime.strptime(request.data.get("date"),'%Y-%m-%d')
            fightSMS = FightClubTextMessages(date=date,message=message,socialPostType=type,socialUrl=link)
            fightSMS.save()
            return Response({'message':'SMS message added!'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Bad or missing requests!'},status=status.HTTP_400_BAD_REQUEST)

class DeleteFighterSMS(APIView):
    def delete(self, request,slug):
        try:
            fightSMS = FightClubTextMessages.objects.get(id=slug)
            fightSMS.delete()
            return Response({'message':'SMS message added!'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Bad or missing requests!'},status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def getFighterSMS(request):
    try:
        fighterSMSmessages = FightClubTextMessages.objects.order_by("date")
        partialList = []
        for SMS in fighterSMSmessages:
            elem = {
                "id": SMS.id,
                "message": SMS.message,
                "date": f"{SMS.date.year}-{SMS.date.month}-{SMS.date.day}",
                "linkType": SMS.socialPostType,
                "link": SMS.socialUrl
            }
            partialList.append(elem)
        return Response(partialList,status=status.HTTP_200_OK)
    except:
        return Response({'message':'Error happened!'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddBlogPost(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'title': {
                        'type': 'string',
                        'description': 'PBX device name',
                        'default': 'PBX test'
                    },
                    'post': {
                        'type': 'string',
                        'description': 'Title of post',
                        'default': '2026-04-12'
                    }
                },
                'required': ['title','post']
            }
        },
        responses={200: OpenApiResponse(description='Post created!')}
    )
    def post(self,request):
        try:
            title = str(request.data.get("title"))
            post = str(request.data.get("post"))
            blogPost = BlogPosts(title=title,post=post)
            blogPost.save()
            return Response({'message':'Blogpost created!'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Error happened during the creation of blogposts'},status=status.HTTP_400_BAD_REQUEST)

class DeleteBlogPost(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request,slug):
        try:
            blogpost = BlogPosts.objects.all().get(id=slug)
            blogpost.delete()
            return Response({'message':'Post deleted successfully'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Post not found'},status=status.HTTP_404_NOT_FOUND)

class ModifyBlogPost(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'title': {
                        'type': 'string',
                        'description': 'PBX device name',
                        'default': 'PBX test'
                    },
                    'post': {
                        'type': 'string',
                        'description': 'Title of post',
                        'default': '2026-04-12'
                    }
                },
                'required': ['title','post']
            }
        },
        responses={200: OpenApiResponse(description='Post created!')}
    )
    def patch(self, request, slug):
        try:
            blogpost = BlogPosts.objects.all().get(id=slug)
            blogpost.post = str(request.data.get("post"))
            blogpost.title = str(request.data.get("title"))
            blogpost.date = datetime.date.today()
            blogpost.save()
            return Response({'message':'Post modified successfully'},status=status.HTTP_200_OK)
        except:
            return Response({'message':'Post not found'},status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def getAllBlogPosts(request):
    try:
        blogposts = BlogPosts.objects.order_by("-id")
        partialList = []
        for post in blogposts:
            elem = {
                "id": post.id,
                "title": post.title,
                "post": post.post,
                "date": post.date
            }
            partialList.append(elem)
        return Response(partialList,status=status.HTTP_200_OK)
    except:
        return Response({'message':'Error happened!'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def getBlogPost(request, slug):
    try:
        blogpost = BlogPosts.objects.all().get(id=slug)
        result = {
            "id": blogpost.id,
            "title": blogpost.title,
            "post": blogpost.post,
            "date": blogpost.date
        }
        return Response(result,status=status.HTTP_200_OK)
    except:
        return Response({'message':'Blog post does not exist!'},status=status.HTTP_404_NOT_FOUND)


