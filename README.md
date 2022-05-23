# Transaction monitor
Simple monitoring system for Ethereum blockchain transactions. Consists of two applications that can run independently of one another:  
* Configuration API - provides basic CRUD operations for the monitoring rules
* Monitor service - checks all new transactions on the blockchain and stores them if they match the current rule. 
 
Transactions can be monitored based on the sender `from`, receiver `to`, type `type` and minimum/maximum `minValue`/`maxValue` amount.  
## How to run
```
npm install
```
Both applications require .env file
```
transaction-monitor
├── configuration-api
│   └── .env
└── monitor-service
    └── .env
```
`ENVIRONMENT` - possible values for both applications are `development` and `production`  
`DB_CONNECTION` - each application can use its own MongoDB instance but for testing purposes the same connection string can be used for both
##### Configuration API .env
```
ENVIRONMENT=development
PORT=5000
DB_CONNECTION=mongodb+srv://<username>:<password>@cluster0.dd77g.mongodb.net/
MONITOR_ADDRESS=http://localhost:3000/monitor/load
```
`MONITOR_ADDRESS` - should include the port and **/monitor/load** (unfortunately)
##### Monitor service .env
```
ENVIRONMENT=development
PORT=3000
DB_CONNECTION=mongodb+srv://<username>:<password>@cluster0.dd77g.mongodb.net/
ENDPOINT=wss://kovan.infura.io/ws/v3/97d66asdfkjh4c14b6fsd096c55d1e01
```
 `ENDPOINT` - The endpoint for the Ethereum node provider
### Run
```
npm run dev
```
## Configuration API
When a new configuration is created it is sent automatically to the monitor service where it is set as the current rule. Each rule should have at least one property defined
### Endpoints
`GET /config/`  
`GET   /config/:id`  
`POST  /config/`  
`PATCH /config/:id`  
`DELETE /config/:id`    
### Configuration properties
|Property               |Type     |Description  |
|:---                   |:---     |:---         |
|`from` / `to`          | string  |representing 42-character hexadecimal address|  
|`minValue` / `maxValue`| integer |representing the amount of the transaction| 
|`type`                 | integer |representing the type of the contract - possible values 1, 2 and 3|  
### Request
```
{
    "from": "0x818B8982C8635e20d6c0DefaC0e94D88d9032D57",
    "to": "0x5541651F7Fb33056e7Ec9ED2E167A3338548676D",
    "minValue": 1000,
    "maxValue": 1000000,
    "type": 2
}
```
### Response
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
## Monitor service
### On startup  
The monitor service will try to fetch the latest configuration and start listening for new transactions. If no configuration is found the monitor will not connect to the Ethereum network and will be waiting for requests.  
### On load  
When a new rule is received the monitor will store it in the database, set it as the current rule and start checking all new transactions.  
#### Rule properties
|Property               |Type     |Description  |
|:---                   |:---     |:---         |
|`configuration`        | string  |stringified configuration received from the API|  
|`requestedBy`          | string  |id of the configuration received from the API  | 
|`transactions`         | array   |the transactions matching the configuration    |  
### On match 
And if a match is found it will be stored in the database. A transaction is considered a match only if it has **ALL** properties defined in the rule.  
#### Transaction properties
|Property               |Type     |Description  |
|:---                   |:---     |:---         |
|`hash`                 | string  |the hash of the transaction|  
|`configuration`        | string  |id of the configuration that matched the transaction| 
## Libraries
* [web3](https://web3js.readthedocs.io/en/v1.2.11/index.html)
* [express](https://expressjs.com/)
* [mongoose](https://mongoosejs.com/)
* [joi](https://www.npmjs.com/package/joi)
* [axios](https://axios-http.com/)
* [awilix](https://www.npmjs.com/package/awilix)
* [winston](https://github.com/winstonjs/winston)
* [json-rules-engine](https://github.com/CacheControl/json-rules-engine)
