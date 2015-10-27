from django.views.generic.base import TemplateView
from django.http import HttpResponse
from django.views.generic import View

class HomePageView(TemplateView):
	# def get(self, request, *args, **kwargs):
		# return HttpResponse('Hello, World!')
    template_name = "base.html"

    def get_context_data(self, **kwargs):
        return super(HomePageView, self).get_context_data(**kwargs)
