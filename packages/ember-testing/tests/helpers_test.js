var App,
    has = {}.hasOwnProperty;

module("ember-testing", {
  teardown: function() {
    Ember.run(App, App.destroy);
    App.removeTestHelpers();
    App = null;
  }
});

test("Ember.Application#injectTestHelpers/#removeTestHelpers", function() {
  App = Ember.run(Ember.Application, Ember.Application.create);
  ok(!window.visit);
  ok(!App.testHelpers.visit);
  ok(!window.click);
  ok(!App.testHelpers.click);
  ok(!window.fillIn);
  ok(!App.testHelpers.fillIn);
  ok(!window.wait);
  ok(!App.testHelpers.wait);

  App.injectTestHelpers();

  ok(window.visit);
  ok(App.testHelpers.visit);
  ok(window.click);
  ok(App.testHelpers.click);
  ok(window.fillIn);
  ok(App.testHelpers.fillIn);
  ok(window.wait);
  ok(App.testHelpers.wait);

  App.removeTestHelpers();

  ok(!has.call(window, 'visit'));
  ok(!has.call(App.testHelpers, 'visit'));
  ok(!has.call(window, 'click'));
  ok(!has.call(App.testHelpers, 'click'));
  ok(!has.call(window, 'fillIn'));
  ok(!has.call(App.testHelpers, 'fillIn'));
  ok(!has.call(window, 'wait'));
  ok(!has.call(App.testHelpers, 'wait'));
});

test("Ember.Application#setupForTesting", function() {
  Ember.run(function() {
    App = Ember.Application.create();
    App.setupForTesting();
  });

  equal(App.__container__.lookup('router:main').location.implementation, 'none');
});

test("Ember.Test.registerHelper/unregisterHelper", function() {
  expect(3);
  var appBooted = false;

  Ember.Test.registerHelper('boot', function(app) {
    Ember.run(app, app.advanceReadiness);
    appBooted = true;
    return window.wait();
  });

  Ember.run(function() {
    App = Ember.Application.create();
    App.setupForTesting();
    App.injectTestHelpers();
  });

  ok(window.boot);

  window.boot().then(function() {
    ok(appBooted);
  });

  App.removeTestHelpers();
  Ember.Test.unregisterHelper('boot');

  ok(!has.call(window, 'boot'));
});
