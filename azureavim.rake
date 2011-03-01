require 'json'

open 'AzureaVim.js', 'w' do
  
end

open 'feature.js' do |feature_js|
  json = feature_js.read.gsub(/(^.+\()|(\).*$)/m, '')
  feature = JSON.parse(json)
  feature.each do |key, value|
    
    desc "#{key} => #{value}"
    task key => value do |t|
      puts t.name
      open 'AzureaVim.js', 'a' do |azurea_vim_js|
        open "#{t.name}.js" do |key_js|
          azurea_vim_js.puts key_js.read
        end
      end
    end
    
    task :default => feature.keys
    
  end
end