var TaskView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(
        '<span class="<%= completed ? \'done\' : \'\' %>">'
            + '<%= title %>'
            + '</span>'
            + '<button class="complete">Complete</button>'
            + '<button class="delete">Delete</button>'
    ),

    events: {
        'click .complete': 'completeTask',
        'click .delete': 'deleteTask'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    completeTask: function() {
        this.model.set('completed', true);
    },

    deleteTask: function() {
        this.model.destroy();
    }
});

var AppView = Backbone.View.extend({
    el: '#app',

    events: {
        'click #addBtn': 'addTask'
    },

    initialize: function() {
        this.collection = new TaskList();
        this.listenTo(this.collection, 'add', this.showTask);
        this.render();
    },

    render: function() {
        this.$el.html(`
            <h1>Task List</h1>
            <input type="text" id="txtTask" placeholder="Type a task">
            <button id="addBtn">Add</button>
            <h2>Task registered</h2>
            <ul id="taskList"></ul>
            `);
    },

    addTask: function () {
        var title = this.$('#txtTask').val();

        if (title.trim() === '') {
        alert('You must enter a task');
        return;
        }

        var newTask = new Task({
        title: title,
        completed: false
        });

        this.collection.add(newTask);
        this.$('#txtTask').val('');
    },

    showTask: function (task) {
        var view = new TaskView({ model: task });
        this.$('#taskList').append(view.render().el);
    }
});