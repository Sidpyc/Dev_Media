
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', include('posts.urls')),
    path('', include('users.urls')),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
