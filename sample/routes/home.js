
/*global exports*/
 
exports.index = function (request, response) {
  response.redirect('/qunit');
};

exports.qunit = function (request, response) {
  response.render('qunit', { title: "QUnit Tests" });
};

exports.sample = function (request, response) {
  response.render('sample', { title: "Sample Application" });
};
