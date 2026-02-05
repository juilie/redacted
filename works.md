---
title: Works
css: "/static/css/works.css"
layout: default
---

<h1>「Works」</h1>
<div class="works-container">
    {% assign works = site.works | sort: 'title' %}
    {% for work in works %}
    <a href="{{ work.link | default: work.url }}" class="work-item" {% if work.link %}target="_blank" rel="noopener noreferrer"{% endif %}>
        <h2>{{ work.title }}</h2>
        {% if work.description %}
        <p>{{ work.description }}</p>
        {% endif %}
    </a>
    {% endfor %}
</div>
