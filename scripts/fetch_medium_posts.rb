require 'rss'
require 'open-uri'
require 'fileutils'

# Configuration
MEDIUM_FEED_URL = 'https://medium.com/feed/@arhamm40182'.freeze
POSTS_DIR       = '_posts'.freeze
MAX_POSTS       = (ENV['MAX_POSTS'] || '100').to_i

FileUtils.mkdir_p(POSTS_DIR)

def slugify(title)
  title.downcase
       .strip
       .gsub(' ', '-')
       .gsub(/[^\w-]/, '')
end

def write_post(item)
  title    = item.title.to_s.strip
  link     = item.link.to_s.strip
  pub_date = item.pubDate || item.dc_date
  content  = (item.respond_to?(:content_encoded) && item.content_encoded) || item.description || ''

  return if title.empty? || pub_date.nil?

  date_prefix = pub_date.strftime('%Y-%m-%d')
  slug        = slugify(title)
  filename    = File.join(POSTS_DIR, "#{date_prefix}-#{slug}.md")

  front_matter = <<~YAML
    ---
    layout: post
    title: "#{title.gsub('"', '\"')}"
    date: #{pub_date.utc.strftime('%Y-%m-%d %H:%M:%S %z')}
    canonical_url: #{link}
    link: #{link}
    categories: [medium]
    ---

  YAML

  File.open(filename, 'w') do |file|
    file.write(front_matter)
    file.write(content)
  end
end

URI.open(MEDIUM_FEED_URL) do |rss|
  feed = RSS::Parser.parse(rss, false)
  feed.items.first(MAX_POSTS).each do |item|
    write_post(item)
  end
end

