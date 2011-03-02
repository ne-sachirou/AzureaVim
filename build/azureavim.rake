require 'rake/clean'
require 'json'

f_momonga = '../js/momonga.js'
f_release = '../js/AzureaVim.js'

CLEAN.include("../js/momonga.js")
CLOBBER.include("../js/AzureaVim.js")

open 'feature.js' do |feature_js|
  json = feature_js.read.gsub(/(^.+\()|(\).*$)/m, '')
  feature = JSON.parse(json)
  feature.each do |key, value|
    
    desc "#{key} => #{value}"
    task key => value do |t|
      puts t.name
      open '../js/momonga.js', 'a' do |azurea_vim_js|
        open "../#{t.name}.js" do |key_js|
          azurea_vim_js.puts key_js.read
        end
      end
    end
    
    task f_momonga => feature.keys
    
  end
end

file f_release => f_momonga do |t|
  compilation_level = 'WHITESPACE_ONLY' #WHITESPACE_ONLY | SIMPLE_OPTIMIZATIONS | ADVANCED_OPTIMIZATIONS
  sh "java -jar closure-compiler/compiler.jar --compilation_level #{compilation_level} --js_output_file #{t.name} --js #{t.prerequisites[0]}"
  #sh "java -jar yuicompressor/build/yuicompressor-2.4.2.jar --charset UFT-8 -o #{t.name} #{t.prerequisites[0]}"
  #sh "AjaxMin/AjaxMin -enc:in UFT-8 #{t.prerequisites[0]} -out #{t.name}"
end

task :default => f_release