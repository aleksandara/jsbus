require 'sinatra'

use Rack::Static, :urls => ["/vendor/assets/javascripts"], :root => File.expand_path('..', settings.root)

helpers do
	def script_tag src
    %(<script src="#{src}" type="text/javascript"></script>)
  end
end

get '/' do
	erb :index
end

get '/sample' do
  erb :sample
end