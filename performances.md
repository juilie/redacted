---
title: Upcoming Performances
css: "/static/css/works.css"
layout: default
---

<h1>「Upcoming Performances」</h1>
<div class="performances-list">
    {% assign performances = site.performances | sort: 'date' %}
    {% for performance in performances %}
    <div class="performance-card">
        <div class="performance-left">
            {% if performance.date %}
            <div class="performance-date-strong">{{ performance.date | date: "%B %d @ %l:%M %p" }}</div>
            {% endif %}
            <div class="performance-title">{{ performance.title }}</div>
            {% if performance.description %}
            <div class="performance-venue">{{ performance.description }}</div>
            {% endif %}
        </div>
        <div class="performance-right">
            {% if performance.location %}
            <div class="performance-location-strong">{{ performance.location }}</div>
            {% endif %}
            {% if performance.link %}
            <a href="{{ performance.link | default: performance.url }}" class="performance-button" target="_blank" rel="noopener noreferrer">More Info</a>
            {% endif %}
        </div>
    </div>
    {% endfor %}
</div>
