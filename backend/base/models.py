from django.db import models

# Create your models here.
class RoomMember(models.Model):
    name = models.CharField(max_length=34)
    uid = models.CharField(max_length=233, unique=True)
    RoomName = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.RoomName} --> {self.name}"  
      
