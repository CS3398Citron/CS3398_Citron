from django.shortcuts import render

from django.contrib.auth import authenticate
from django.shortcuts import redirect
from django.conf import settings

import json
from sentiments.models import Post
from django.core.serializers import serialize
from django.http import HttpResponse

def postsJsonObject(request):
	if not request.user.is_authenticated():
		return redirect('/admin/login')
	else:
		postsJson = serialize('json', Post.objects.all(), fields=('statement'))
		postsJson = [d[0] for d in postsJson]
		return HttpResponse(postsJson)