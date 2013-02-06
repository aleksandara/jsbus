(function (window) {
  "use strict";

  function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  function log(message) {
    if (window && window.eventBus && window.eventBus.debug && window.console && window.console.log) {
      window.console.log(message);
    }
  }

  var EventBus = function () {
    var self = this;

    // If true, logging to console is enabled.
    self.debug = false;

    // Array of subscribers.
    self.subscribers = [];

    // Publish an event to the event bus.
    //   eventType: string or string array
    //   data: data associated with the event
    //   callback: fired at the completion of the event
    self.publish = function (eventType, data, callback) {
      var eventTypes = [].concat(eventType);
      if (isFunction(data)) {
        log("Given callback but no data. Assigning data to callback.");
        callback = data;
        data = {};
      }
      createAndPublishEvent(eventTypes, data, callback);
    };

    // Reset the event bus by removing all subscribers. This is useful
    // (and necessary) in testing scenarios.
    self.reset = function() {
      self.debug = false;
      self.subscribers = [];
    };

    // Subscribe to one or more events. If eventType is an array, the given callback
    // will be bound to multiple events.
		self.subscribe = function(eventType, callback) {
      var eventTypes = [].concat(eventType);
      subscribeToEventTypes(eventTypes, callback);
		};

    self.unsubscribe = function(eventType) {
      var eventTypes = [].concat(eventType), i, j, tmpSubscribers, subscriber;
      for (i = eventTypes.length - 1; i >= 0; i--) {
        eventType = eventTypes[i];
        tmpSubscribers = [];
        for (j = self.subscribers.length - 1; j >= 0; j--) {
          subscriber = self.subscribers[j];
          if (subscriber.eventType !== eventType) {
            tmpSubscribers.push(subscriber);
          }
        }
        self.subscribers = tmpSubscribers;
      }
    };

    function createAndPublishEvent(eventTypes, data, callback) {
      var i, eventType, event;
      for (i = eventTypes.length - 1; i >= 0; i--) {
        eventType = eventTypes[i];
        event = new Event(eventType, data);
        log("Publishing event: " + event.toString());
        pushEventToSubscribers(event, eventType, callback);
      }
    }

    function pushEventToSubscribers(event, eventType, callback) {
      var i, subscriber;
      for (i = self.subscribers.length - 1; i >= 0; i--) {
        subscriber = self.subscribers[i];
        if (subscriber.eventType === eventType) {
          event.push(subscriber, callback);
        }
      }
    }

    function subscribeToEventTypes(eventTypes, callback) {
      var i, eventType, subscriber;
      for (i = eventTypes.length - 1; i >= 0; i--) {
        eventType = eventTypes[i];
        subscriber = new Subscriber(eventType, callback);
        self.subscribers.push(subscriber);
      }
    }
	}; // Closes EventBus definition

  // Subscriber object. A holder for an event type and a callback.
  var Subscriber = function(eventType, callback) {
    var self = this;
    self.eventType = eventType;
    self.callback = callback;
  };

  // Event object.
  var Event = function(eventType, data) {
    var self = this;
    self.eventType = eventType;
    self.data = data || {};

    // Push the event to the given subscriber.
    self.push = function(subscriber, callback) {
      // Invoke the subscriber's callback function. Save the response, if any.
      var response = subscriber.callback(self) || { };

      // If the publisher has a callback, invoke, passing the subscriber's response.
      if (callback && isFunction(callback)) {
        callback(response);
      }
    };

    self.toString = function() {
      return "Event Type: " + self.eventType;
    };
  };

  // Do not define an eventBus is one has already been created.
	if (window && window.eventBus) {
		return;
	}
	window.eventBus = new EventBus();
}(window));
