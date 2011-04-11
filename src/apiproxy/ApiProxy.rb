# coding=utf-8

# https://gist.github.com/875223
# Http to other api proxy.

require 'uri'
require 'open-uri'
require 'webrick'
require 'json'
require 'ruby_gntp'
require 'nokogiri'

# WEBrick::HTTPServer.new OPTION
OPTION = {
  :DocumentRoot => '.',
  :BindAddress  => '127.0.0.1',
  :Port         => 80
}

# TwitterUser infomation class.
#
# Usage
#   twuser = TwitterUser.new 'ne_sachirou'
#   twuser.screen_name #=> 'ne_sachirou'
#   twuser.icon_uri #=> ne_sachirou's twitter icon uri
class TwitterUser
  attr_reader :screen_name, :icon_uri
  
  @@icon_uri_cache = {
  }
  
  # Give twitter screen_name to the argument.
  # This cache user info 300 seconds.
  def initialize screen_name
    @screen_name = screen_name
    
    icon_uri_cache = @@icon_uri_cache
    unless icon_uri_cache[screen_name] && (icon_uri_cache[screen_name][:time] + 300 > Time.now)
      open "http://twitter.com/#{screen_name}" do |file|
        doc = Nokogiri::HTML file
        icon_uri_cache[screen_name] = {
          :uri => doc.css('#profile-image, #profile-img')[0]['src'].sub(/^https/, 'http'),
          :time => Time.now
        }
      end
    end
    @@icon_uri_cache = icon_uri_cache
    @icon_uri = @@icon_uri_cache[screen_name][:uri]
  end
end

# Http to GNTP proxy server.
class GrowlServlet < WEBrick::HTTPServlet::AbstractServlet
  @@growl = GNTP.new 'ApiProxy'
  @@growl.register({
    :notifications => [
      {
        :name    => 'notify',
        :enabled => true
      }
    ]
  })
  
  # Http Post request
  #   :title => Growl title
  #   :text => Growl text
  #   :twitter_screen_name => Twitter screen name
  #   :ison_uri => Growl icon uri
  #   :sticky => Growl sticky on or not
  # :twitter_screen_name or :icon_uri is optional.
  #
  # Return JSON
  #   :ok => "growl ok"
  #   :request => request.query
  # or
  #   :error => "#{error.class}: #{error.message}"
  #   :request => request.query
  def do_POST req, res
    res['Content-Type'] = 'text/plain'
    begin
      @@growl.notify({
        :name   => 'notify',
        :title  => req.query['title'],
        :text   => req.query['text'],
        :icon   => if req.query['twitter_screen_name'] && (req.query['twitter_screen_name'] != '')
                     twuser = TwitterUser.new req.query['twitter_screen_name']
                     twuser.icon_uri
                   else
                     req.query['icon_uri']
                   end,
        :sticky => !!req.query['sticky']
      })
      req.query['text'] = URI.escape req.query['text']
      res.body = {
        :ok => "growl ok",
        :request => req.query
      }.to_json
    rescue => err
      puts "#{err.class}: #{err.message}\n#{err.backtrace.join "\n"}"
      req.query['text'] = URI.escape req.query['text']
      res.body = {
        :error => "#{err.class}: #{err.message}",
        :request => req.query
      }.to_json
    end
  end
end

# Read Azurea.ini file.
class IniServlet < WEBrick::HTTPServlet::AbstractServlet
  def do_GET req, res
    ini = {
      :Twitter => {
        :ActiveProfileId => '0'
      },
      :Proxy => {
        :UserName =>'',
        :Password => '',
        :Address => '',
        :UseProxy => '0',
        :UseIESetting => '1',
        :Port => '8080'
      },
      :Matches => {},
      :Searches => {},
      :Filters => {},
      :Profile0 => {
        :Caption => 'Default',
        :UserName => '',
        :Password => '',
        :oauth_token => '',
        :oauth_token_secret => '',
        :Highlight => ''
      },
      :Misc => {
        :SimpleMode => '0',
        :ExpandAll => '0',
        :UseQT => '0',
        :BackgroundImage => '0',
        :FontFace => '',
        :FontSize => '0',
        :UseSystemColor => '0',
        :TextColor => '0',
        :AskBeforePost => '0',
        :Interval => '1',
        :ReadCount => '40',
        :InitialRefresh => '1',
        :NoPictures => '0',
        :EnableAutoRefresh => '0',
        :FitToIconheight => '0',
        :Language => '1041',
        :ColorSchemeFile => 'Default.txt',
        :ShowComposeAlways => '0',
        :EnableAutoScroll => '0',
        :ScrollToTop => '1',
        :ScrollInterval => '30000',
        :DisableUnreadManagement => '0',
        :NoRefreshAfterPosted => '0',
        :ShowExitConfirmation => '0',
        :SaveLogData => '0',
        :ExpandComposeAreaSipOpend => '0',
        :Browser => '',
        :EnableFlick => '0',
        :UnlockLimitation => '0',
        :BackgroundTiling => '0',
        :EnableFavotterClient => '0',
        :IconSize => '48',
        :AutoAppendHashtag => '0',
        :PictureDirectory => '0',
        :RetweetFormat => 'RT @%u: %s',
        :IgnoreSinceId => '0',
        :TimelineLogMax => '200',
        :EnableShake => '0',
        :TextAreaFontSize => '',
        :TextAreaToBottom => '0',
        :TextAreaMultiline => '0',
        :UseSecredConnection => '0',
        :AllowMultipleInstance => '0'
      },
      :Sound => {
        :NewMessage => '',
        :NewReply => '',
        :VibrateNewMessage => '0',
        :VibrateNewReply => '0',
        :VibrateId => '1'
      },
      :Location => {
        :UseCellTowerInfo => '0',
        :DisableGPS => '0'
      },
      :Movapic => {
        username: ''
      },
      :HashTags => {},
      :UserStream => {
        :replies => '',
        :Enabled => '1',
        :track => ''
      },
      :UrlHooks => {},
      :Scripting => {
        :AllowActiveXObject => '0'
      },
      :'WindowMetrics.MainWindow' => {
        :Top => '-2147483648',
        :Left => '-2147483648',
        :Width => '-2147483648',
        :Height => '-2147483648'
      },
      :'WindowMetrics.ImagePreviewWindow' => {
        :Top => '-2147483648',
        :Left => '-2147483648',
        :Width => '-2147483648',
        :Height => '-2147483648'
      }
    }
    IO.foreach '../../Azurea.ini' do |line|
      line.sub!(/(?<!\\)(?:;|#).*$/, '')
      if line =~ /^\[(.+)\]$/
        processing_section = Regexp.last_match(1)
        ini[processing_section] = Hash.new unless ini.key? processing_section
      elsif line =~ /^([^=]+)=(.+)$/
        ini[processing_section][Regexp.last_match(1)] = Regexp.last_match(2)
      end
    end
    res = ini.to_json
  end
end

# Shutdown this server.
class ExitServlet < WEBrick::HTTPServlet::AbstractServlet
  def do_GET req, res
    res['Content-Type'] = 'text/plain'
    res.body = {:ok => 'exit ok.'}.to_json
    $apiproxy_server.shutdown
  end
end

$apiproxy_server = WEBrick::HTTPServer.new OPTION
$apiproxy_server.mount '/gntp', GrowlServlet
$apiproxy_server.mount '/ini', IniServlet
$apiproxy_server.mount '/exit', ExitServlet

['TERM', 'INT'].each do |signal|
  trap(signal){ $apiproxy_server.shutdown }
end

$apiproxy_server.start