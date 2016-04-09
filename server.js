var express = require('express');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var app = express();
var url = 'mongodb://lewiada:&ek8IVnPo8*AqwaPoXC2h7s@ds019829.mlab.com:19829/openmoney/checking';


app.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');



// With Mongoose, everything is derived from a Schema. 
// Let's get a reference to it and define our transactions.
var transactionSchema = mongoose.Schema({
    payee: String,
    date: Date
}, {collection: 'checking'});

// enable pagination
transactionSchema.plugin(mongoosePaginate);

// compile our schema into a Model
var Transaction = mongoose.model('Transaction', transactionSchema);



// begin on the 'home page'
app.get('/', function(req, res) {
    res.render('index');
});


/****************************************** CREATE ******************************************/
app.post('/api/:account/:transaction', function(req, res) {
    
    // Good blog read here:
    // https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1
});


/****************************************** READ ******************************************/

// do it the mongoose way!
// http://theholmesoffice.com/mongoose-and-node-js-tutorial
// get fixed number of transactions, 25 by default
// TODO: this current gets all transactions, change to number
// TODO: build the JSON to return to client (current returns HTML)
app.get('/api/:account', function (req, res) {
    
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;
    
    console.log(limit);
    console.log(offset);
    
    // open a connection to the 'openmoney' database at mongolabs
    mongoose.connect('mongodb://lewiada:&ek8IVnPo8*AqwaPoXC2h7s@ds019829.mlab.com:19829/openmoney', function (err) {
        if (err) console.log(err);
    });
    
    // We have a pending connection to the 'openmoney' database running on mongolabs. 
    // We now need to get notified if we connect successfully or if a connection error occurs
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {        
        Transaction.paginate({}, { offset: offset, limit: limit }, function(err, transactions) {
            if (err) {
                mongoose.connection.close();                
                res.send('FAIL');
            } else {
                mongoose.connection.close();
                res.send(transactions);
            }            
        });
    });
    
    
        // result.docs 
        // result.total 
        // result.limit
        // result.offset
});


app.get('/api/:account/:transaction', function(req, res) {
    
    // open a connection to the 'openmoney' database at mongolabs
    mongoose.connect('mongodb://lewiada:&ek8IVnPo8*AqwaPoXC2h7s@ds019829.mlab.com:19829/openmoney', function (err) {
        if (err) console.log(err);
    });
    
    // We have a pending connection to the 'openmoney' database running on mongolabs. 
    // We now need to get notified if we connect successfully or if a connection error occurs
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {       
        Transaction.findById(req.params.transaction, function (err, transaction) {
            if (err) {
                mongoose.connection.close();                
                res.send('FAIL');
            } else {
                mongoose.connection.close();
                res.send(transaction);
            }            
        });
    });
});


/****************************************** UPDATE *****************************************/
app.put('/api/:account/:transaction', function(req, res) {
});

/****************************************** DELETE *****************************************/
app.delete('/api/:account/:transaction', function(req, res) {
});