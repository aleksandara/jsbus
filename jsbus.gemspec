require File.expand_path("../lib/jsbus", __FILE__)

Gem::Specification.new do |s|
  s.name            = "jsbus"
  s.version         = JsBus::VERSION
  s.authors         = ["Jarrett Meyer"]
  s.email           = ["jarrettmeyer@gmail.com"]
  s.summary         = "Event bus for JavaScript"
  s.description     = "I needed a simple event bus for JavaScript. So I wrote one."

  s.add_dependency  "railties", ">= 3.0"

  s.files           = Dir["{lib,vendor}/**/*"]
  s.require_paths   = ["lib"]
end