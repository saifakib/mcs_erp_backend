const commitConnect = (connection) => { return connection.commit(); }
const rollbackConnect = (connection) => { return connection.rollback(); }
const randConnect = (connection) => { return connection; }


module.exports = {
    commitConnect,
    rollbackConnect,
    randConnect
}