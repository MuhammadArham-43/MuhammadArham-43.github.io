---
layout: archive
title: "Projects"
permalink: /projects/
classes: wide # Use 'wide' class to maximize screen space
---

<div class="entries-grid">

{% for project in site.data.projects.projects %}

<article class="archive__item archive__item--2-col" itemscope itemtype="https://schema.org/CreativeWork">
  
  <div class="archive__item-teaser-small">
    <a href="{{ project.url }}" rel="permalink">
      <img src="{{ project.image_path | relative_url }}" alt="{{ project.title | escape }}" 
           style="border-radius: 4px; object-fit: cover; width: 100%; height: 100%;">
    </a>
  </div>

  <div class="archive__item-body" style="padding-top: 0.5rem; padding-bottom: 1rem;">
    <h2 class="archive__item-title" itemprop="headline" style="margin-top: 0; margin-bottom: 0.5rem;">
      <a href="{{ project.url }}" rel="permalink">{{ project.title }}</a>
    </h2>
    <div class="archive__item-excerpt" itemprop="description">
      <p>{{ project.excerpt }}</p>
    </div>
  </div>

</article>

{% endfor %}

</div>