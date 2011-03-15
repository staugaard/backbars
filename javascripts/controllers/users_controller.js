var UsersController = Backbone.Controller.extend({
  routes: {
    "":          "index",
    "users":     "index",
    "users/:id": "show"
  },

  index: function() {
    this.collection = new UserCollection();
    $('#left_pane').render('user_list', this);
    this.collection.fetch();
  },

  show: function(id) {
    if (this.collection) {
      this.model = this.collection.get(id)
    };

    if (!this.model) {
      this.model = new User({id: id});
    };

    $('#right_pane').render('user_details', this);
    this.model.fetch();
  }
});