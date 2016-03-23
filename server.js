/*
 * This is my first real node.js program.  It is a very simple program which implements a
 * Web-based OIDC client that allows the user to login with a Google id_token and then uses
 * the Google access_token to get the user's profile and finally (upon logon) displays the
 * user's human name, email address, avatar, and unique subject identifier.
 *
 * To implement this simple program, I used a number of useful node modules, including:
 * express, querystring, request, and ejs.  
 *
 * express --> makes things like routing, writing APIs, and working with HTTP easier
 * mongojs --> https://www.npmjs.com/package/mongojs
 *
 *
 * Collections:
 *  - accounts
 *  - transactions
 *
 */


var express = require('express');
var mongodb = require('mongodb');
var app = express();
var url = 'mongodb://lewiada:&ek8IVnPo8*AqwaPoXC2h7s@ds019829.mlab.com:19829/openmoney';


app.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// begin on the 'home page'
app.get('/', function(req, res) {
    res.render('index');
});

/****************************************** CREATE ******************************************/
app.post('/api/:account', function(req, res) {
    
    // Good blog read here:
    // https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1
});


/****************************************** READ ******************************************/

// get all transactions in an account
app.get('/api/:account', function (req, res) {
        
    // query for all documents in a collection
    var getTransactions = function(db, callback) {
        var cursor = db.collection(req.params.account).find();
        var str ='';
        
        cursor.each(function(err, doc) {            
            if (doc != null) {
                console.dir(doc._id.toString());
                str += '<a href=http://localhost:3000/api/checking/' + doc._id.toString() + '>' + doc.description + '</a><br>';
            } else {
                res.send(str);
                callback();
            }
        });        
    };
    
    // call the getTransactions function.
    mongodb.MongoClient.connect(url, function(err, db) {                
        getTransactions(db, function() {
            db.close();
        });
    });    
});

// get a specific transaction
app.get('/api/:account/:transaction', function(req, res) {
    
    // query for specified documents in a collection
    var getTransaction = function(db, callback) {
        
        db.collection('checking', function(err, collection) {            
            collection.findOne({ '_id': mongodb.ObjectID(req.params.transaction) }, function(err, item) {                
                if (item !=null) {
                    res.send(item);
                } else {
                    res.send('null');
                }
            });
        });        
        //callback();
    };
    
    // call the getTransaction function.
    mongodb.MongoClient.connect(url, function(err, db) {                
        getTransaction(db, function() {
            db.close();
        });
    });
});

// get fixed number of transactions from index
app.get('/api', function (req, res) {

    // what is diff between res.send and res.render?
    res.send('getting <b>' + req.query.num + '</b> transactions from the current index ...');
});


/****************************************** UPDATE *****************************************/
app.put('/collection/document', function(req, res) {
});

/****************************************** DELETE *****************************************/
app.delete('/collection/document', function(req, res) {
});