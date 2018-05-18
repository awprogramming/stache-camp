const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://ariewolf:carling1234@ds229130-a0.mlab.com:29130,ds229130-a1.mlab.com:29130/stache-camp?replicaSet=rs-ds229130'; // Databse URI and database name
  process.env.databaseName = 'stache-camp'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://localhost:27017/stache-camp'; // Databse URI and database name
  process.env.databaseName = 'stache-camp'; // Database name
}