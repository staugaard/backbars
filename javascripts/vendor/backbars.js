//adds support in handlebars to use model.get('name') for attribute lookup
var defaultNameLookup = Handlebars.JavaScriptCompiler.prototype.nameLookup;
Handlebars.JavaScriptCompiler.prototype.nameLookup = function(parent, name, type) {
  if (type = 'context') {
    return "(" + parent + " instanceof Backbone.Model ? " + parent + ".get('" + name + "') : " + defaultNameLookup(parent, name, type) + ")";
  } else {
    return defaultNameLookup(parent, name, type);
  };
};

Handlebars.registerHelper('view', function(viewClassName, block, a) {
  var options = {
    context: this
  };
  var viewConstructor;

  if (_.isFunction(viewClassName)) {
    viewConstructor = Backbone.HandlebarsView;
    options.template = viewClassName;
  } else {
    viewConstructor = eval(viewClassName);
    options.template = block;
  };

  var hashArgs = options.template.hash;

  var view = new viewConstructor(options);

  if (hashArgs.binding) {
    hashArgs.binding.bind('change', view.render);
  };
  
  return view.renderToString();
});

Handlebars.registerHelper('collection', function(context, block) {
  var options = {
    context: context,
    template: block,
    bindToItemChange: false
  };

  if (block.hash.itemView) {
    options.itemView = eval(block.hash.itemView);
  } else {
    options.itemView = Backbone.HandlebarsView;
    options.bindToItemChange = true;
  };

  if (block.hash.itemTagName) {options.itemTagName = block.hash.itemTagName};

  var collectionView = new Backbone.HandlebarsCollectionView(options);

  return collectionView.renderToString();
});

Backbone.HandlebarsView = Backbone.View.extend({
  initialize : function(options) {
    this.prepareForBinding(options);

    this.context  = options.context || this.context;
    this.tagName  = options.tagName || this.tagName;
    this.template = options.template || this.template;
    this.template = _.isFunction(this.template) ? this.template : templates[this.template];
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
    if (this.context && this.context.cid) {
      content.push(' data-cid="' + this.context.cid + '"');
    };
    content.push('>');
    content.push(this.render());
    content.push("</" + this.tagName + ">");
    return content.join('');
  },

  render: function() {
    var content = this.template(this.context);
    $(this.el).html(content);
    return content;
  }
});

$.fn.render = function(templateName, context) {
  var viewArgs = _.extend(context, {
    template: templateName,
    el: this
  });

  (new Backbone.HandlebarsView(viewArgs)).render();
}

Backbone.HandlebarsCollectionView = Backbone.HandlebarsView.extend({
  initialize: function(options) {
    this.prepareForBinding(options);

    this.context  = options.context || this.context;
    if (!(this.context instanceof Backbone.Collection)) {
      throw new Error("HandlebarsCollectionView must be passed a Backbone.Collection as it's context");
    };

    this.addModel    = _.bind(this.addModel, this);
    this.removeModel = _.bind(this.removeModel, this);

    this.itemView = options.itemView || this.itemView;
    this.itemTagName = options.itemTagName || 'li',
    this.template = options.template;
    this.bindToItemChange = options.bindToItemChange;

    this.context.bind('refresh', this.render);
    this.context.bind('add',     this.addModel);
    this.context.bind('remove',  this.removeModel);
  },

  _newItemView: function(model) {
    var newItemView = new (this.itemView)({
      context: model,
      template: this.template,
      tagName: this.itemTagName
    });

    if (this.bindToItemChange) {
      model.bind('change', newItemView.render);
    };

    return newItemView;
  },

  render: function() {
    var view;
    var id;
    var content = _.map(this.context.models, function(model) {
      return this._newItemView(model).renderToString();
    }, this).join('');

    $(this.el).html(content);
    return content;
  },

  addModel: function(model) {
    $(this.el).append(this._newItemView(model).renderToString());
  },

  removeModel: function(model) {
    $('[data-cid=' + model.cid + ']').unbind().remove();
  }
});
