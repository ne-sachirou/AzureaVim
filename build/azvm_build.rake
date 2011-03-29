# encode=utf-8

require 'rake/clean'
require 'json'
require 'zip/zip'

FILE_MOMONGA = '../js/momonga.js'
FILE_RELEASE = '../js/AzureaVim.js'
FILE_FEATURE = 'feature.js'
FILE_ENV = '../js/AzureaVim.zip'
COMPILER = 'closure'
META = {
  'name' => 'AzureaVim',
  'author' => 'http://c4se.sakura.ne.jp/profile.html',
  'scriptUrl' => 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/',
  'license' => 'MIT License'
}

CLEAN.include(FILE_MOMONGA)
CLOBBER.include(FILE_RELEASE, FILE_ENV)

open FILE_FEATURE do |feature_js|
  json = feature_js.read.gsub(/(?:^.+\()|(?:\).*$)/m, '')
  feature = JSON.parse(json)
  feature.each do |key, value|
    
    desc "#{key} => #{value}"
    task key => value do |t|
      puts t.name
      open FILE_MOMONGA, 'a' do |momonga_js|
        open "../src/#{t.name}.js" do |key_js|
          momonga_js.puts key_js.read
        end
      end
    end
    
    desc 'Preprocess and uncompiled file.'
    file FILE_MOMONGA => feature.keys
    
  end
end

desc 'Compile and add meta info.'
file FILE_RELEASE => ['clobber', FILE_MOMONGA] do |t|
  case COMPILER
  when 'closure'
    compilation_level = 'SIMPLE_OPTIMIZATIONS' #WHITESPACE_ONLY | SIMPLE_OPTIMIZATIONS | ADVANCED_OPTIMIZATIONS
    sh "java -jar closure-compiler/compiler.jar --compilation_level #{compilation_level} --js_output_file #{t.name} --js #{t.prerequisites[1]}"
  when 'yui'
    sh "java -jar yuicompressor/build/yuicompressor-2.4.2.jar --charset UFT-8 -o #{t.name} #{t.prerequisites[1]}"
  when 'ms'
    sh "AjaxMin/AjaxMin -enc:in UFT-8 #{t.prerequisites[1]} -out #{t.name}"
  when 'uglify'
    sh "uglifyjs/uglifyjs --ascii --unsafe -o #{t.name} #{t.prerequisites[1]}"
  end
  script = <<SCRIPTMETA
// ==AzureaScript==
// @name #{META['name']}
// @author #{META['author']}
// @scriptUrl #{META['scriptUrl']}
// @date #{Time.now.strftime('%Y-%m-%d')}
// @license #{META['license']}
// ==/AzureaScript==
SCRIPTMETA
  script += IO.read(t.name)
  open t.name, 'w' do |file|
    file.puts script
  end
end

desc 'Deploy AzureaVim.zip'
file FILE_ENV => 'clobber' do |t|
  Zip::ZipFile.open t.name, Zip::ZipFile::CREATE do |zipfile|
    puts 'Zip to azvm_startup.wsf'
    zipfile.add 'azvm_startup.wsf', '../src/startup/azvm_startup.wsf'
    ['AzureaStartup.js', 'do_uac.js'].each do |filename|
      puts "Zip to date/Startup/#{filename}"
      zipfile.add "date/Startup/#{filename}", "../src/startup/#{filename}"
    end
  end
end

task :default => [FILE_RELEASE, FILE_ENV]

desc 'Deploy debugging file.'
task 'debug' => ['clean', FILE_MOMONGA] do
  cp FILE_MOMONGA, '../../Scripts/momonga.js'
end