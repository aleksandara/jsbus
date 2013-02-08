exports.jsbus = require("../src/jsbus.coffee")
eventBus = exports.jsbus.eventBus

exports.addingASubscriberAddsToTheArray = (test) ->
  test.expect(1)
  eventBus.reset()
  eventBus.subscribe("my.event", () -> )
  count = eventBus.subscribers["my.event"].length
  test.equal(1, count)
  test.done()

exports.canPublishAnEventWithCallbackButNoData = (test) ->
  test.expect(1)
  eventBus.reset()
  eventBus.publish("my.event", -> )
  test.ok(true)
  test.done()

exports.canPublishAnEventWithData = (test) ->
  test.expect(1)
  eventBus.reset()
  eventBus.publish("my.event", { x: 1, y: 2 })
  test.ok(true, "nothing exploded")
  test.done()

exports.canPublishAnEventWithNoSubscribers = (test) ->
  test.expect(1)
  eventBus.reset()
  eventBus.publish("my.event")
  test.ok(true, "nothing exploded")
  test.done()

exports.defaultSubscribersForAnEventIsUndefined = (test) ->
  test.expect(1)
  eventBus.reset()
  result = eventBus.subscribers["my.event"]
  test.ok(result == undefined)
  test.done()

exports.eventBusShouldBeDefined = (test) ->
  test.expect(1)
  test.ok(eventBus, "the event bus should exist")
  test.done()

exports.helloTest = (test) ->
  test.expect(1)
  test.ok(true, "this test should pass")  
  test.done()


exports.subscribersCanBeAddedToTheEventBus = (test) ->
  test.expect(1)
  eventBus.reset()
  eventBus.subscribe("my.event", () -> )
  test.ok(true)
  test.done()

exports.subscribingToAnEventShouldPublishASubscriptionNotification = (test) ->
  test.expect(1)
  eventBus.reset()
  notified = false
  eventBus.subscribe("EventBus.subscribed", -> notified = true)
  test.ok(notified)
  test.done()

exports.unsubscribingShouldPublishUnsubscribeNotification = (test) ->
  test.expect(1)
  eventBus.reset()
  notified = false
  eventBus.subscribe("EventBus.unsubscribed", -> notified = true)
  eventBus.subscribe("my.event", -> )
  eventBus.unsubscribe("my.event")
  test.ok(notified)
  test.done()

  
