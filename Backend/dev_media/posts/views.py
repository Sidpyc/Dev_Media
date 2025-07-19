
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from .models import Post
from .seriallizers import PostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import  ListCreateAPIView, DestroyAPIView
from rest_framework.views import APIView  
from users.models import UserProfile
from django.shortcuts import get_object_or_404




class AddViewPost(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        # Automatically set the author to the currently logged-in user
        serializer.save(author=self.request.user)

class ListViewMyPost(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        # Return posts authored by the currently logged-in user
        return Post.objects.filter(author=self.request.user)


class UserPostsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        username = self.kwargs.get("username")  
        user = get_object_or_404(UserProfile, username=username)  
        return Post.objects.filter(author=user).order_by("-created_at")  
        
class DeleteViewPost(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()  # Queryset to target the Post model
    lookup_field = 'pk'  # Use 'pk' in the URL to identify the post to delete

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            return Response(
                {'detail': 'You do not have permission to delete this post.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()  
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
     
        post = get_object_or_404(Post, id=post_id)

        if request.user in post.likes.all():
            post.likes.remove(request.user)  # Unlike
            return Response({'message': 'Post unliked'}, status=status.HTTP_200_OK)
        else:
            post.likes.add(request.user)  # Like
            return Response({'message': 'Post liked'}, status=status.HTTP_200_OK)


