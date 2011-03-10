_.extend(Backbone.Model.prototype, {
  toHandlebarsViewObject: function(view) {
    var handlebarsViewObject = this.toJSON();
    handlebarsViewObject._model = this;
    if (view) {
      handlebarsViewObject._view = view;
    };
    return handlebarsViewObject;
  }
});

_.extend(Backbone.Collection.prototype, {
  toHandlebarsViewObject: function(view) {
    var handlebarsViewObject = {collection: _.map(this.models, function(model) { return model.toHandlebarsViewObject(view); })};
    handlebarsViewObject._collection = this;
    if (view) {
      handlebarsViewObject._view = view;
    };
    return handlebarsViewObject;
  }
});


