from django.views.generic.base import TemplateView

class HomePageView(TemplateView):

    template_name = "base.html"

    def get_context_data(self, **kwargs):
<<<<<<< HEAD
        return super(HomePageView, self).get_context_data(**kwargs)

class Aggregated_Map(TemplateView):

    template_name = "Aggregated_Map.html"

    def get_context_data(self, **kwargs):
        return super(Aggregated_Map, self).get_context_data(**kwargs)

        
class Sentiment_Data(TemplateView):

    template_name = "Sentiment_Data.html"

    def get_context_data(self, **kwargs):
        return super(Sentiment_Data, self).get_context_data(**kwargs)
=======
        return super(HomePageView, self).get_context_data(**kwargs)
>>>>>>> 3bb92ccd4a810cc9967a5fafff18c2033c8e29d5
