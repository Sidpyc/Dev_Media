from django.urls import path    
from .import views
from rest_framework_simplejwt.views import (
 TokenObtainPairView,
 TokenRefreshView, TokenVerifyView,
)

from rest_framework_simplejwt.views import TokenObtainPairView;




urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.home_view, name='home'),

    path('api/signup/', views.RegisterView.as_view(), name='signup'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
# urls.py
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('newusers/<str:username>/', views.UserProfileView.as_view(), name='posts-by-user'),
    path('profiles/', views.UserProfileList.as_view(), name='profile-list'),
    path('profiles/update/', views.UserProfileDetail.as_view(), name='profile-detail'),
    path('login-session/', views.LoginView.as_view(), name='login-session'),

    #followers urls
    path('follow/<str:username>/', views.FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<str:username>/', views.UnfollowUserView.as_view(), name='unfollow-user'),
    path('following/<str:username>/', views.FollowingListView.as_view(), name='following-list'),
    path('followers/<str:username>/', views.FollowersListView.as_view(), name='followers-list'),
]