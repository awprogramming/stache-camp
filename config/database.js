const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports = {
    uri: 'mongodb://localhost:27017/stache-camp',
    //uri: 'mongodb://ariewolf:Carling!123@ds225608.mlab.com:25608/stache-camp', //production
    secret: crypto,
    db: 'stache-camp'
}