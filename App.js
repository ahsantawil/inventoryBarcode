const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const path = require('path');

const { Invest } = require('./models/Invest');
const { response } = require('express');
const { intPayment, verifyPayment } = require('./config/paystack')(request);

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', ejs);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body, ['amount', 'email', 'fullname']);
    form.metadata = {
        fullname: form.fullname
    }

    form.amount *= 100;
    intPayment(form, (error, body) => {
        if (error) {
            console.log(error);
            return;
        }
        response = JSON.parse(body);
        res.redirect(response.data.authorization_url)
    });
});

app.get('/paystack/callback', (req, res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error, body) => {
        if (error) {
            console.log(error);
            return res.redirect('/error');
        }
        response = JSON.parse(body);
        const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.fullname']);
        [reference, amount, email, fullname] = data;
        newInvest = { reference, amount, email, fullname }
        const invest = new Invest(newInvest);
        invest.save().then((invest) => {
            if (!invest) {
                res.redirect('/error');
            }
            res.redirect('/receipt/' + invest._id);
        }).catch((e) => {
            res.redirect('/error');
        });
    });
});

app.get('/receipt/:id', (req, res) => {
    const id = req.params.id;
    Invest.findById(id).then((invest) => {
        if (!invest) {
            res.redirect('/error');
        }
        res.redirect('success.ejs', { invest });
    }).catch((e) => {
        res.redirect('/error')
    });
});

app.get('/error', (req, res) => {
    res.render('error.ejs');
});


app.listen(port, () => {
    console.log(`Running On Port ${port}`)
});