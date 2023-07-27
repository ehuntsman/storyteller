const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFile = path.resolve(__dirname, '../.env');
const envVars = dotenv.parse(fs.readFileSync(envFile));

module.exports = () => envVars;