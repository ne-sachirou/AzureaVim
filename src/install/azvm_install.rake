# encodeing=utf-8

require 'open-uri'
require 'uri'
require 'net/https'
require 'zip/zip'

AZUREAWIN_ZIP = 'http://refy.net/temp/AzureaWin.1.3.2.Beta13.zip'
AZUREAVIM_JS = 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/AzureaVim.js'
AZUREAVIM_ZIP = 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/AzureaVim.zip'
GEMS = ['ruby_gntp', 'nokogiri']

# Unzip ziped file.
#   unzip_file 'under/from.zip', '.'
def unzip_file zip_filename, target_foldername
  Dir.mkdir target_foldername unless File.exist? target_foldername
  i = 0
  Zip::ZipFile.foreach zip_filename do |zipentry|
    puts target = "#{target_foldername}/#{zipentry.name}"
    if i == 0 && zipentry.file?
      topfolder = target.sub(/[^\/]+$/, '')
      Dir.mkdir topfolder unless File.exist? topfolder
    end
    i = 1
    if zipentry.file?
      File.delete target if File.exist? target
      zipentry.extract target
    elsif !File.directory? target
      File.delete target if File.exist? target
      Dir.mkdir target
    end
  end
end

GEMS.each do |gem|
  desc "gem install or update #{gem}"
  task gem do |t|
    begin
      require t.name
      sh "gem update #{t.name}"
    rescue
      sh "gem install #{t.name}"
    end
  end
end

desc 'Install or update Azurea.exe'
task 'Azurea' do
  puts 'Updating Azurea.'
  #open AZUREAWIN_ZIP do |zip|
  #  unzip_file zip, '.'
  #end
end

desc 'Install or update AzureaVim.js'
file 'AzureaWin/Scripts/AzureaVim.js' => 'Azurea' do |t|
  puts 'Updating AzureaVim.js'
  #open AZUREAVIM_JS do |js|
  #  open(t.name, 'w'){|target| target.write js.read}
  #end
  uri = URI.parse AZUREAVIM_JS
  http = Net::HTTP.new uri.host, '443'
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  http.start do |w|
    response = w.get uri.path
    open(t.name, 'w'){|target| target.write response.body}
  end
end

desc 'Install or update AzureaVim environment.'
task 'AzureaVim' => 'Azurea' do
  puts 'Updating AzureaVim.'
  open AZUREAVIM_ZIP do |zip|
    unzip_file zip, 'AzureaWin'
  end
end

task :default => GEMS + ['Azurea', 'AzureaWin/Scripts/AzureaVim.js', 'AzureaVim']