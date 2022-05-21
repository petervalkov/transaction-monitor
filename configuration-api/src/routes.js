const router = require('express').Router();
const inputValidator = require('./middlewares/input-validator');
const configuration = require('./controllers/configuration');

router.post('/create', inputValidator('configuration'), configuration.create);
router.patch('/:id', inputValidator('configuration'), configuration.update);
router.delete('/:id', configuration.remove);
router.get('/:id', configuration.find);
router.get('/', configuration.findAll);

module.exports = router;