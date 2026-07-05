"""
URL configuration for rposting_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from rposting import views
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.shortcuts import redirect
from . import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

schema_view = get_schema_view(
    openapi.Info(title="Test API", default_version='v1'),
    public=True,
)



urlpatterns = [
    path('', lambda request: redirect('swagger-ui')),
    path('api/token/', views.AdminTokenGenerator.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', views.AdminRefreshToken.as_view(), name='token_refresh'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', views.MySwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('review-posts/', views.getReviewPosts.as_view(), name='get-review-posts'),
    path('review-posts/<slug:slug>/', views.getReviewPost.as_view(), name='get-review-post'),
    path('posts/<slug:slug>/', views.getPost, name='get-post'),
    path('posts/', views.getAllPosts, name='get-all-posts'),
    path('review-post/', views.InsertReview.as_view(), name='insert-review'),
    path('delete-review/<slug:slug>/', views.deleteReview.as_view(), name='delete-review'),
    path('delete-post/<slug:slug>/', views.deletePost.as_view(), name='delete-post'),
    path('post/', views.InsertPost.as_view(), name='insert-post'),
    path('admin/', admin.site.urls),
    path('modify-title/',views.modifyTitle.as_view(),name="modify-title"),
    path('get-recommended/',views.getRecommended,name="modify-title"),
    path('logout/',views.LogOut.as_view(),name="LogOut"),
    path('addstar/',views.AddStar.as_view(),name="AddStar"),
    path('devicetoken/<slug:slug>/',views.EdgeToolTokenGet.as_view(),name="get-device-token"),
    path('devicetoken/',views.EdgeToolTokenGetAll.as_view(),name="get-all-device-token"),
    path('devicetoken/delete/<slug:slug>/',views.EdgeToolTokenDelete.as_view(),name="delete-device-token"),
    path('devicetoken/add',views.EdgeToolTokenCreate.as_view(),name="create-device-token"),
    path('cron/addsms/',views.CronAddSocialRaid,name="cronjob-add-sms"),
    path('fighter/sms/add/',views.CreateFighterSMS.as_view(),name="add-sms"),
    path('fighter/sms/delete/<slug:slug>/',views.DeleteFighterSMS.as_view(),name="delete-sms"),
    path('fighter/sms/',views.getFighterSMS,name="get-all-sms"),
    path('blogposts/',views.getAllBlogPosts,name="get-all-blog-posts"),
    path('blogposts/add/',views.AddBlogPost.as_view(),name="add-blog-post"),
    path('blogposts/<slug:slug>',views.getBlogPost,name="get-blog-post"),
    path('blogposts/delete/<slug:slug>',views.DeleteBlogPost.as_view(),name="delete-blog-post"),
    path('blogposts/modify/<slug:slug>',views.ModifyBlogPost.as_view(),name="modify-blog-post"),
    path('sender/create/',views.CreateSMSSender.as_view(),name="create-sender"),
    path('sender/',views.getSMSSenders.as_view(),name="get-senders"),
    path('sender/delete/<slug:slug>/',views.deleteSMSSender.as_view(), name="delete-sender"),
    path('fighter/sms/modify/<slug:slug>/',views.ModifyFighterSMS.as_view(),name="modify-sms")
]

if settings.DEBUG:  # Only for development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
