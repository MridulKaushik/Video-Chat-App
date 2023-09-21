from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse, Http404
from django.views.generic import TemplateView, DetailView
from django.views import View
import random as rand
import time
import json
from .models import RoomMember
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

class Index(TemplateView):
    template_name = 'base/index.html'

class Room(TemplateView):
    template_name = 'base/room.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['channelName'] = kwargs['channelName']
        return context

    # use this method to print the channelName and Username in html file
    # def render_to_response(self, context: dict[str, Any], **response_kwargs: Any):
    #     return render(self.request, self.template_name, context, **response_kwargs)
        
class Token(TemplateView):

    def get(self, request, *args, **kwargs):
        return self.get_token(request)
    
    def get_token(self, request):
        appId = "a39bdeba8e97439586641d7af2c66192"
        appCertificate = "0c6917030a85421c89d7a87a9bdb13d2"
        channelName = request.GET.get('channelName')
        uid = rand.randint(0, 231)
        role = 1
        expirationTime = 3600 * 24
        currentTime = time.time()
        privilegeExpiredTs = currentTime + expirationTime
        token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

        return JsonResponse({
            "token" : token,
            "uid" : uid  
            }, safe = False)

@method_decorator(csrf_exempt, name="dispatch")
class CreateUser(View):
    model = RoomMember
    
    # creating or getting the info about the user 
    def post(self, request, *args, **kwargs):
        #request.body gives you a raw HTTP request body as a bytestring. 
        # You can convert into a dictionary using json.loads()
        data = json.loads(request.body)
        print(data)
        member, created = self.model.objects.get_or_create(
            name = data['name'],
            uid = data['uid'],
            RoomName = data['roomName']
        )

        return JsonResponse({'name':data['name']}, safe=False)
    



class GetMember(DetailView):
    model = RoomMember

    def get(self, request, *args,**kwargs):
        uid = request.GET.get('uid')
        room = request.GET.get('room')
        
        print(f"{uid}, {room}")

        member = self.model.objects.get(
            uid = uid,
            RoomName = room,
        )        
        print("Joined - " , member.name)
        return JsonResponse({'name':member.name}, safe=False)
        

class ErrorPage(TemplateView):
    template_name = "base/error.html"


@method_decorator(csrf_exempt, name="dispatch")
class DeleteUser(View):
    model = RoomMember
    
    # deleting the user info
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        member = self.model.objects.get(
            name = data['name'],
            uid = data['uid'],
            RoomName = data['roomName']
        )
        member.delete()
        return JsonResponse("Member was Deleted", safe=True)