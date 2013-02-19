multitask :test => [:compile, 'test:server', 'test:open']
task :default => :test
task :build => [:compile, :build_gem]

PORT = 4567

namespace :test do

	task :server do
		system "bundle exec ruby sample/server.rb"
	end

	task :open do
		url = "http://localhost:#{PORT}"
		puts "Opening URL at #{url}..."
		sleep 3
		system(*browse_cmd(url))
	end
	
end

task :compile do
  # Coffee compile the source
  system "coffee -c ./src/jsbus.coffee"

  # Copy the js file to the sample application
  system "cp ./src/jsbus.js ./sample/public/javascripts/jsbus.js"

  # Copy the js file to the gem vendor folder
  system "cp ./src/jsbus.js ./vendor/assets/javascripts/"
end

task :build_gem do
  system "gem build jsbus.gemspec"
end


# Returns an array e.g.: ['open', 'http://example.com']
def browse_cmd(url)
  require 'rbconfig'
  browser = ENV['BROWSER'] ||
    (RbConfig::CONFIG['host_os'].include?('darwin') && 'open') ||
    (RbConfig::CONFIG['host_os'] =~ /msdos|mswin|djgpp|mingw|windows/ && 'start') ||
    %w[xdg-open x-www-browser firefox opera mozilla netscape].find { |comm| which comm }

  abort('ERROR: no web browser detected') unless browser
  Array(browser) << url
end

# which('ruby') #=> /usr/bin/ruby
def which cmd
  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
    exts.each { |ext|
      exe = "#{path}/#{cmd}#{ext}"
      return exe if File.executable? exe
    }
  end
  return nil
end