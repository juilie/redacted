---
title: Upcoming Performances
css: "/static/css/works.css"
layout: default
---

<h1><span class="bracket-left">「</span>Upcoming Performances<span class="bracket-right">」</span></h1>
<div class="performances-list">
    {% assign performances = site.performances | sort: 'date' %}
    {% for performance in performances %}
    {% assign description_text = performance.description %}
    {% assign image_markdown = '' %}
    {% if performance.description contains '![' %}
        {% assign parts = performance.description | split: '![' %}
        {% if parts.size > 1 %}
            {% assign image_part = parts[1] | split: ')' | first %}
            {% assign image_markdown = '![' | append: image_part | append: ')' %}
            {% assign description_text = performance.description | remove: image_markdown | strip %}
        {% endif %}
    {% endif %}
    <div class="performance-card">
        <div class="performance-left">
            {% if performance.date %}
            <div class="performance-date-strong">{{ performance.date | date: "%B %d" }} <span class="performance-time">{{ performance.date | date: "%l:%M %p" }}</span>
            </div>
            {% endif %}
            <div class="performance-title">{{ performance.title }}</div>
            {% if description_text != '' %}
            <div class="performance-venue">{{ description_text | markdownify }}</div>
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
        {% if image_markdown != '' %}
        <div class="performance-image">
            {{ image_markdown | markdownify }}
        </div>
        {% endif %}
    </div>
    {% endfor %}
</div>
