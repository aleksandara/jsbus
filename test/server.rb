require 'sinatra'

use Rack::Static, :urls => ["/src"], :root => File.expand_path('..', settings.root)

helpers do

	def script_tag src
    %(<script src="#{src}" type="text/javascript"></script>)
  end
end

get '/' do
	erb :index
end