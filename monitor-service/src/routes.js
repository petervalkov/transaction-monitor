const router = require('express').Router();
const monitor = require('./controllers/monitor');

router.post('/load', monitor.load);
router.get('/unload', monitor.unload);

module.exports = router;