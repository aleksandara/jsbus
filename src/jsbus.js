(function(window) {
  "use strict";

  var eventCounter = 0;

	var EventBus = function(settings) {
    var self = this;
    self.debug = (settings && settings.debug) || false;
		self.subscribers = [];

    // This is the same method used by underscore.js
    self.isFunction = function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    self.publish = function(eventType, data, callback) {
      var eventTypes;
      if (self.isFunction(data)) {
        log("Given callback but no data. Assigning data to callback.");
        callback = data;
        data = {};
      }
      eventTypes = [].concat(eventType);
      createAndPublishEvent(eventTypes, data, callback);
    };

    self.reset = function() {
      self.subscribers = [];
    };

		self.subscribe = function(eventType, callback) {
      var subscriber = new Subscriber(eventType, callback);
      self.subscribers.push(subscriber);
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
	};

  var Subscriber = function(eventType, callback) {
    var self = this;
    self.eventType = eventType;
    self.callback = callback;
  };

  var Event = function(eventType, data) {
    var self = this;
    self.eventCounter = nextEventCounter();
    self.eventType = eventType;
    self.data = data || {};

    self.push = function(subscriber, callback) {
      subscriber.callback(self.data);
      if (callback && eventBus.isFunction(callback)) {
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
	if (window.eventBus) {
		return;
	}
	window.eventBus = new EventBus();
})(window);