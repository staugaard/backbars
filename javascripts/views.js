Handlebars.registerHelper('view', function(viewName, block) {
  var viewConstructor = eval(viewName);
  var view = new viewConstructor({
    model: this._model,
    collection: this._collection,
    template: block
  });

  var id = _.uniqueId('bb_view');
  view.el = "#" + id;

  var placeHolder = "<" + view.tagName + ' id="' + id + '"';
  if (view.className) {
    placeHolder = placeHolder + ' class="' + view.className + '"';
  };
  placeHolder = placeHolder + ">";
  placeHolder = placeHolder += view.render();
  placeHolder = placeHolder + "</" + view.tagName + ">";

  return placeHolder;
});

Handlebars.registerHelper('collection_view', function(viewName, block) {
  var collectionView = new Backbone.HandlebarsCollectionView({
    childView: viewName,
    collection: this._collection,
    template: block
  })

  return _.map(this.collection, function(model) {
    return Handlebars.helpers.view.apply(model, [viewName, block]);
  }).join('');
});

var templates = {
  'user_details':   Handlebars.compile($("#user_details_template").html()),
  'user_list':      Handlebars.compile($("#user_list_template").html())
}

Backbone.HandlebarsCollectionView = Backbone.View.extend({
  initialize: function(options) {
    this.render = _.bind(this.render, this);

    if (options.childView) {
      this.childView = options.childView;
    };
    if (_.isString(this.childView)) {
      this.childView = eval(this.childView);
    };

    this.template = options.template;

    this.collection = options.collection;
    this.collection.bind('add',    this.render);
    this.collection.bind('remove', this.render);
  },

  render: function() {
    var childView;

    var content = _.map(this.collection, function(model) {
      childView = new (this.childView)({ model: model, template: this.template });
      return childView.render();
    });

    content = content.join('');
    $(this.el).html(content);
    return content;
  }
});

Backbone.HandlebarsView = Backbone.View.extend({
  initialize : function(options) {
    var template = options.template || this.template;
    this.template = _.isFunction(template) ? template : templates[template];
    
    this.render = _.bind(this.render, this);
 
    if (this.model) {
      this.model.bind('change', this.render);
    };
  },

  toHandlebarsViewObject: function() {
    return (this.model || this.collection).toHandlebarsViewObject();
  },

  render: function() {
    var content = this.template(this.toHandlebarsViewObject());
    $(this.el).html(content);
    return content;
  }
});
