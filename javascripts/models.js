_.extend(Backbone.Model.prototype, {
  toHandlebarsViewObject: function() {
    var handlebarsViewObject = this.toJSON();
    handlebarsViewObject._model = this;
    return handlebarsViewObject;
  }
});

_.extend(Backbone.Collection.prototype, {
  toHandlebarsViewObject: function() {
    var handlebarsViewObject = {collection: _.map(this.models, function(model) { return model.toHandlebarsViewObject(); })};
    handlebarsViewObject._collection = this;
    return handlebarsViewObject;
  }
});


