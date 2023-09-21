from django.urls import path
from . import views 

app_name = 'base'

urlpatterns = [
    path('', views.Index.as_view(), name='index'),
    path('room/<str:channelName>', views.Room.as_view(), name='room'),
    path('getToken/', views.Token.as_view(), name='token'),
    path('createUser/', views.CreateUser.as_view(), name='postUser'),
    path('getMember/', views.GetMember.as_view(), name='get_member'),
    path('delMember/', views.DeleteUser.as_view(), name='delete_member'),
]
