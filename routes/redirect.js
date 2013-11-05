var MongoClient = require('mongodb').MongoClient;
/*
 * Redirect to URL
 */
exports.redirect = function(req, res) {
    var code = req.params.code;
    getOriginalURL(code, function(originalURL){
        if(originalURL) {
            res.redirect(originalURL);
        } else {
            res.render('error', {code : code});
        }
    });
};

var getOriginalURL = function(code, callback) {
    MongoClient.connect('mongodb://localhost:27017/url', function(err, db) {
        if(err) throw err;
        var query = {"extension" : code};
        db.collection('map').findOne(query, function(err, doc) {
            if (!doc || err) {
                console.log(err);
                callback(undefined);
            } else {
                callback(doc.original);
            }
        });
    });
};
