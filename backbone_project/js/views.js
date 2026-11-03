var ViewItem = Backbone.View.extend({
    tagname: 'li',

    template: _.template("<strong><%= name %></strong>: <%= value %>"),

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});