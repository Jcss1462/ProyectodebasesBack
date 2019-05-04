module.exports = {
    'proyecto': {
      user  : process.env.NODE_ORACLEDB_USER || "jcss1462",
      password : process.env.NODE_ORACLEDB_PASSWORD || "jcss1462",
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "192.168.1.59/orcl",
      poolMin: 10,
      poolMax: 10,
      poolIncrement: 0
    }
  };