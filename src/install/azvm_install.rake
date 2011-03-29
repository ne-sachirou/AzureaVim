# encodeing=utf-8

require 'open-uri'
require 'uri'
require 'net/https'
require 'zip/zip'

AZUREAWIN_ZIP = 'http://refy.net/temp/AzureaWin.1.3.2.Beta14.zip'
AZUREAVIM_JS = 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/AzureaVim.js'
AZUREAVIM_ZIP = 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/AzureaVim.zip'
GEMS = ['ruby_gntp', 'nokogiri']

# Unzip ziped file.
#   unzip_file 'under/from.zip', '.'
def unzip_file zip_filename, target_foldername
  Dir.mkdir target_foldername unless File.exist? target_foldername
  Zip::ZipFile.foreach zip_filename do |zipentry|
    puts target = "#{target_foldername}/#{zipentry.name}"
    if zipentry.file?
      destdirs = File.dirname(target).split('/')
      destdirs.each_index {|i| Dir.mkdir destdirs[0..i].join('/') unless File.exist? destdirs[0..i].join('/')}
      File.delete target if File.exist? target
      zipentry.extract target
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
  open AZUREAWIN_ZIP do |zip|
    unzip_file(zip, File.exist?('Azurea.exe') ? '..' : '.')
  end
end

desc 'Install or update AzureaVim.js'
file 'AzureaWin/Scripts/AzureaVim.js' => 'Azurea' do |t|
  puts 'Updating AzureaVim.js'
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
  zipfilename = AZUREAVIM_ZIP.scan(/[^\/]+$/)[0]
  uri = URI.parse AZUREAVIM_ZIP
  http = Net::HTTP.new uri.host, '443'
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  http.start do |w|
    response = w.get uri.path
    open(zipfilename, 'w+b'){|target| target.write response.body}
  end
  unzip_file(zipfilename, File.exist?('Azurea.exe') ? '.' : 'AzureaWin')
  File.delete zipfilename
end

task :default => GEMS + ['Azurea', 'AzureaWin/Scripts/AzureaVim.js', 'AzureaVim']