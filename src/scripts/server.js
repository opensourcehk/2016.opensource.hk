require("babel-core/register");

var express = require('express');

const pathPublic = __dirname + '/../../public';
const pathAssets = __dirname + '/../../public/assets';
const oneDay = 86400000;

var app = express();
app.set('port', process.env.PORT || 5000);

// middlewares to use
app.use('/assets', express.static(pathAssets, { maxAge: oneDay }));
app.use('/', express.static(pathPublic, { maxAge: oneDay }));

app.get('/*', function (req, res) {
})

app.listen(app.get('port'), function() {
  console.log('> server started');
  console.log('');
  console.log('');
});
