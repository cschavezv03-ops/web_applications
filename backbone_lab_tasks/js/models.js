var Task = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var TaskList = Backbone.Collection.extend({
    model: Task
});