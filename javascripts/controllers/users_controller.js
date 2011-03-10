var UsersController = Backbone.Controller.extend({
  routes: {
    "":          "index",
    "users":     "index",
    "users/:id": "show"
  },

  index: function() {
    this.users = new UserCollection();

    this.users.fetch({
      success: function(collection) {
        var view = new UserListView({collection: collection});
        view.render();
      }
    });
  },

  _showUser: function(user) {
    var view = new UserDetailsView({model: user});
    view.render();
  },

  show: function(id) {
    var user;
    if (this.users && (user = this.users.get(id))) {
      this._showUser(user);
    } else {
      (new User({id: id})).fetch({ success: this._showUser })
    };
  }
});