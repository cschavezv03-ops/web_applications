var Contact = Backbone.Model.extend({
    defaults: {
        name: '',
        email: '',
        number: ''
    }
});

var ContactList = Backbone.Collection.extend({
    model: Contact
});