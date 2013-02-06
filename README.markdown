## Installing

There are two ways to use this file. First, you can copy the `jsbus.js` file directly [here's a
link](https://github.com/jarrettmeyer/jsbus/blob/master/vendor/assets/javascripts/jsbus.js) into
your project. Second, you can install the gem. JsBus works with the Rails asset pipeline.

```
$ gem install jsbus
```

In application.js, Add the following line.

```
//= require jsbus
```

## Usage

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

You can send data with a publish. You can get to the data by receiving the event in your callback.

```javascript
eventBus.subscribe("my.event", function(event) {
  alert("x: " + event.data.x);
});
eventBus.publish("my.event", { x: 1, y: 3, z: [2, 4, 6] });
```

Publishing an event can also have a callback.

```javascript
eventBus.publish("my.event", function() {
  alert("I'm back!");
});
```

You can even do basic request/response style programming with JsBus. To do this,
your subscriber should have a `return` statement.

```javascript
eventBus.subscribe("my.event", function (event) {
  var value = event.data.value;
  switch (event.data.op) {
    case 'increment':
      return value + 1;
    case 'decrement':
      return value - 1;
    case 'square':
      return value * value;
    default:
      return value;
  }
  return value * value;
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
