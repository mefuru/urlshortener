var MongoClient = require('mongodb').MongoClient;

exports.getURL = function(req, res) {
    var url = req.body.URL;
    if (validateURL(url)) {
        var shortenedExtension = getExtension();
        res.render('created', {shortenedExtension : shortenedExtension});
        addToDB(url, shortenedExtension);
    } else {
        res.render('invalid', {url : url});
    }
};

var getExtension = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

var validateURL = function(textval) {
    var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(textval);
};

var addToDB = function(url, shortenedExtension) {
    MongoClient.connect('mongodb://localhost:27017/url', function(err, db) {
        if(err) throw err;
        var doc = { original : url , extension : shortenedExtension};
        db.collection('map').insert(doc, function(err, inserted) {
            if(err) throw err;
            console.dir("Successfully upserted " + JSON.stringify(inserted)  + " document!");
            return db.close();
        });
    });
};
