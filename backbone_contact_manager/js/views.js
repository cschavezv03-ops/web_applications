var ContactView = Backbone.View.extend({
    tagName: 'li',

    template: _.template(
        '<div class="contact-info">' +
            '<strong><%- name %></strong>' +
            '<span><%- email %></span>' +
            '<span class="phone"><%- number %></span>' +
        '</div>' +
        '<div class="contact-actions">' +
            '<button class="edit">Update phone number</button>' +
            '<button class="delete">Delete</button>' +
        '</div>'
    ),

    editTemplate: _.template(
        '<div class="contact-info">' +
            '<strong><%- name %></strong>' +
            '<span><%- email %></span>' +
            '<input class="phone-input" type="tel" value="<%- number %>">' +
        '</div>' +
        '<div class="contact-actions">' +
            '<button class="save">Save</button>' +
            '<button class="cancel">Cancel</button>' +
        '</div>'
    ),

    events: {
        'click .edit': 'editPhone',
        'click .save': 'savePhone',
        'click .cancel': 'cancelEdit',
        'click .delete': 'deleteContact'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'remove', this.remove);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editPhone: function() {
        this.$el.html(this.editTemplate(this.model.toJSON()));
        this.$('.phone-input').focus();
    },

    savePhone: function() {
        var number = this.$('.phone-input').val().trim();

        if (number === '') {
            alert('Enter a phone number');
            return;
        }

        this.model.set('number', number);
    },

    cancelEdit: function() {
        this.render();
    },

    deleteContact: function() {
        this.model.collection.remove(this.model);
    }
});

var AppView = Backbone.View.extend({
    el: '#app',

    events: {
        'click #addBtn': 'addContact'
    },

    initialize: function() {
        this.collection = new ContactList();

        this.listenTo(this.collection, 'add', this.showContact);
        this.listenTo(this.collection, 'add remove change', this.saveContacts);

        this.render();
        this.loadContacts();
    },

    render: function() {
        this.$el.html(
            '<h1>Contact Manager</h1>' +
            '<div class="contact-form">' +
                '<input type="text" id="name" placeholder="Name">' +
                '<input type="email" id="email" placeholder="Email">' +
                '<input type="tel" id="number" placeholder="Phone">' +
                '<button id="addBtn">Add Contact</button>' +
            '</div>' +
            '<h2>Contacts</h2>' +
            '<ul id="contactList"></ul>'
        );
    },

    addContact: function() {
        var name = this.$('#name').val().trim();
        var email = this.$('#email').val().trim();
        var number = this.$('#number').val().trim();

        if (name === '' || email === '' || number === '') {
            alert('Complete all the fields');
            return;
        }

        this.collection.add({
            name: name,
            email: email,
            number: number
        });

        this.$('#name, #email, #number').val('');
    },

    showContact: function(contact) {
        var view = new ContactView({ model: contact });
        this.$('#contactList').append(view.render().el);
    },

    saveContacts: function() {
        localStorage.setItem('contacts', JSON.stringify(this.collection.toJSON()));
    },

    loadContacts: function() {
        var contacts = localStorage.getItem('contacts');

        if (contacts) {
            this.collection.add(JSON.parse(contacts));
        }
    }
});
