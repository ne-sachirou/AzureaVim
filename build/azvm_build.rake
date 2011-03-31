# encode=utf-8

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
#   write_meta 'AzureaVim.js'
def write_meta filename
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
    sh "java -jar closure-compiler/compiler.jar --compilation_level #{compilation_level} --js_output_file #{source} --js #{dest}"
  when 'yui'
    sh "java -jar yuicompressor/build/yuicompressor-2.4.2.jar --charset UFT-8 -o #{source} #{dest}"
  when 'ms'
    sh "AjaxMin/AjaxMin -enc:in UFT-8 #{source} -out #{dest}"
  when 'uglify'
    sh "uglifyjs/uglifyjs --ascii --unsafe -o #{source} #{dest}"
  end
end

def schedule_task taskname, feature
  feature.each do |key, value|
    
    desc "=> #{value}"
    task key => value do |tsk|
      open "#{RELEASE_DIRECTORY}momonga.#{taskname}.js", 'a' do |momonga_js|
        open("../src/#{tsk.name}.js"){|key_js| momonga_js.puts key_js.read}
      end
    end
    
  end
  
  desc "momonga.#{taskname}.js"
  task "momonga_#{taskname}" => feature.keys
  
  desc "AzureaVim.#{taskname}.js"
  task "build_#{taskname}" => "momonga_#{taskname}" do |tsk|
    release_file = "#{RELEASE_DIRECTORY}AzureaVim#{taskname === 'default' ? '' : '.' + taskname}.js"
    compile_js "#{RELEASE_DIRECTORY}momonga.#{taskname}.js", release_file
    write_meta release_file
  end
  
  $DEBUG_TASKS.push "momonga_#{taskname}"
  $RELEASE_TASKS.push "build_#{taskname}"
  CLEAN.include "#{RELEASE_DIRECTORY}momonga.#{taskname}.js"
  CLOBBER.include "#{RELEASE_DIRECTORY}AzureaVim.#{taskname}.js"
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
  cp "#{RELEASE_DIRECTORY}momonga.default.js", '../../Scripts/momonga.js'
end

desc 'release'
task :default => $RELEACSE_TASKS
