var Task = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false,
        priority: 'medium'
    }
});

var TaskList = Backbone.Collection.extend({
    model: Task
});