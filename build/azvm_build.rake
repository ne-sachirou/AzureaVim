# encode=utf-8
Encoding.default_external = 'utf-8'

RELEASE_DIRECTORY = '../js/'
FILE_FEATURE = 'feature.json'
FILE_ENV = 'AzureaVim.zip'
COMPILER = 'closure'
META = {
  'name' => 'AzureaVim',
  'author' => 'http://c4se.sakura.ne.jp/profile.html',
  'scriptUrl' => 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/',
  'license' => 'MIT License'
}

require 'rake/clean'
require 'json'
require 'zip/zip'

$DEBUG_TASKS = ['clean']
$RELEASE_TASKS = ['clobber', RELEASE_DIRECTORY + FILE_ENV]

# ex.
#   write_metainfo 'AzureaVim.js'
def write_metainfo filename
    script = <<SCRIPTMETA
// ==AzureaScript==
// @name #{META['name']}
// @author #{META['author']}
// @scriptUrl #{META['scriptUrl']}
// @date #{Time.now.strftime('%Y-%m-%d')}
// @license #{META['license']}
// ==/AzureaScript==
SCRIPTMETA
  script += IO.read filename
  open filename, 'w' do |file|
    file.puts script
  end
end

# ex.
#   compile_js 'momonga.js', 'AzureaVim.js'
def compile_js source, dest
  case COMPILER
  when 'closure'
    compilation_level = 'SIMPLE_OPTIMIZATIONS' #WHITESPACE_ONLY | SIMPLE_OPTIMIZATIONS | ADVANCED_OPTIMIZATIONS
    sh "java -jar closure-compiler/compiler.jar --compilation_level #{compilation_level} --js_output_file #{dest} --js #{source}"
  when 'yui'
    sh "java -jar yuicompressor/build/yuicompressor-2.4.2.jar --charset UFT-8 -o #{dest} #{source}"
  when 'ms'
    sh "AjaxMin/AjaxMin -enc:in UFT-8 #{source} -out #{dest}"
  when 'uglify'
    sh "uglifyjs/uglifyjs --ascii --unsafe -o #{dest} #{source}"
  end
end

# Translate
#   codes0
#   //{@notfeaturename
#   codes1
#   //}@notfeaturename
#   codes2
# or
#   codes0 /*{@notfeaturename*/ codes1 /*}@notfeaturename*/ codes2
# to
#   codes0
#   codes2
#
# And translate
#   codes0
#   //{!@featurename
#   codes1
#   //}!@featurename
#   codes2
# or
#   codes0 /*{!@featurename*/ codes1 /*}!@featurename*/ codes2
# to
#   code0
#   code2
#
# ex.
#   paste_parts 'momonga.simple.js', 'simple'
def paste_parts filename, featurename
  text = ''
  open filename, 'r' do |file|
    text = file.read
    text.gsub!(%r{
      (?:
        (?://\{@(?!#{featurename})(.+?)\n)|
        (?:/\*\{@(?!#{featurename})(.+?)\*/)
      )
      .*?
      (?:
        (?://\}@\1\n)|
        (?:/\*\}@\2\*/)
      )
    }xm, '')
    text.gsub!(%r{
      (?:
        (?://\{!@#{featurename}\n)|
        (?:/\*\{!@#{featurename}\*/)
      )
      .*?
      (?:
        (?://\}!@#{featurename}\n)|
        (?:/\*\}!@#{featurename}\*/)
      )
    }xm, '')
  end
  open filename, 'w' do |file|
    file.write text
  end
end

# ex.
#   schedule_task 'simple', features['simple']
def schedule_task taskname, feature
  file_momonga = "#{RELEASE_DIRECTORY}momonga.#{taskname}.js"
  file_release = "#{RELEASE_DIRECTORY}AzureaVim#{taskname === 'default' ? '' : '.' + taskname}.js"
  feature.each do |key, value|
    
    task "#{taskname}__#{key}" => value.collect{|item| "#{taskname}__#{item}"} do |tsk|
      puts "#{file_momonga} << #{key}"
      open file_momonga, 'a' do |momonga_js|
        open("../src/#{key}.js"){|key_js| momonga_js.puts key_js.read}
      end
    end
    
  end
  
  desc file_momonga
  task "momonga_#{taskname}" => feature.keys.collect{|item| "#{taskname}__#{item}"} do
    paste_parts file_momonga, taskname
  end
  
  desc file_release
  task "build_#{taskname}" => "momonga_#{taskname}" do |tsk|
    compile_js file_momonga, file_release
    write_metainfo file_release
  end
  
  $DEBUG_TASKS.push "momonga_#{taskname}"
  $RELEASE_TASKS.push "build_#{taskname}"
  CLEAN.include file_momonga
  CLOBBER.include file_release
end

CLOBBER.include(RELEASE_DIRECTORY + FILE_ENV)

open FILE_FEATURE do |feature_js|
  features = JSON.parse(feature_js.read)
  features.each do |taskname, faeture|
    schedule_task taskname, faeture
  end
end

desc 'Deploy azvm_install.js'
file 'azvm_install.js' do |tsk|
  puts "Copy #{tsk.name}"
  FileUtils.copy_file "../src/install/#{tsk.name}", "../js/#{tsk.name}"
end

desc 'Deploy AzureaVim.zip'
file(RELEASE_DIRECTORY + FILE_ENV => ['clobber', 'azvm_install.js']) do |tsk|
  Zip::ZipFile.open tsk.name, Zip::ZipFile::CREATE do |zipfile|
    puts 'Zip to azvm_startup.wsf'
    zipfile.add 'azvm_startup.wsf', '../src/startup/azvm_startup.wsf'
    ['AzureaStartup.js', 'do_uac.js'].each do |filename|
      puts "Zip to data/startup/#{filename}"
      zipfile.add "data/startup/#{filename}", "../src/startup/#{filename}"
    end
    puts 'Zip to data/apiproxy/apiproxy.rb'
    zipfile.add 'data/apiproxy/apiproxy.rb', '../src/apiproxy/apiproxy.rb'
  end
end

desc 'debug'
task 'debug' => $DEBUG_TASKS do
  cp "#{RELEASE_DIRECTORY}momonga.default.js", '../../Scripts/momonga.default.js'
  cp "#{RELEASE_DIRECTORY}momonga.simple.js", '../../AzureaWinSub/Scripts/momonga.simple.js'
end

desc 'release'
task :default => $RELEASE_TASKS
