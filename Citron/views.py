from django.views.generic.base import TemplateView

class HomePageView(TemplateView):

    template_name = "base.html"

    def get_context_data(self, **kwargs):
        return super(HomePageView, self).get_context_data(**kwargs)