## Usage

**Subscribing to events**

Subscribing to events is a simple callback pattern.

```javascript
eventBus.subscribe("my.event", function() {
  alert("my.event was raised!");
}
```

You can even subscribe the same callback to multiple events simultaneously.

```javascript
eventBus.subscribe(["my.event-one", "my.event-two"], function(event) {
  alert(event.eventType + " was raised!");
});
```

**Publishing an event**

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
