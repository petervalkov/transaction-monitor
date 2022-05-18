const router = require('express').Router();
const configuration = require('./controllers/configuration');
const Validator = require('./middlewares/Validator');

router.get('/:id', configuration.get);
router.post('/create', Validator('configSchema'), configuration.create);

module.exports = router;