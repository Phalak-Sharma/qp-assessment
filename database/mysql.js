const mysql                                   = require('mysql2');
const config                                  = require('../config/config');
exports.initializeConnectionPool            = initializeConnectionPool;
exports.mysqlQueryPromise                   = mysqlQueryPromise;

function initializeConnectionPool() {
    return new Promise((resolve, reject) =>{
      console.log('CALLING INITIALIZE POOL');
      var numConnectionsInPool = 0;
      var conn = mysql.createPool(config.db);
      conn.on('connection', function (connection) {
        numConnectionsInPool++;
        console.log('NUMBER OF CONNECTION IN POOL : ', numConnectionsInPool);
      });
      return resolve(conn);
    });
}

function mysqlQueryPromise(apiReference, event, queryString, params, noErrorlog) {
    return new Promise((resolve, reject) => {
      if (!apiReference) {
        apiReference = {
          module: "mysqlLib",
          api   : "executeQuery"
        }
      }
      const query = connection.query(queryString, params, function (sqlError, sqlResult) {
        if (sqlError || !sqlResult) {
          if (sqlError) {
            console.log('QUERY ERROR : ', queryString, params, sqlError);
            // mysqlErrorAlert(apiReference, {
            //   values : params,
            //   query : query.sql,
            //   error : sqlError,
            //   event : event
            // });
            if (!noErrorlog) {
              console.log(sqlError);
            }
            if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED' || sqlError.code === 'ER_NO_SUCH_TABLE') {
              setTimeout(module.exports.mysqlQueryPromise.bind(null, apiReference, event, queryString, params), 50);
            } else {
              return reject({ERROR: "INVALID_ACCESS", EVENT: event});
            }
          }
        }
        return resolve(sqlResult);
      });
    });
}