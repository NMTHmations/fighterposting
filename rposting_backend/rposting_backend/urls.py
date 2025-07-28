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

schema_view = get_schema_view(
    openapi.Info(title="Test API", default_version='v1'),
    public=True,
)



urlpatterns = [
    path('', lambda request: redirect('swagger-ui')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('review-posts/', views.getReviewPosts, name='get-review-posts'),
    path('review-posts/<slug:slug>/', views.getReviewPost, name='get-review-post'),
    path('posts/<slug:slug>/', views.getPost, name='get-post'),
    path('posts/', views.getAllPosts, name='get-all-posts'),
    path('review-post/', views.InsertReview.as_view(), name='insert-review'),
    path('delete-review/<slug:slug>/', views.deleteReview, name='delete-review'),
    path('delete-post/<slug:slug>/', views.deletePost, name='delete-post'),
    path('post/', views.InsertPost.as_view(), name='insert-post'),
    path('admin/', admin.site.urls)
]

if settings.DEBUG:  # Only for development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
