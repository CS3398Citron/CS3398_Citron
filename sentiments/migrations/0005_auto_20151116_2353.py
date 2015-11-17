# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sentiments', '0004_auto_20151030_2038'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tagword', models.CharField(max_length=50, null=True, blank=True)),
            ],
            options={
                'ordering': ('tagword',),
            },
        ),
        migrations.AddField(
            model_name='post',
            name='sentiment',
            field=models.CharField(blank=True, max_length=3, null=True, choices=[(b'POS', b'Positive'), (b'NEG', b'Negative')]),
        ),
        migrations.AddField(
            model_name='post',
            name='value',
            field=models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True),
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(to='sentiments.Tag'),
        ),
    ]
