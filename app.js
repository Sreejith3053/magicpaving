var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer =require('nodemailer');

var router = express.Router();
var index = require('./routes/index');
var app = express();
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var urlencodedParser = bodyParser.urlencoded({ extended: true })
var nl = (process.platform === 'win32' ? '\r\n' : '\n');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);

app.get('/', function (req,res) {
    res.render('index');

})

//app.get('/contact',function (req,res) {
    //res.render('index',{qs: req.query});

//});
app.post('/contact',urlencodedParser,function (req,res) {
    console.log(req.body);
    console.log("The name is:"+req.body.name);
    console.log("The email is:"+req.body.email);
    console.log("The message is:"+req.body.message);
    res.render('index',{qs: req.query});
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var isError = false;

    if (email) {
        isError = true;
    }
    console.log('\nCONTACT FORM DATA: '+ name + ' '+ email + ' '+ message+'\n');

    // create transporter object capable of sending email using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'magicpavings@gmail.com',
            pass: 'magicpaving!'
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'magicpavings@gmail.com',
        to: 'magicpavings@gmail.com',
        subject: message,
        name: name,
        text:'|| Customer Request name:' + name +
        ' || Customer Request Email address:' + email +
        ' || Customer Request Message:' +message+''
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });



//app.listen(3000);

module.exports = app;