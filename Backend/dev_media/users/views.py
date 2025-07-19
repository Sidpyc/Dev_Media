from django.shortcuts import render, redirect   ,get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import  authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .serializers import UserSerializer, UserSignupForm, UserLoginForm,RegisterSerializer
from .serializers import LoginSerializer 
from .models import UserProfile
from .models import Follow
from .serializers import UserProfileSerializer
from rest_framework import status, permissions





def signup_view(request):
    if request.method == 'POST':
        form = UserSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Signup successful! Welcome, {}".format(user.username))
            return redirect('home')
        else:
            # Log the errors for debugging
            messages.error(request, "Signup failed. Please correct the errors below.")
            print(form.errors)
    else:
        form = UserSignupForm()
    return render(request, 'users/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, "Login successful! Welcome back, {}".format(user.username))
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password. Please try again.")
    else:
        form = UserLoginForm()
    return render(request, 'users/login.html', {'form': form})

@login_required
def home_view(request):
    return render(request, 'users/home.html', {'username': request.user.username})

def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out successfully.")
    return redirect('login')


#Api things
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request,*args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh=RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_serializer.data,
                 
            })
        else:
            return Response({'details': 'Invalid credentials'}, status=401)
 



class UserProfileList(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)


class UserProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)


class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Exclude the logged-in user from the list
        return User.objects.exclude(id=self.request.user.id)



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):

        user_profile = get_object_or_404(UserProfile, user__username=username)
        
        profile_data = {
            "id": user_profile.user.id,
            "username": user_profile.user.username,
            "bio": user_profile.bio,
            "profile_picture": user_profile.profile_picture.url if user_profile.profile_picture else None,
        }
        return Response(profile_data)
    
# views.py

class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        # Prevent user from following themselves
        if request.user.username == username:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user_to_follow = get_object_or_404(User, username=username)

        # Ensure user is not already following the target user
        if Follow.objects.filter(follower=request.user, followed=user_to_follow).exists():
            return Response({"detail": "You are already following this user."}, status=status.HTTP_400_BAD_REQUEST)

        Follow.objects.create(follower=request.user, followed=user_to_follow)

        return Response({"detail": f"You are now following {username}."}, status=status.HTTP_201_CREATED)


class UnfollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        user_to_unfollow = get_object_or_404(User, username=username)

        follow_relation = Follow.objects.filter(follower=request.user, followed=user_to_unfollow).first()
        if not follow_relation:
            return Response({"detail": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)

        follow_relation.delete()

        return Response({"detail": f"You have unfollowed {username}."}, status=status.HTTP_200_OK)



class FollowingListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(follower=user)
        following_usernames = [followed.followed.username for followed in following]
        following_count = following.count()  # Get the count of following users
        return Response({"following": following_usernames, "count": following_count})

class FollowersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        followers = Follow.objects.filter(followed=user)
        followers_usernames = [follower.follower.username for follower in followers]
        followers_count = followers.count()  # Get the count of followers
        return Response({"followers": followers_usernames, "count": followers_count}, status=status.HTTP_200_OK)