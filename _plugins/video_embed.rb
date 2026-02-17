module Jekyll
  module VideoEmbed
    def video_embed(input)
      return input unless input.is_a?(String)
      return input if input.strip.empty?
      
      # If it's already an iframe embed code, return it wrapped
      if input.include?('<iframe')
        return %(<div class="video-embed">#{input}</div>)
      end
      
      # YouTube detection
      youtube_id = extract_youtube_id(input)
      if youtube_id
        return %(<div class="video-embed"><iframe src="https://www.youtube.com/embed/#{youtube_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>)
      end
      
      # Vimeo detection
      vimeo_id = extract_vimeo_id(input)
      if vimeo_id
        return %(<div class="video-embed"><iframe src="https://player.vimeo.com/video/#{vimeo_id}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>)
      end
      
      # If no match, return original input
      input
    end
    
    def video_embed_from_markdown(text)
      return text unless text.is_a?(String)
      
      # Convert YouTube links in markdown to embeds
      # Handle URLs with query parameters (like &t=47s)
      text = text.gsub(/\[([^\]]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)[^\)]*)\)/) do |match|
        video_id = $3
        %(<div class="video-embed"><iframe src="https://www.youtube.com/embed/#{video_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>)
      end
      
      # Convert Vimeo links in markdown to embeds, but skip if password-protected
      # Match Vimeo link and capture any text that follows on the same line
      text = text.gsub(/\[([^\]]+)\]\((https?:\/\/(?:www\.)?vimeo\.com\/(\d+))\)\s*([^\n\[\<]{0,200})/m) do |full_match|
        link_text = $1
        video_url = $2
        video_id = $3
        text_after = ($4 || '').strip
        
        # Check if password is mentioned in the text after the link
        if text_after.match?(/password/i)
          # Keep as link if password-protected, preserve the text after
          %([#{link_text}](#{video_url})#{text_after.empty? ? '' : ' ' + text_after})
        else
          # Convert to embed if no password, preserve the text after
          embed_html = %(<div class="video-embed"><iframe src="https://player.vimeo.com/video/#{video_id}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>)
          text_after.empty? ? embed_html : embed_html + ' ' + text_after
        end
      end
      
      text
    end
    
    private
    
    def extract_youtube_id(url)
      # Standard YouTube URLs: youtube.com/watch?v=VIDEO_ID
      if match = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
        return match[1]
      end
      
      # Short YouTube URLs: youtu.be/VIDEO_ID
      if match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
        return match[1]
      end
      
      # Embed URLs: youtube.com/embed/VIDEO_ID
      if match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
        return match[1]
      end
      
      # If it's already just a video ID (11 characters, alphanumeric, dashes, underscores)
      if url.match?(/^[a-zA-Z0-9_-]{11}$/)
        return url
      end
      
      nil
    end
    
    def extract_vimeo_id(url)
      # Standard Vimeo URLs: vimeo.com/VIDEO_ID
      if match = url.match(/vimeo\.com\/(\d+)/)
        return match[1]
      end
      
      # Vimeo player URLs: player.vimeo.com/video/VIDEO_ID
      if match = url.match(/player\.vimeo\.com\/video\/(\d+)/)
        return match[1]
      end
      
      # If it's already just a numeric video ID
      if url.match?(/^\d+$/)
        return url
      end
      
      nil
    end
  end
end

Liquid::Template.register_filter(Jekyll::VideoEmbed)
