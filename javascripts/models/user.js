var User = Backbone.Model.extend({
  url: function() { return "/users/" + this.id }
});

var UserCollection = Backbone.Collection.extend({
  url: '/users',
  model: User
});