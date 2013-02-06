(function(window) {
  "use strict";

  var eventCounter = 0;

  function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

	var EventBus = function() {
    var self = this;

    // If true, logging to console is enabled.
    self.debug = false;

		self.subscribers = [];

    /*
      Publish an event to the event bus.

        eventType: string or string array
        data: data associated with the event
        callback: fired at the completion of the event
     */
    self.publish = function(eventType, data, callback) {
      var eventTypes;
      if (isFunction(data)) {
        log("Given callback but no data. Assigning data to callback.");
        callback = data;
        data = {};
      }

      eventTypes = [].concat(eventType);
      createAndPublishEvent(eventTypes, data, callback);
    };

    // Reset the event bus by removing all subscribers. This is useful
    // (and necessary) in testing scenarios.
    self.reset = function() {
      eventCounter = 0;
      self.subscribers = [];
    };

    // Subscribe to one or more events.
		self.subscribe = function(eventType, callback) {
      var eventTypes;
      eventTypes = [].concat(eventType);
      subscribeToEventTypes(eventTypes, callback);
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

    function log(message) {
      if (self.debug && window.console && window.console.log) {
        window.console.log(message);
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
	};

  /*
    Subscriber object. A holder for an event type and a callback.
   */
  var Subscriber = function(eventType, callback) {
    var self = this;
    self.eventType = eventType;
    self.callback = callback;
  };

  /*
    Event object.
   */
  var Event = function(eventType, data) {
    var self = this;
    self.eventCounter = nextEventCounter();
    self.eventType = eventType;
    self.data = data || {};

    self.push = function(subscriber, callback) {
      subscriber.callback(self);
      if (callback && isFunction(callback)) {
        callback();
      }
    };

    self.toString = function() {
      return "Event " + self.eventCounter + ", Type: " + self.eventType;
    };

    function nextEventCounter() {
      eventCounter += 1;
      return eventCounter;
    }
  };

  // Do not define an eventBus is one has already been created.
	if (window && window.eventBus) {
		return;
	}
	window.eventBus = new EventBus();
})(window);