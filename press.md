---
title: Press
layout: default
css: "/static/css/press.css"
---

<h1>Press Gallery</h1>
<div class="press-grid">
  {% assign photos = site.press | sort: 'title' %}
  {% for item in photos %}
  <figure class="press-card">
    {% if item.image %}
    <img src="{{ item.image | relative_url }}" alt="{{ item.title | escape }}">
    {% endif %}
  </figure>
  {% endfor %}
</div>
