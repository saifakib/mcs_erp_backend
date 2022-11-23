const oracledb = require("oracledb");
require("dotenv").config();

// config
oracledb.initOracleClient({ libDir: process.env.INSTACLIENT });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

// db connection config
const storeConfig = {
  user: process.env.NODE_ORACLE_STORE_DB_USER,
  password: process.env.NODE_ORACLEDB_STORE_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
};

const hrConfig = {
  user: process.env.NODE_ORACLE_HR_DB_USER,
  password: process.env.NODE_ORACLEDB_HR_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
};

// creating store_pool
function storePoolConnection() {
  return new Promise(async function (resolve, reject) {
    try {
      const pool = await oracledb.createPool({
        ...storeConfig,
        poolAlias: "store",
      });
      pool.reconfigure({ poolMin: 1, poolMax: 10, poolTimeout: 2000000 });
      resolve(pool);
    } catch (error) {
      reject(error);
    }
  });
}
// initializing
storePoolConnection();

// creating hr_pool
function hrPoolConnection() {
  return new Promise(async function (resolve, reject) {
    try {
      const pool = await oracledb.createPool({
        ...hrConfig,
        poolAlias: "hr",
      });
      pool.reconfigure({ poolMin: 1, poolMax: 10, poolTimeout: 2000000 });
      resolve(pool);
    } catch (error) {
      reject(error);
    }
  });
}
// initializing
hrPoolConnection();

module.exports = { oracledb };
