module.exports = {
    info: {
        dbSuccess: 'Connected to database',
        dbClosed: 'Database connection closed',
        serverStarted: 'Server started. Listening on port %s',
        serverStopped: 'Server stopped',
        configCreated: 'Configuration created',
        configDeleted: 'Configuration deleted',
        configUpdated: 'Configuration updates'
    },
    error: {
        dbFail: 'Connection to db failed',
        notFound: 'Not found',
        internalError: 'Something went wrong',
        monitorError: 'Monitor is not responding',
        invalidFrom: 'Invalid "from" address',
        invalidTo: 'Invalid "to" address',
        invalidType: 'Invalid type',
        emptyObject: 'Configuration must have at least one property'
    }
};