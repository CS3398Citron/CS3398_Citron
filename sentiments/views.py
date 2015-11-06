from django.shortcuts import render

import json
from sentiments.models import Post
from django.core.serializers import serialize
from django.http import HttpResponse
def postsJsonObject(request):
	postsJson = serialize('json', Post.objects.all())
	postsJson = postsJson.strip("[]")
	return HttpResponse(postsJson)