const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://ariewolf:Carling!123@ds225608.mlab.com:25608/stache-camp'; // Databse URI and database name
  process.env.databaseName = 'stache-camp'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://localhost:27017/stache-camp'; // Databse URI and database name
  process.env.databaseName = 'stache-camp'; // Database name
}