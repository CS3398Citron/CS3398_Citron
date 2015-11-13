from django.db import models

class Tag(models.Model):
    tagword = models.CharField(max_length=50, null=True, blank=True)

    def __unicode__(self):
        return self.tagword

    class Meta:
        ordering = ('tagword',)

class Post(models.Model):
    POSITIVE = 'POS'
    NEGATIVE = 'NEG'
    SENTM_CHOICES = (
            (POSITIVE, 'Positive'),
            (NEGATIVE, 'Negative'),
    )

    timestamp = models.CharField(max_length=50)
    poster = models.CharField(max_length=100)
    statement = models.TextField()
    tags = models.ManyToManyField(Tag)
    sentiment = models.CharField(max_length=3, choices=SENTM_CHOICES, null=True, blank=True)
    value = models.DecimalField(max_digits=19, decimal_places=10, null=True, blank=True)


    def __unicode__(self):
        return self.statement
