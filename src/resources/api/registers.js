if (process.env.NODE_ENV === 'production') {
    module.exports = require('./registers.prod');
  } else {
    module.exports = require('./registers.dev');
  }
  