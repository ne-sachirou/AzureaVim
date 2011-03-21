# HTTP POSTをWEBrickで受け、Growl通知します。
# POSTのkeyには、 title, text, twitter_screen_name, icon_uri, sticky を使用します。
# ruby_gntp と nokogiri に依存します。

require 'webrick'
require 'ruby_gntp'
require 'open-uri'
require 'nokogiri'
require 'json'

OPTION = {
  :DocumentRoot => '.',
  :BindAddress  => '127.0.0.1',
  :Port         => 10080
}

class TwitterIcon
  @@icon_uri_cache = {}
  
  def getUri screen_name
    unless @@icon_uri_cache[screen_name] && @@icon_uri_cache[screen_name]['time'] + 300 > Time.now
      open "http://twitter.com/#{screen_name}" do |file|
        doc = Nokogiri::HTML file
        @@icon_uri_cache[screen_name] = {
          :uri => doc.css('#profile-image, #profile-img')[0]['src'],
          :time => Time.now
        }
      end
    end
    @@icon_uri_cache[screen_name]['uri']
  end
end

class GrowlServlet < WEBrick::HTTPServlet::AbstractServlet
  @@growl = GNTP.new 'HTTP GNTP'
  @@growl.register({
    :notifications => [
      {
        :name    => 'notify',
        :enabled => true
      }
    ]
  })
  
  def do_POST req, res
    res['Content-Type'] = 'text/plain'
    begin
      @@growl.notify({
        :name   => 'notify',
        :title  => req.query['title'],
        :text   => req.query['text'],
        :icon   => if req.query['twitter_screen_name'] != ''
          twic = TwitterIcon.new
          twic.getUri req.query['twitter_screen_name']
        else
          req.query['icon_uri']
        end,
        :sticky => !!req.query['sticky']
      })
      res.body = "{\"ok\": \"growl ok\", \"request\": #{req.query.to_json}}"
    rescue
      res.body = "{\"error\": \"#$!\", \"request\": #{req.query.to_json}}"
    end
  end
end

server = WEBrick::HTTPServer.new OPTION
server.mount '/gntp', GrowlServlet
server.start