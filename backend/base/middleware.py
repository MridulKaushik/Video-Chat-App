from django.http import HttpResponseNotFound
from django.template import loader

class CustomErrorMiddleware:

    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if response.status_code == 404:
            error_template = loader.get_template('base/Error.html')
            return HttpResponseNotFound(error_template.render())
        
        return response
    