from django.db import models
from django.contrib.auth.models import User
# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    @property
    def following_count(self):
        return self.following.count()
    @property
    def followers_count(self):
        return self.followers.count()
    def __str__(self):
        return f"{self.user.username}'s profile"



class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    followed = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"
    class Meta:
        unique_together = ('follower', 'followed')