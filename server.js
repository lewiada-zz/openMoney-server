/* I love you Maribel! */
var express = require('express');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bodyParser = require('body-parser');

var app = express();
var url = 'mongodb://lewiada:&ek8IVnPo8*AqwaPoXC2h7s@ds019829.mlab.com:19829/openmoney/checking';


app.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');



// With Mongoose, everything is derived from a Schema. 
// Let's get a reference to it and define our transactions.
var transactionSchema = mongoose.Schema({
    type: String,
    date: Date,
    payee: String,
    amount: Number,
    category: String,
    subcategory: String,
    description: String,
    checkno: Number
    
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

// this code seems to work, but I really don't undersand it!!
// http://psitsmike.com/2012/02/node-js-and-mongo-using-mongoose-tutorial/
var jsonParser = bodyParser.json();
app.post('/api/:account/:transaction', jsonParser, function(req, res) {
    
    if (!req.body) {
        console.log('error');
    } else {
        console.log('my value is: ' + req.body.id);
        console.log('and it\'s type is: ' + req.body.type);
    }
    
    // Good blog read here:
    // https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1
    var db = mongoose.connection;
    mongoose.connect('mongodb://lewiada:&ek8IVnPo8*AqwaPoXC2h7s@ds019829.mlab.com:19829/openmoney', function (err) {
        if (err) console.log(err);
    });
    
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        
        var transaction_data = {
            type: req.body.type,
            date: req.body.date,
            payee: req.body.payee,
            amount: req.body.amount,
            category: req.body.category,
            subcategory: req.body.subcategory,
            description: req.body.description,
            checkno: req.body.checkno
        };

        var transaction = new Transaction(transaction_data);        
        transaction.save(function(error, data) {
            if(error){
                mongoose.connection.close();
                res.json(error);
            }
            else{
                mongoose.connection.close();
                res.json(data);
            }
        });
    });
});


/****************************************** READ ******************************************/

// http://theholmesoffice.com/mongoose-and-node-js-tutorial
// TODO: build the JSON to return to client
app.get('/api/:account', function (req, res) {
    
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;
    
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
});


// BUG: { [Error: Trying to open unclosed connection.] state: 2 }
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