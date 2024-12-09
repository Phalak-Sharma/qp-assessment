const bodyParser                             = require('body-parser');
const express                                = require('express');
const cors                                   = require('cors');
config                                     = require('config');
const database = require('./database/mysql');
const http               = require('http') 

var app                                    = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.app = app;
require('./admin');
require('./users');
// const connection          = yield database.initializeConnectionPool();
// global.connection = connection;
// app.listen(() => {
//     return new Promise((resolve, reject) => {
//         var server = http.createServer(app).listen(8000, function () {
//           console.error("###################### Express connected ##################", 8000, 'config');
//           resolve(server);
//         });
//       });
// })

(async () => {
    try {
      // Initialize database connection
      const connection = await database.initializeConnectionPool();
      global.connection = connection;
      
      // Start the server
      const server = http.createServer(app).listen(8000, () => {
        console.log("###################### Express connected ##################", 8000, 'config');
      });
  
    } catch (err) {
      console.error('Error initializing the database connection:', err);
    }
  })();