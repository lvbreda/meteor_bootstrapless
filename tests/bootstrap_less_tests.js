
Tinytest.add("bootstrap less - presence", function(test) {

  var d = OnscreenDiv(Meteor.render(function() {
    return '<div class="well">hello</div>'; }));
  d.node().style.display = 'block';

  var p = d.node().firstChild;

  var leftBorder = getStyleProperty(p, 'border-top-left-radius');
  test.equal(leftBorder, "4px");

  d.kill();

});

