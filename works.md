---
title: Works
css: "/static/css/works.css"
layout: default
---

<h1>「Works」</h1>
<div class="works-container">
    {% assign works = site.works | sort: 'title' %}
    {% for work in works %}
    <a href="{{ work.url }}" class="work-item" style="background-image: url('{{ work.featured_image | relative_url }}'); background-size: cover; background-position: center;">
        <h2>{{ work.title }}</h2>
    </a>
    {% endfor %}
</div>
