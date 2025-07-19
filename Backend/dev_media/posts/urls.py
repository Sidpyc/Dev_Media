from django.urls import path
from . import views


urlpatterns = [

    path('posts/', views.AddViewPost.as_view(), name='post-list-create'),
    path('myposts/', views.ListViewMyPost.as_view(), name='my-posts'),
    path('myposts/deletepost/<int:pk>/', views.DeleteViewPost.as_view(), name='delete-my-post'),
    path('profile/<str:username>/', views.UserPostsView.as_view(), name='posts-by-user'),
    path('post/<int:post_id>/like/', views.LikePostView.as_view(), name='like-post'),
   

]
 