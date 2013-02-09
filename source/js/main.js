var App = Ember.Application.create();
App.ApplicationController = Ember.Controller.extend({
});

App.Router.map(function() {
  this.resource('users', function() {});
});

App.UsersRoute = Ember.Route.extend({
  model: function() {
    return App.User.find();
  },
  setupController: function(controller, model) {
    controller.set('content', model);
  }
});

App.Store = DS.Store.extend({
  revision: 11,
  adapter: DS.RESTAdapter.create({
    ajax: function(url, type, hash) {
      // awful hack to override embers lovely defaults, blame github
      hash.url = 'https://api.github.com/legacy/user/search/baltimore';
      hash.type = type;
      hash.dataType = 'json';
      hash.contentType = 'application/json; charset=utf-8';
      hash.context = this;

      if (hash.data && type !== 'GET') {
        hash.data = JSON.stringify(hash.data);
      }

      jQuery.ajax(hash);
    }
  })
});

var attr = DS.attr;
App.User = DS.Model.extend({
  created: attr('date'),
  login: attr('string'),
  location: attr('string'),
  fullname: attr('string'),
  username: attr('string'),
  followersCount: attr('number'),
  followers: attr('number'),
  publicRepoCount: attr('number'),
  repos: attr('number'),
});
