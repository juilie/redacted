---
title: Works
css: "/static/css/works.css"
layout: default
---

<h1>「Works」</h1>
<div class="works-container">
    {%- comment -%}
      Order comes from _data/works_order.yml, editable by drag-and-drop in the
      CMS under "Works Order". Works missing from that list (e.g. just created
      and not yet dragged in) fall to the end rather than disappearing.
    {%- endcomment -%}
    {% assign order_slugs = "" | split: "" %}
    {% if site.data.works_order and site.data.works_order.order %}
        {% assign order_slugs = site.data.works_order.order | map: 'work' %}
    {% endif %}
    {% assign works = "" | split: "" %}
    {% for slug in order_slugs %}
        {% assign matched = site.works | where: 'slug', slug %}
        {% assign works = works | concat: matched %}
    {% endfor %}
    {% for work in site.works %}
        {% unless order_slugs contains work.slug %}
            {% assign unlisted = site.works | where: 'slug', work.slug %}
            {% assign works = works | concat: unlisted %}
        {% endunless %}
    {% endfor %}
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
