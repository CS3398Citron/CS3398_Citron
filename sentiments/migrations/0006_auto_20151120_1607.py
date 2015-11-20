# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sentiments', '0005_auto_20151116_2353'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='tags',
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
    ]
