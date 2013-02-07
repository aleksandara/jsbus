# Give CoffeeScript some love. This lets CS get to the root (a.k.a. window) object.
root = exports ? this

#
class EventBus

  # Initialize a new event bus with an empty collection of subscribers.
  constructor: () ->
    this.subscribers = []

  # Publish a new event
  #   eventType: a single event or array of events
  #   data: data related to the event
  #   callback: callback to invoke after the event is published
  publish: (eventType, data, callback) ->
    eventTypes = [].concat(eventType)
    # If data is a function, that really means that no data was given. Do some
    # parameter swapping.
    if isFunction(data)
      callback = data
      data = { }
    createAndPublishEvent(this, eventTypes, data, callback)

  # Reset the event bus. Used in testing. Probably shouldn't be used in production.
  reset: () ->
    this.subscribers = []

  # Subscribe the given callback to the given event type.
  subscribe: (eventType, callback) ->
    eventTypes = [].concat(eventType)
    subscribeToEventType(this, eventTypes, callback)

  # Unsubscribe all callbacks from the given event type.
  #    eventType: a single event or array of events
  unsubscribe: (eventType) ->
    eventTypes = [].concat(eventType)
    for eventType in eventTypes
      tmpSubscribers = []
      for subscriber in this.subscribers
        # If the subscriber event type should not be removed, then keep it in a temporary list. Otherwise,
        # publish an event notifying of removal.
        if subscriber.eventType != eventType
          tmpSubscribers.push(subscriber)
        else
          this.publish("EventBus.unsubscribed", { subscriber: subscriber })
      this.subscribers = tmpSubscribers

#
class Event
  constructor: (eventType, data, callback) ->
    this.eventType = eventType
    this.data = data ? { }
    this.callback = callback

  # Push the event to the given subscriber.
  push: (subscriber) ->
    # Invoke the subscriber's callback function. Save the response. If a callback was given, then invoke the callback.
    response = subscriber.callback(this) ? { }
    if isFunction(this.callback)
      this.callback(response)

#
class Subscriber
  # Create a new subscriber with the given event type and callback.
  constructor: (eventType, callback) ->
    this.eventType = eventType
    this.callback = callback

#
createAndPublishEvent = (eventBus, eventTypes, eventData, callback) ->
  for eventType in eventTypes
    event = new Event(eventType, eventData, callback)
    pushEventToSubscribers(eventBus, event)

# This is the same method UnderscoreJS uses for functional definition.
isFunction = (obj) ->
  !!(obj && obj.constructor && obj.call && obj.apply)

# Push the given event to all subscribers with a matching event type.
pushEventToSubscribers = (eventBus, event) ->
  for subscriber in eventBus.subscribers when subscriber.eventType == event.eventType
    event.push(subscriber)

# Subscribe to the given event types
#   eventBus: event bus instance keeping track of all subscribers
#   eventTypes: array of event types to subscribe
#   callback: function to invoke when the event is published
subscribeToEventType = (eventBus, eventTypes, callback) ->
  for eventType in eventTypes
    subscriber = new Subscriber(eventType, callback)
    eventBus.subscribers.push(subscriber)
    eventBus.publish("EventBus.subscribed", { subscriber: subscriber })

# Create a new EventBus. Prevent eventBus from being defined twice on root.
unless root.eventBus
  root.eventBus = new EventBus()