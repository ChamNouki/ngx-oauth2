const path = require('path');
const fs = require('fs');
const jsonServer = require('json-server');
const jwt = require('express-jwt');

const server = jsonServer.create();

const publicKey = fs.readFileSync(path.join(__dirname, 'public.pub'));
server.use(jwt({
  secret: publicKey,
  algorithms: ['RS256']
}));

const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

const router = jsonServer.router(path.join(__dirname, 'db.json'));
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
