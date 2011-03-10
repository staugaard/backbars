var UserListItemView = Backbone.HandlebarsView.extend({
  tagName : "li",
  className : "user"
});

var UserListView = Backbone.HandlebarsView.extend({
  template: 'user_list',
  el: "#left_pane"
});
