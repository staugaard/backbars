//adds support in handlebars to use model.get('name') for attribute lookup
var defaultNameLookup = Handlebars.JavaScriptCompiler.prototype.nameLookup;
Handlebars.JavaScriptCompiler.prototype.nameLookup = function(parent, name, type) {
  if (type = 'context') {
    return "(" + parent + " instanceof Backbone.Model ? " + parent + ".get('" + name + "') : " + defaultNameLookup(parent, name, type) + ")";
  } else {
    return defaultNameLookup(parent, name, type);
  };
};

var templates = {
  'user_details': Handlebars.compile($("#user_details_template").html()),
  'user_list':    Handlebars.compile($("#user_list_template").html())
}

Handlebars.registerHelper('view', function(viewName, block) {
  var viewConstructor = _.isFunction(viewName) ? viewName : eval(viewName);
  var view = new viewConstructor({
    model: this,
    collection: this.collection,
    template: block
  });

  return view.renderToString();
});

Handlebars.registerHelper('collection_view', function(modelViewName, block) {
  var collectionView = new Backbone.HandlebarsCollectionView({
    modelView: eval(modelViewName),
    collection: this.collection,
    template: block
  })

  return collectionView.renderToString();
});

Backbone.HandlebarsView = Backbone.View.extend({
  initialize : function(options) {
    this.prepareForBinding(options);

    this.template = options.template || this.template;
    this.template = _.isFunction(this.template) ? this.template : templates[this.template];
 
    if (this.model) {
      this.model.bind('change', this.render);
    };
  },

  //we no not want backbone to create an new wrapper element, as handlebars just deals with strings
  _ensureElement: function() {},

  prepareForBinding: function(options) {
    this.render         = _.bind(this.render, this);
    this.renderToString = _.bind(this.renderToString, this);
    if (!this.el) {
      this.id = _.uniqueId('bb_view');
      this.el = '#' + this.id;
    };
  },

  renderToString: function() {
    var content = [];
    content.push("<" + this.tagName + ' id="' + this.id + '"');
    if (this.className) {
      content.push(' class="' + this.className + '"');
    };
    if (this.model && this.model.cid) {
      content.push(' data-cid="' + this.model.cid + '"');
    };
    content.push('>');
    content.push(this.render());
    content.push("</" + this.tagName + ">");
    return content.join('');
  },

  render: function() {
    var content = this.template(this.model || {collection: this.collection});
    $(this.el).html(content);
    return content;
  }
});

Backbone.HandlebarsCollectionView = Backbone.HandlebarsView.extend({
  initialize: function(options) {
    this.prepareForBinding(options);
    this.addModel    = _.bind(this.addModel, this);
    this.removeModel = _.bind(this.removeModel, this);

    this.modelView = options.modelView || this.modelView;
    this.template = options.template;

    this.collection.bind('add',    this.addModel);
    this.collection.bind('remove', this.removeModel);
  },

  render: function() {
    var view;
    var id;
    var content = _.map(this.collection.models, function(model) {
      view = new (this.modelView)({ model: model, template: this.template });
      return view.renderToString();
    }, this).join('');
    
    $(this.el).html(content);
    return content;
  },

  addModel: function(model) {
    view = new (this.modelView)({ model: model, template: this.template });
    $(this.el).append(view.renderToString());
  },

  removeModel: function(model) {
    $('[data-cid=' + model.cid + ']').unbind().remove();
  }
});
