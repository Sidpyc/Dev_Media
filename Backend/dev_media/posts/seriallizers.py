from rest_framework import serializers
from django.contrib.auth.models import User
from . models import Post 


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',]


# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'image', 'created_at', 'like_count', 'is_liked' ]

    def get_like_count(self, obj):
        return obj.like_count()

    def get_is_liked(self, obj):

        user = self.context.get('request').user
        if user.is_authenticated:
            return user in obj.likes.all()
        return False
    
