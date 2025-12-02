require 'rss'
require 'open-uri'
require 'fileutils'

# Configuration
MEDIUM_FEED_URL    = 'https://medium.com/feed/@arhamm40182'.freeze
KDNUGGETS_FEED_URL = 'https://feeds.feedburner.com/kdnuggets-data-mining-analytics'.freeze
CIRCLECI_FEED_URL  = 'https://circleci.com/blog/feed/'.freeze

AUTHOR_NAME = 'Muhammad Arham'.freeze

POSTS_DIR = '_posts'.freeze
MAX_POSTS = (ENV['MAX_POSTS'] || '100').to_i

FileUtils.mkdir_p(POSTS_DIR)

def slugify(title)
  title.downcase
       .strip
       .gsub(' ', '-')
       .gsub(/[^\w-]/, '')
end

def write_post(item, source)
  title    = item.title.to_s.strip
  link     = item.link.to_s.strip
  pub_date = item.pubDate || item.dc_date
  content  = (item.respond_to?(:content_encoded) && item.content_encoded) || item.description || ''

  return if title.empty? || pub_date.nil?

  date_prefix = pub_date.strftime('%Y-%m-%d')
  slug        = slugify(title)
  filename    = File.join(POSTS_DIR, "#{date_prefix}-#{slug}.md")

  # Skip if we already created this post
  return if File.exist?(filename)

  front_matter = <<~YAML
    ---
    layout: post
    title: "#{title.gsub('"', '\"')}"
    date: #{pub_date.utc.strftime('%Y-%m-%d %H:%M:%S %z')}
    canonical_url: #{link}
    categories: [#{source}]
    ---

  YAML

  File.open(filename, 'w') do |file|
    file.write(front_matter)
    file.write(content)
  end
end
def author_matches?(item)
  possible_authors = []
  possible_authors << item.author if item.respond_to?(:author)
  possible_authors << item.dc_creator if item.respond_to?(:dc_creator)
  possible_authors.compact!
  return false if possible_authors.empty?

  possible_authors.any? { |a| a.to_s.downcase.include?(AUTHOR_NAME.downcase) }
end

def process_feed(url, source:, filter_by_author: false)
  URI.open(url) do |rss|
    feed = RSS::Parser.parse(rss, false)
    feed.items.first(MAX_POSTS).each do |item|
      next if filter_by_author && !author_matches?(item)

      write_post(item, source)
    end
  end
end

# Medium: author-specific feed, no extra filtering needed
process_feed(MEDIUM_FEED_URL, source: 'medium', filter_by_author: false)

# KDnuggets: use general feed and filter by author name
process_feed(KDNUGGETS_FEED_URL, source: 'kdnuggets', filter_by_author: true)

# CircleCI: blog feed, filter by author name
process_feed(CIRCLECI_FEED_URL, source: 'circleci', filter_by_author: true)

