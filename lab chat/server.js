const express = require('express');
const http = require('http');
const path = require('path');

const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);

initSocket(server);

const store = require('./store');
const restRouter = require('./rest');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/items', restRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('http://localhost:' + PORT);
});