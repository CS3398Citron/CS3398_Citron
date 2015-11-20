from django.shortcuts import render

import indicoio
indicoio.config.api_key = 'd58464ed4f71c725f4d0b4ed0a1ac04c'


import json
from sentiments.models import Post

from django.core.serializers import serialize
from django.http import HttpResponse



def indicoioSent(request):
	allentries = Post.objects.all()

	one_entry = Post.objects.get(pk=1)
	# one_entry.statement = "Someone please fix the traffic here in Austin"
	# one_entry.save()
	counter = 1

	# parseTags = ""

	# one_entry.tags = indicoio.keywords(one_entry.statement)
	# for key in one_entry.tags:
	# 	parseTags+= key+", "
	# one_entry.tags = parseTags
	
	# one_entry.save()

	for one_entry in allentries:
	# 	#i = Post.objects.get(pk=counter)

	# 	one_entry.value = indicoio.sentiment_hq(one_entry.statement)

	# 	#add POS / NEG to sentiment field rather than percent numbers
	# 	if (one_entry.value > .7):
	# 		one_entry.sentiment = "POS"
	# 	elif(one_entry.value < .3):
	# 		one_entry.sentiment = "NEG"
	# 	else:
	# 		one_entry.sentiment = "NEU"

		parseTags = ""

		one_entry.tags = indicoio.keywords(one_entry.statement)
		for key in one_entry.tags:
			parseTags+= key+", "
		one_entry.tags = parseTags

		one_entry.save()
	# 	counter += 1

	allentries = serialize('json', Post.objects.all())
	
	return HttpResponse(allentries)

	
	