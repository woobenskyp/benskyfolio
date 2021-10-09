from django.urls import path, include
from pong.views import *

urlpatterns = [
    path("", pong, name="pong"),
]