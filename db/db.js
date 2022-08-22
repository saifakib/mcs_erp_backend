const oracledb = require("oracledb");
require("dotenv").config();

// config
oracledb.initOracleClient({ libDir: "C:\\instantclient_21_3" });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

// db connection config
const config = {
  user: process.env.NODE_ORACLE_DB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
};

function getConnection() {
  return new Promise(async function (resolve, reject) {
    let connection;
    try {
      // connecting
      connection = await oracledb.getConnection(config);
      // response
      resolve(connection);
    } catch (err) {
      // handle error
      reject(err);
    }
  });
}

module.exports = getConnection;
