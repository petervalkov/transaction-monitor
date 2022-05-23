module.exports = {
    info: {
        dbSuccess: 'Connected to database',
        dbClosed: 'Database connection closed',
        serverStarted: 'Server started. Listening on port %s',
        serverStopped: 'Server stopped',
        configFound: 'Configuration found',
        configCreated: 'Configuration created',
        noConfig: 'No configuration found. Waiting for request...',
        ethSuccess: 'Connected to Ethereum network',
        checking: 'Checking block %d',
        ruleLoaded: 'Rule loaded\n%s',
        trxFound: 'Transaction found %s',
    },
    error: {
        dbFail: 'Connection to db failed',
        notFound: 'Not found',
        internalError: 'Something went wrong',
        ethFailed: 'Connention to Ethereum network failed',
        trxStoreFailed: 'Failed to store transaction %s',
        laodFailed: 'Failed to load configuration %s'
    }
};