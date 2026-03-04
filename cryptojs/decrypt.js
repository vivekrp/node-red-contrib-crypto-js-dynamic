module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function DecryptNode(config) {
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
					node.debug('Decrypting payload using '+node.algorithm);
					// decrypt with CryptoJS
					var bytes = CryptoJS[node.algorithm].decrypt(msg.payload, key);
					msg.payload = bytes.toString(CryptoJS.enc.Utf8);
				} else {
					// debugging message
					node.trace('Nothing to decrypt: empty payload');
				}

				node.send(msg);
			}
		});
	}

	RED.nodes.registerType("decrypt", DecryptNode);
};
