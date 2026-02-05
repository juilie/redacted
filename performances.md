---
title: Upcoming Performances
css: "/static/css/works.css"
layout: default
---

<h1>Upcoming Performances</h1>
<div class="works-container">
    {% assign performances = site.performances | sort: 'date' %}
    {% for performance in performances %}
    <a href="{{ performance.link | default: performance.url }}" class="work-item" {% if performance.link %}target="_blank" rel="noopener noreferrer"{% endif %}>
        <h2>{{ performance.title }}</h2>
        {% if performance.date %}
        <p class="performance-date">{{ performance.date | date: "%B %d, %Y at %I:%M %p" }}</p>
        {% endif %}
        {% if performance.location %}
        <p class="performance-location">{{ performance.location }}</p>
        {% endif %}
        {% if performance.description %}
        <p>{{ performance.description }}</p>
        {% endif %}
    </a>
    {% endfor %}
</div>
