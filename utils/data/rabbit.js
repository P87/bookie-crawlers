var config = require('../../config/rabbit');
var amqp = require('amqplib/callback_api');

var Rabbit = {
	save: function(queue, data) {
		amqp.connect(config.server, function(err, conn) {
			if (err) {
				throw 'Error connecting to rabbitmq: ' + err;
			}

			conn.createChannel(function(err, ch) {
				if (err) {
					throw 'Error creating channel to rabbitmq: ' + err;
				}

				var q = config[queue];

				ch.assertQueue(q, {durable: false});
				// Note: on Node 6 Buffer.from(msg) should be used
				ch.sendToQueue(q, new Buffer(data));
			});
			setTimeout(function() { conn.close(); }, 500);
			return true;
		});
	},

	get: function(queue, callback) {
		amqp.connect(config.server, function(err, conn) {
			if (err) {
				throw 'Error connecting to rabbitmq: ' + err;
			}

			conn.createChannel(function(err, ch) {
				if (err) {
					throw 'Error creating channel to rabbitmq: ' + err;
				}

				var q = config[queue];

				ch.assertQueue(q, {durable: false});
				ch.consume(q, callback, {noAck: true});
			});
		});
	}
}

module.exports = Rabbit;
