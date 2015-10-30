from django.contrib import admin
from import_export import fields, resources
from import_export.admin import ImportExportModelAdmin
from .models import Post

class PostResource(resources.ModelResource):
    timestamp = fields.Field(attribute='timestamp', column_name='Timestamp')
    poster = fields.Field(attribute='poster', column_name='From')
    statement = fields.Field(attribute='statement', column_name='Text')

    def get_instance(self, instance_loader, row):
        # Returning False prevents us from looking in the
        # database for rows that already exist
        return False

    class Meta:
        model = Post
        fields = ('timestamp', 'poster', 'statement')


class PostAdmin(ImportExportModelAdmin):
    resource_class = PostResource
    pass

admin.site.register(Post, PostAdmin)
