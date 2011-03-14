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
        $('#left_pane').render('user_list', {collection: collection});
      }
    });
  },

  _showUser: function(user) {
    $('#right_pane').render('user_details', {model: user});
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