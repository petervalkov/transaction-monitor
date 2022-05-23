# Transaction monitor

Rule based system for monitoring transactions on the Ethereum blockchain. Consists of two separate applications:

* Configuration API - provides basic CRUD operations for creation and modification of the monitoring rules

* Monitor service - checks the transactions of each new block and stores them when a match is found

Transactions can be monitored based on the sender `from`, receiver `to`, type `type` and minimum/maximum `minValue`/`maxValue` amount. Each rule should have at least one property defined and a transaction should have ALL properties of the rule to be considered a match. When a new configuration is created it gets loaded automatically as the current rule of the monitor.
## Installation
Both applications require .env file in their main directories.
```
└── transaction-monitor
    ├── configuration-api
    │   └── .env
    └── monitor-service
        └── .env
```
The applications use two different mongoDB instances but for testing purposes the same connection string can be used.

#### Configuration API 
Requires `ENVIRONMENT`, `PORT`, `DB_CONNECTION` and `MONITOR_ADDRESS`

 `MONITOR_ADDRESS` - should include the port and **/monitor/load** (unfortunately)
##### Example
```
ENVIRONMENT=development
PORT=5000
DB_CONNECTION=mongodb+srv://<username>:<password>@cluster0.dd77g.mongodb.net/
MONITOR_ADDRESS=http://localhost:3000/monitor/load
```


#### Monitor service 
Requires `ENVIRONMENT`, `PORT`, `DB_CONNECTION` and `ENDPOINT`

 `ENDPOINT` - The endpoint for the Ethereum node provider
##### Example 
```
ENVIRONMENT=development
PORT=3000
DB_CONNECTION=mongodb+srv://<username>:<password>@cluster0.dd77g.mongodb.net/
ENDPOINT=wss://kovan.infura.io/ws/v3/97d66asdfkjh4c14b6fsd096c55d1e01
```

Based on the `ENVIRONMENT` variable different logging methods are used. Possible values are `development` and `production`

To start the application
```
npm run dev
```
or
```
npm run prod
```

## Configuration API

### Endpoints

`GET /config/`

`GET   /config/:id`

`POST  /config/`

`PATCH /config/:id`

`DELETE /config/:id`

### Request example
```
{
    "from": "0x818B8982C8635e20d6c0DefaC0e94D88d9032D57",
    "to": "0x5541651F7Fb33056e7Ec9ED2E167A3338548676D",
    "minValue": 1000,
    "maxValue": 1000000,
    "type": 2
}
```

### Response example
```
{
    "status": 200,
    "message": "Configuration created",
    "configuration": {
        "from": "0x818B8982C8635e20d6c0DefaC0e94D88d9032D57",
        "to": "0x5541651F7Fb33056e7Ec9ED2E167A3338548676D",
        "minValue": 1000,
        "maxValue": 1000000,
        "type": 2,
        "_id": "628b1bf13a1a154e2135fafc",
        "createdAt": "2022-05-23T05:30:25.286Z",
        "updatedAt": "2022-05-23T05:30:25.286Z",
        "__v": 0
    }
}
```
If the monitor service is not responding configuration will be saved anyway but will not be loaded for monitoring

```
{
    "message": "Monitor is not responding",
    "configuration": {
        "from": "0x818B8982C8635e20d6c0DefaC0e94D88d9032D57",
        "_id": "628b1e283a1a154e2135fafe",
        "createdAt": "2022-05-23T05:39:52.788Z",
        "updatedAt": "2022-05-23T05:39:52.788Z",
        "__v": 0
    }
}
```

