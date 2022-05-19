const router = require('express').Router();
const configuration = require('./controllers/configuration');
const Validator = require('./middlewares/Validator');

router.get('/', configuration.findAll);
router.get('/:id', configuration.find);
router.post('/create', Validator('configSchema'), configuration.create);
router.patch('/update/:id', configuration.update);
router.delete('/:id', configuration.remove);

module.exports = router;