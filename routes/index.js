/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'My URL Shortener' , label: "Enter a URL: " });
};
