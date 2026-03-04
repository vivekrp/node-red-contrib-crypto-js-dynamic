module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function EncryptNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		node.algorithm = config.algorithm;
		node.key = config.key;

		node.on('input', function (msg) {
			// first check if secret key was sent via msg first. If true use it for this message only.
			var key = msg.secretkey || node.key;
			// check configurations
			if(!node.algorithm || !key) {
				// rising misconfiguration error
				node.error("Missing configuration, please check your algorithm or secret key.", msg);
			} else {
				// check the payload
				if(msg.payload) {
					// debugging message
					node.debug('Encrypting payload using '+node.algorithm);
					// encrypt with CryptoJS
					msg.payload = CryptoJS[node.algorithm].encrypt(msg.payload, key).toString();
				} else {
					// debugging message
					node.trace('Nothing to encrypt: empty payload');
				}

				node.send(msg);
			}
		});
	}

	RED.nodes.registerType("encrypt", EncryptNode);
};
