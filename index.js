const axios = require('axios');

const command_path = "/cgi-bin/directsend?";

const query_path = "/cgi-bin/json_query?jsoncallback=";

const timeout = 10000;

const debug = false;

var Service;
var Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-epson-projector", "Epson Projector", EpsonProjector);
};


function EpsonProjector(log, config) {
    this.log = log;
    this.ip = config["ip"];
    this.model = config["model"] === undefined ? "" : config["model"];
    this.serial = config["serial"] === undefined ? "" : config["serial"];
    this.name = config["name"];
    this.timeout = config["timeout"] === undefined ? timeout : config["timeout"];
    this.debug = config["debug"] === undefined ? debug : config["debug"];
		this.referer = "http://" + this.ip + "/cgi-bin/webconf";
		this.api = axios.create({
			timeout: this.timeout,
			headers: {'Referer': this.referer}
		});

}

EpsonProjector.prototype = {

  	getPowerState: function (callback) {
       
				this.api.get('http://' + this.ip + query_path + 'PWR?')
					.then(resp => {
					  if (this.debug) {
							this.log("http://" + this.ip + query_path + "PWR?");
							this.log("Projector response: " + resp.data.projector.feature.reply + " =", resp.data.projector.feature.reply === "01" ? "On" : "Off");
        		}

						callback(null, resp.data.projector.feature.reply === "01" | resp.data.projector.feature.reply === "02")
					})
					.catch(err => {
						callback(err)
					});
    },

    setPowerState: function(powerOn, callback) {
        let command;
        if (powerOn) {
            command = "PWR=ON";
        } else {
            command = "PWR=OFF";
        }
        if (this.debug) {
					this.log("http://" + this.ip + command_path + command);
				}

        this.api.get('http://' + this.ip + command_path + command)
        	.then(resp => {
        		if (this.debug) { 
        			this.log(resp)
        		}
            callback()
          })
          .catch(err => {
          	callback(err)
          });
    },

    getServices: function () {
        const informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Epson")
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);

        switchService = new Service.Switch(this.name);
        switchService
            .getCharacteristic(Characteristic.On)
                .on('get', this.getPowerState.bind(this))
                .on('set', this.setPowerState.bind(this));

        this.informationService = informationService;
        this.switchService = switchService;
        return [informationService, switchService];
    }
};
