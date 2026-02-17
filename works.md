---
title: Works
css: "/static/css/works.css"
layout: default
---

<h1>「Works」</h1>
<div class="works-container">
    {% assign works = site.works | sort: 'title' %}
    {% for work in works %}
    {% if work.featured_image %}
        {% assign img_path = work.featured_image %}
        {% if img_path contains 'http' %}
            {% assign img_url = img_path %}
        {% else %}
            {% if img_path contains '/' %}
                {% assign img_url = img_path | relative_url %}
            {% else %}
                {% assign img_url = img_path | prepend: '/' | relative_url %}
            {% endif %}
        {% endif %}
    {% endif %}
    <a href="{{ work.url }}" class="work-item"{% if work.featured_image %} data-bg-image="{{ img_url }}"{% endif %}>
        <h2>{{ work.title }}</h2>
    </a>
    {% endfor %}
</div>

<script>
(function() {
    const workItems = document.querySelectorAll('.work-item[data-bg-image]');
    workItems.forEach(function(item) {
        const bgImage = item.getAttribute('data-bg-image');
        if (bgImage) {
            item.style.backgroundImage = 'url(' + bgImage + ')';
            item.style.backgroundSize = 'cover';
            item.style.backgroundPosition = 'center';
        }
    });
})();
</script>
