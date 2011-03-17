Backbone.Context = Backbone.Model.extend({
  initialize: function(attributes, options) {
  }
})

var UsersController = Backbone.Controller.extend({
  routes: {
    "":          "index",
    "users":     "index",
    "users/:id": "show"
  },

  initialize: function(options) {
    this.context = new Backbone.Context();
    this.context.set({ users: new UserCollection() });
  },

  index: function() {
    this.context.get('users').fetch();
  },

  show: function(id) {
    var self = this;
    var collection = this.context.get('users');
    var user = collection.get(id);
    if (!user) {
      user = new User({ id: id });
      user.fetch();
    };
    this.context.set({user: user});
  }
});