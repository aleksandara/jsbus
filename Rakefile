task :default => :compile
task :build => [:compile, :build_gem]

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
