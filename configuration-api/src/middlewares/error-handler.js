/* eslint-disable no-unused-vars */

module.exports = (err, req, res, next) => {
    if(!err.internal){
        const { status, message } = err;
        res.json({ status, message });
    } else {
        res.json({ status: 500, message: 'something went wrong' });
    }
};