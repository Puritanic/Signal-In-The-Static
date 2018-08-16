# Advanced Node - Notes

**Node is based on:**

-   v8 - Which open source javascript engine built by Google, this executes js code we're writing
-   libuv - C++ open source project that gives node access to the OS file system, networking and it also handles some aspects of concurrency.

Node is officially single threaded, but it's not that simple. Whenever some request comes to our server it gets processed by event loop that contains event loop. But in the background Node uses C++ thread pool that by default have 4 threads (This can also be modified).

Network async operations are usually ignored by Node thread pool and handled by OS.

## Improving Node Performance

This can be achieved with:

-   Using Node in "cluster" mode (recommended)
-   By using worker threads (experimental)

### Cluster mode

Clustering is basically starting up and using multiple node processes (instances). There's always one parent process called cluster manager. The cluster manager is responsible for monitoring the health of the individual instances of our application, that are working in parallel.

```shell
                    |---> Node Server (single thread)
                    |
Cluster Manager ----|---> Node Server (single thread)
                    |
                    |---> Node Server (single thread)
```

The cluster manager doesn't itself doesn't actually execute any application code, it isn't responsible for handling incoming requests and fetching data from the database etc. Instead, the cluster manager is responsible for monitoring the health of the each of these individual instances. CM can start instances, can stop them, can restart them, it can send them data, but it's up to those individual instances to process incoming requests and do things like accessing the DB or handling authentication.

Practical example in [index.js](./index.js).

#### But life is not that simple

Using clusters is not go to recipe for the blazing fast app, it can help but it's not perfect, and there are times when instead of gaining on performance you will actually get worse results than using node in non cluster mode... It's important that we scale number of slave instances to number of physical or logical CPU cores available. An excellent open source library that handles node clusters is [pm2](https://github.com/Unitech/PM2/)

### Webworker threads

More about threads can be found here: https://www.npmjs.com/package/webworker-threads (cool lib, too)

## Redis

```js
var redis = require('redis'),
	client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on('error', function(err) {
	console.log('Error ' + err);
});

client.set('string key', 'string val', redis.print); // Reply: OK
client.hset('hash key', 'hashtest 1', 'some value', redis.print); // Reply: 0
client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print); // Reply: 0
client.hkeys('hash key', function(err, replies) {
	console.log(replies.length + ' replies:'); // 2 replies
	replies.forEach(function(reply, i) {
		console.log('    ' + i + ': ' + reply); //   0: hashtest 1, hashtest 2
	});
	client.quit();
});

// If we want to clean redis storage we can call:

client.flushall();

// If we want to get value from storage:

client.get('string key', () => {});
```

#### Promises instead of callbacks

If you are using node v8 or higher, you can promisify node_redis with util.promisify as in:

```js
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
```

now getAsync is a promisified version of client.get:

```js
// We expect a value 'foo': 'bar' to be present
// So instead of writing client.get('foo', cb); you have to write:
return getAsync('foo').then(function(res) {
	console.log(res); // => 'bar'
});
```

or using async await:

```js
async myFunc() {
    const res = await getAsync('foo');
    console.log(res);
}
```
