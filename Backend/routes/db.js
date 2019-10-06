const {Pool} = require('pg')

exports.pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mail_system',
    password: '58132134',
    port: 5432,
})
  
