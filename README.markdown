# JsBus 0.1.3

[![Build Status](https://secure.travis-ci.org/jarrettmeyer/jsbus.png)](http://travis-ci.org/jarrettmeyer/jsbus)

## Why Write a JavaScript Message Broker?

Because.

## Installing

### Copy/Paste

The easiest way to use JsBus is to copy [jsbus.js](https://github.com/jarrettmeyer/jsbus/blob/master/vendor/assets/javascripts/jsbus.js) into your project.

### Rails Asset Pipeline

JsBus is designed as a gem to work with the Rails asset pipeline. Install the gem and you're ready to go.

```
$ gem install jsbus
```

Add to your `Gemfile`. Run bundler, and you should be ready to go.

```
gem 'jsbus', '~> 0.1.3'
```

In `application.js`, add the following line, and everything should work as expected.

```
//= require jsbus
```

## Usage

JsBus will add one item to your global namespace: `window.eventBus`. Everything else is hidden away. The basic operations are

```javascript
eventBus.subscribe(eventType, callback);    // Subscribe the callback to the event type.
eventBus.publish(eventType, data);          // Publish an event with a type (optionally with data).
eventBus.unsubscribe(eventType);            // Unsubscribe all subscribers with the event type.
```

### Subscribing to events

Subscribing to events is a simple callback pattern. Simply give the event type and what to do
when the event is published.

```javascript
eventBus.subscribe("my.event", function() {
  alert("my.event was raised!");
});
```

You can subscribe the same callback to multiple events simultaneously.

```javascript
eventBus.subscribe(["my.event-one", "my.event-two"], function(event) {
  alert(event.eventType + " was raised!");
});
```

### Publishing an event

You can publish one event by calling `publish()`.

```javascript
eventBus.publish("my.event");
```

You can publish multiple events simultaneously by sending an array of events.

```javascript
eventBus.publish(["my.event-one", "my.event-two"]);
```

You can send data with a publish. You can get to the data by receiving the event in your callback. The data will be stored in `event.data`.

```javascript
eventBus.subscribe("my.event", function(event) {
  alert("x: " + event.data.x);
});
eventBus.publish("my.event", { x: 1, y: 3, z: [2, 4, 6] });
```

Publishing an event can also have a callback. The publisher callback will be invoked after each subscribers.

```javascript
eventBus.publish("my.event", function() {
  alert("I'm back!");
});
```
In the example above, if `my.event` has three subscribers, you can expect three alert popups.

You can even do basic request/response style programming with JsBus. To do this, your subscriber should have a `return` statement. Whatever is returned from the subscriber will be passed into the publisher's callback.

```javascript
eventBus.subscribe("my.event", function (event) {
  switch (event.data.op) {
    case 'increment':
      return event.data.value + 1;
    case 'decrement':
      return event.data.value - 1;
    case 'square':
      return event.data.value * event.data.value;
    default:
      return 0;
  }
});
eventBus.publish("my.event", { op: 'square', value: 3 }, function (response) {
  alert("response is: " + response); // response is: 9
});
```

### Unsubscribing

You can unsubscribe from one or more events, too.

```javascript
eventBus.unsubscribe('my.event');
eventBus.unsubscribe(['my.event.one', 'my.event.two']);
```

## Testing

A Sinatra test application is provided in the repository. Unit testing is done with [QUnit]
(http://qunitjs.com). You can see a sample usage by browsing to `/sample`.

```
$ git clone git@github.com:jarrettmeyer/jsbus.git
$ bundle install
$ rake test
```

## Authors

**Jarrett Meyer**

+ [http://twitter.com/jarrettmeyer](@jarrettmeyer)
+ [http://jarrettmeyer.com](jarrettmeyer.com)
