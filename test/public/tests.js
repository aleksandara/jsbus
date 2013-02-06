test("Hello test", function() {
	ok(true, "Passed!");
});

//
// Module
//
module("eventBus", {
  setup: function() {
    eventBus.reset();
  }
});

test("Adds an eventBus object to the top window object", function (){
  ok(window.eventBus !== undefined, "the eventBus is defined");
});

test("Number of default subscribers should be 0", function() {
  var count = eventBus.subscribers.length;
	equal(0, count);
});

module("subscribing to an event", {
  setup: function() {
    eventBus.reset();
  }
});

test("Can subscribe to an event", function() {
  eventBus.subscribe("my.event", function() { });
  ok(true, "added a subscriber without exploding")
});

test("Subscribing to an event should add a subscriber to the array", function() {
  eventBus.subscribe("my.event", function() { });
  var numSubscribers = eventBus.subscribers.length;
  equal(1, numSubscribers);
});

//
// Module
//
module("publishing an event without subscribers", {
  setup: function() {
    eventBus.reset();
  }
});

test("Can publish an event", function() {
  eventBus.publish("my.event");
  ok(true, "published event without exploding");
});

test("Can publish an event, but with data", function (){
  eventBus.publish("my.event", { x: 1 });
  ok(true, "published event without exploding");
});

test("Can publish an event, but with a callback", function(){
  eventBus.publish("my.event", function() { });
  ok(true, "published event without exploding");
});

test("Can publish an event, but with data and callback", function() {
  eventBus.publish("my.event", { x: 1 }, function() { });
  ok(true, "published event without exploding");
});

//
// Module
//
module("publishing an event with a single subscriber", {
  setup: function() {
    eventBus.debug = true;
    window.hit = false;
    window.hitWithData = false;
    eventBus.subscribe("my.event", function(event){
      window.hit = true;
      if (event && event.data) {
        window.hitWithData = true;
      }
    });
  }
});

test("Can publish an event", function() {
  expect(2);
  equal(false, window.hit);
  eventBus.publish("my.event");
  ok(window.hit);
});

test("Can publish an event with data", function() {
  expect(2);
  equal(false, window.hitWithData);
  eventBus.publish("my.event", {x:1});
  ok(window.hitWithData);
});

test("Can publish an event a callback", function() {
  var hitCallback = false;
  eventBus.publish("my.event", function() {
    hitCallback = true;
  });
  ok(hitCallback);
});

test("Can publish an event with data and callback", function() {
  expect(2);
  var hitCallback = false;
  eventBus.publish("my.event", {x:1}, function() {
    hitCallback = true;
  });
  ok(window.hitWithData);
  ok(hitCallback);
});

test("Event data property is persisted as expected", function() {
  var dataValue = 3;
  eventBus.subscribe("my.event", function(event) {
    dataValue = event.data.value;
  });
  eventBus.publish("my.event", { value: 5 });
  equal(5, dataValue);
});

test("Event can persist the event type", function() {
  var eventType = '';
  eventBus.subscribe(["my.event-one", "my.event-two"], function(event) {
    eventType = event.eventType;
  });
  eventBus.publish("my.event-two");
  equal("my.event-two", eventType);
});

//
// Module
//
module("publishing an event with a single subscriber without data", {
  setup: function() {
    window.hit = false;
    // This subscriber callback does not have a data argument.
    eventBus.subscribe("my.event", function(){
      window.hit = true;
    });
  }
});

test("Can publish an event without data", function(){
  eventBus.publish("my.event");
  ok(true, "no errors were raised");
});

test("Can publish an event with data", function(){
  eventBus.publish("my.event", {x:1});
  ok(true, "no errors were raised");
});

//
// Module: Multiple events
//
module("Multiple subscribers", {
  setup: function() {
    window.hitOne = false;
    window.hitTwo = false;
    eventBus.subscribe("my.event-one", function() {
      window.hitOne = true;
    });
    eventBus.subscribe("my.event-two", function() {
      window.hitTwo = true;
    });
  }
});

test("Can hit first subscriber without hitting second", function(){
  expect(2);
  eventBus.publish("my.event-one");
  equal(true, window.hitOne);
  equal(false, window.hitTwo);
});

test("Can hit second subscriber without hitting first", function(){
  expect(2);
  eventBus.publish("my.event-two");
  equal(false, window.hitOne);
  equal(true, window.hitTwo);
});

test("Can hit both subscribers with a single published", function() {
  expect(2);
  eventBus.publish(["my.event-one", "my.event-two"]);
  equal(true, window.hitOne);
  equal(true, window.hitTwo);
});

