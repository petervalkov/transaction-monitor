const router = require('express').Router();
const configuration = require('./controllers/configuration');
//const Validator = require('./middlewares/Validator');

router.get('/', configuration.findAll);
router.post('/create', configuration.create);
router.get('/:id', configuration.find);
router.patch('/update/:id', configuration.update);
router.delete('/:id', configuration.remove);

module.exports = router;