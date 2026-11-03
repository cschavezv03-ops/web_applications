var TaskView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(
        '<div class="task-info">' +
            '<span class="<%= completed ? "done" : "" %>">' +
                '<%- title %>' +
            '</span>' +
            '<span class="priority priority-<%= priority.toLowerCase() %>">' +
                '<%- priority %>' +
            '</span>' +
        '</div>' +
        '<div class="task-actions">' +
            '<button class="complete">Complete</button>' +
            '<button class="delete">Delete</button>' +
        '</div>'
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
        'click #addBtn': 'addTask',
        'click #deleteCompleteBtn': 'deleteCompletedTasks'
    },

    initialize: function() {
    this.collection = new TaskList();

    this.listenTo(this.collection, 'add', this.showTask);

    this.listenTo(
        this.collection,
        'add remove change:completed',
        this.updateCounter
    );

    this.render();
    this.updateCounter();
    },

    render: function() {
        this.$el.html(`
            <h1>Task List</h1>
            <input type="text" id="txtTask" placeholder="Type a task">
            <select id="taskPriority">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
            </select>
            <button id="addBtn">Add Task</button>
            <h2>Task registered</h2>
            <div id="taskCounter">
                <p>Total tasks: <span id="totalTasks">0</span></p>
                <p>Completed: <span id="completedTasks">0</span></p>
                <p>Pending: <span id="pendingTasks">0</span></p>
            </div>
            <ul id="taskList"></ul>
            <button id="deleteCompleteBtn">Delete Completed</button>
            `);
    },

    addTask: function () {
        var title = this.$('#txtTask').val();

        if (title.trim() === '') {
        alert('You must enter a task');
        return;
        }

    var priority = this.$('#taskPriority').val();

        var newTask = new Task({
        title: title,
        completed: false,
        priority: priority
        });

        this.collection.add(newTask);
        this.$('#txtTask').val('');
    },

    deleteCompletedTasks: function() {
        var completedTasks = this.collection.where({ completed: true });
        completedTasks.forEach(function(task) {
            task.destroy();
        });
    },

    showTask: function (task) {
        var view = new TaskView({ model: task });
        this.$('#taskList').append(view.render().el);
    },

    updateCounter: function() {
    var total = this.collection.length;

    var completed = this.collection.where({
        completed: true
    }).length;

    var pending = total - completed;

    this.$('#totalTasks').text(total);
    this.$('#completedTasks').text(completed);
    this.$('#pendingTasks').text(pending);
},
});