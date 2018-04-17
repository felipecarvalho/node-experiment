const express = require('express');
const nunjucks = require('nunjucks');
const moment = require('moment');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

const checkMiddleware = (req, res, next) => {
  const { name } = req.query;
  if (name.length === 0) {
    return false;
  }
  next();
};

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { name, birthday } = req.body;
  const age = moment().diff(moment(birthday, 'DD/MM/YYYY'), 'years');

  if (age > 18) {
    res.redirect(`/major?name=${name}`);
  } else {
    res.redirect(`/minor?name=${name}`);
  }
});

app.get('/major', checkMiddleware, (req, res) => {
  const { name } = req.query;
  res.render('major', { name });
});

app.get('/minor', checkMiddleware, (req, res) => {
  const { name } = req.query;
  res.render('minor', { name });
});

app.listen(3308);
