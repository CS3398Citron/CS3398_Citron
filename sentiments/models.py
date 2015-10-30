from django.db import models

class Post(models.Model):
    timestamp = models.CharField(max_length=50)
    poster = models.CharField(max_length=100)
    statement = models.TextField()

    def __unicode__(self):
        return self.poster
