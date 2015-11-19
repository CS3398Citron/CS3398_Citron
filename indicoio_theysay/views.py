from django.shortcuts import render

import indicoio
indicoio.config.api_key = 'd58464ed4f71c725f4d0b4ed0a1ac04c'


import json
from sentiments.models import Post
from django.core.serializers import serialize
from django.http import HttpResponse



def indicoioSent(request):
	
	# for key in Post.objects.all():
	# 	data = 
	#allentries = serialize('json', Post.objects.all(), fields = ('statement'))
	#allentries = Post.objects.all()
	#allentries = serialize("json", Post.objects)

	#one_entry = Post.objects.get(pk=2)
	one_entry = serialize('json', Post.objects.all(), fields = ('statement'))

	#data = one_entry
	#one_entry.statement = indicoio.sentiment(one_entry)

	#one_entry.sentiment = (indicoio.sentiment_hq(one_entry.statement))
	#one_entry.save()

	#allentries = Post.objects.all()

	return HttpResponse(one_entry)

# #Changes the 1st statement to new text.
# 	one_entry.statement = 'hello world'
# 	one_entry.save()

# 	one_entry = Post.objects.all()

			


# # single example
# data = (indicoio.sentiment_hq("StephenLand @Land_Stephen" + 
# "Like swimming in a glass of ice water. It brrrrrs so good. (@ Deep Eddy Park - @austintexasgov in Austin, TX) swarmapp.com/c/kd7mvZvGEdm" +
# "at 18:23:32 on 8/29/2015"))



# f.write(json.dumps(data, indent=4))



# # batch example
# # data = (indicoio.sentiment([
# #     "indico is so easy to use!",
# #     "I hate the traffic here in austin"
# # ]))
# # f.write(json.dumps(data, indent=4))

# #Calls named_Entities and stores JSON info in data
# #data = indicoio.named_entities("Just watched someone smoke a crack pipe in between 2 dumpsters in Austin... So there's that")

# #Writes to a txt file with the JSON info
# #f.write(json.dumps(data, indent=4))

# data = indicoio.keywords("StephenLand @Land_Stephen" + 
# "Like swimming in a glass of ice water. It brrrrrs so good. (@ Deep Eddy Park - @austintexasgov in Austin, TX) swarmapp.com/c/kd7mvZvGEdm" +
# "at 18:23:32 on 8/29/2015")
# f.write(json.dumps(data, indent=4))
	