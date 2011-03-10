Handlebars.registerHelper('view', function(viewName, block, a, b, c) {
  var viewConstructor = eval(viewName);
  var view = new viewConstructor({
    model: this._model,
    collection: this._collection,
    childViews: this._view.childViews,
    template: block
  });

  var id = _.uniqueId('bb_view');
  view.el = "#" + id;

  this._view.childViews.push(view);

  var placeHolder = "<" + view.tagName + ' id="' + id + '"';
  if (view.className) {
    placeHolder = placeHolder + ' class="' + view.className + '"';
  };
  placeHolder = placeHolder + "></" + view.tagName + ">";

  return placeHolder;
});

var templates = {
  'user_details':   Handlebars.compile($("#user_details_template").html()),
  'user_list':      Handlebars.compile($("#user_list_template").html())
}

Backbone.HandlebarsView = Backbone.View.extend({
  initialize : function(options) {
    var template = options.template || this.template;
    this.template = _.isFunction(template) ? template : templates[template];
    
    this.render = _.bind(this.render, this);
 
    if (this.model) {
      this.instance = this.model;
      this.model.bind('change', this.render);
    } else if (this.collection) {
      this.instance = this.collection;
    };

    if (options.childViews) {
      this.childViews = options.childViews;
      this.isRootView = false;
    } else {
      this.childViews = [];
      this.isRootView = true
    };
  },

  toHandlebarsViewObject: function() {
    return this.instance.toHandlebarsViewObject(this);
  },

  render: function() {
    $(this.el).html(this.template(this.toHandlebarsViewObject()));
    if (this.isRootView) {
      _.each(this.childViews, function(view) { view.render(); });
    };
    return this;
  }
});
