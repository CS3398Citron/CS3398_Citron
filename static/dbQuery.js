var posts = [
{% for posts in all_posts %}
    {% if not forloop.first %},{% endif %}
    {
        statement: "{{ Post.statement }}",
    }
{% endfor %}
]