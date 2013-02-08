root = exports ? this

class Tester
  sayHello: (target) ->
    alert "Hello, #{target}!"

unless root.tester
  root.tester = new Tester