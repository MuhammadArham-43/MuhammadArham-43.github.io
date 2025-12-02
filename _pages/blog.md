title: "Blog"
permalink: /blog/
layout: archive
author_profile: true
---

<div class="blog-external">
  {% for post in site.posts %}
  <article class="blog-card">
    <div class="blog-card__meta">{{ post.date | date: "%b %d, %Y" }}</div>
    <h2 class="blog-card__title">
      <a href="{{ post.canonical_url | default: post.url | relative_url }}" target="_blank" rel="noopener">
        {{ post.title }}
      </a>
    </h2>
    {% if post.excerpt %}
    <p class="blog-card__excerpt">
      {{ post.excerpt | strip_html | truncate: 180 }}
    </p>
    {% endif %}
    <a class="blog-card__cta" href="{{ post.canonical_url | default: post.url | relative_url }}" target="_blank" rel="noopener">
      Read on Medium →
    </a>
  </article>
  {% endfor %}
</div>
