var App = {};
_.templateSettings = {interpolate :/\{\{(.+?)\}\}/g};

App.User = Backbone.Model.extend({
  parse: function(resp, options) {
    return _.omit(resp, ['id']);
  }
});

App.UserCollection = Backbone.Collection.extend({
  model: App.User,
  url: 'https://api.github.com/legacy/user/search/baltimore',
  parse: function(results) {
    return results.users;
  },
  comparator: function(user) {
    return -user.get('followers_count');
  }
});

App.UserListingView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#user_listing_template').html()),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

App.UsersView = Backbone.View.extend({
  id: 'users_list',
  el: $('#users_list'),
  render: function() {
    _.each(this.collection, function(user) {
      var userView = new App.UserListingView({model: user});
      this.$el.append(userView.render().el);
    }, this);
    return this;
  }
});

$(document).ready(function() {
  var allUsers = new App.UserCollection;
  var renderUsers = function(collection, response, options) {
    var usersView = new App.UsersView({collection: collection.models});
    usersView.render();
  };
  allUsers.fetch({success: renderUsers});
});
