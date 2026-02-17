---
title: Press
layout: default
css: "/static/css/press.css"
---

<h1><span class="bracket-left">「</span>Press<span class="bracket-right">」</span></h1>
<div class="press-list">
  {% assign articles = site.press | sort: 'date' | reverse %}
  {% for article in articles %}
  <article class="press-article">
    <div class="press-article-content">
      <h2 class="press-article-title">
        <a href="{{ article.link }}" target="_blank" rel="noopener noreferrer">{{ article.title }}</a>
      </h2>
      <div class="press-article-meta">
        {% if article.publication %}
        <span class="press-publication">{{ article.publication }}</span>
        {% endif %}
      </div>
      {% if article.image_embed and article.image_embed != "" %}
      <div class="press-article-media">
        {% if article.image_embed contains '<iframe' or article.image_embed contains '<embed' %}
          {{ article.image_embed }}
        {% else %}
          <img src="{{ article.image_embed | relative_url }}" alt="{{ article.title | escape }}" class="press-article-image">
        {% endif %}
      </div>
      {% elsif article.image and article.image != "" %}
      <div class="press-article-media">
        <a href="{{ article.link }}" target="_blank" rel="noopener noreferrer">
          <img src="{{ article.image | relative_url }}" alt="{{ article.title | escape }}" class="press-article-image">
        </a>
      </div>
      {% endif %}
    </div>
  </article>
  {% endfor %}
</div>
