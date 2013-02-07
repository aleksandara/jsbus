require 'sinatra'
require 'coffee-script'

use Rack::Static, :urls => ["/vendor/assets/javascripts"], :root => File.expand_path('..', settings.root)

helpers do
	def script_tag src
    %(<script src="#{src}" type="text/javascript"></script>)
  end
end

get '/' do
	erb :index
end

get '/coffee_test' do
  erb :coffee_test
end

get '/coffee_test.js' do
  coffee :coffee_test
end

get '/jsbus.js' do
  coffee :jsbus
end

get '/sample' do
  erb :sample
end