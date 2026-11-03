$(function () {
    var MyModel = new Item({ name: 'Pokemon', value: 25 });
    var myView = new ViewItem({ model: MyModel });

    $('#app').html('<ul id="list"></ul>');
    $('#list').append(myView.render().el);
});