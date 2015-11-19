from django.shortcuts import render

import indicoio
indicoio.config.api_key = 'd58464ed4f71c725f4d0b4ed0a1ac04c'


import json
from sentiments.models import Post

from django.core.serializers import serialize
from django.http import HttpResponse



def indicoioSent(request):
	allentries = Post.objects.all()
	counter = 1
	while counter <= 4:
		one_entry = Post.objects.get(pk=counter)
		newString = one_entry.statement

		one_entry.sentiment = indicoio.sentiment_hq(newString)
		#Uncomment this to add POS / NEG to sentiment field rather than percent numbers
		# if (one_entry.sentiment > .50):
		# 	one_entry.sentiment = "POS"
		# else:
		# 	one_entry.sentiment = "NEG"
		one_entry.save()
		counter += 1

	allentries = serialize('json', Post.objects.all())
	
	return HttpResponse(allentries)

	
	