const axios = require('axios');
const convert = require("xml-js");
const query_path = "/";

const timeout = 10000;
const interval = 1;    // Seconds
const debug = false;

var Service;
var Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-infocus-projector", "Infocus Projector", InfocusProjector);
};


function InfocusProjector(log, config) {
    this.log = log;
    this.ipAddress = config["ipAddress"];
    //this.model = config["model"] === undefined ? "" : config["model"];
    //this.serial = config["serial"] === undefined ? "" : config["serial"];
    this.name = config["name"];
    this.timeout = config["timeout"] === undefined ? timeout : config["timeout"];
    this.refreshInterval = config["refreshInterval"] === undefined ? interval * 1000 : config["refreshInterval"] * 1000;
    this.debug = config["debug"] === undefined ? debug : config["debug"];

    this.state = false; // Track the power state

                this.referer = "http://" + this.ipAddressAddress + "/PJState.xml";
                this.api = axios.create({
                        headers: {'Referer': this.referer}
                });

                this.informationService = new Service.AccessoryInformation();
                this.informationService
                                .setCharacteristic(Characteristic.Manufacturer, "Infocus");
                this.switchService = new Service.Switch(this.name);
                this.switchService
                                .getCharacteristic(Characteristic.On)
                                                .on('set', this.setPowerState.bind(this));

                this.wait = null;
                this.timer = null;
                this.poll()
}

InfocusProjector.prototype = {

        updateUI: async function () {
                setTimeout( () => {
                        this.switchService.getCharacteristic(Characteristic.On).updateValue(this.state);
                        this.log('Updated Characteristic value to %s', this.state);
                }, 100)
        },

        free: async function () {
                if(this.wait) clearTimeout(this.wait);
                this.wait = null;
                this.poll();;
        },

        poll: async function () {
                if(this.timer) clearTimeout(this.timer);
                this.timer = null;
                if(!this.wait) {

                        try {    
                                const webresp = await this.api.get('http://' + this.ipAddress + query_path + 'PJState.xml')

                                .catch(err => {
                                        this.log.error('Error getting power state %s',err)
                                });

                                const resp = convert.xml2js(webresp.data, {compact: true, alwaysArray: false});

                                this.log("Projecttor is Currently(0=OFF,1=ON):  ",resp.response.pjPowermd._text);
                                this.state = resp.response.pjPowermd._text;
                                this.updateUI();
                                if (this.debug) {
                                        this.log("http://" + this.ipAddress + query_path + "PWR?");
                                        this.log("Projector response: " + resp.data + " =", this.state);
                                }
                        } catch(err) {
                                        this.log.error('Error getting power state %s',err)
                        }
                }
                this.timer = setTimeout(this.poll.bind(this), this.refreshInterval);
        },

        setPowerState: async function(powerOn, callback) {
                if (!this.wait) {
                        this.state = powerOn;
                        this.updateUI();
                        if(this.timer) clearTimeout(this.timer)
                        this.timer = null
                        let command;
                        if (powerOn) {
                                command = "dpjset.cgi?PJ_PowerMode=1";
                        } else {
                                command = "dpjset.cgi?PJ_PowerMode=0";
                        }
                        if (this.debug) {
                                this.log('powerOn = %s', powerOn);
                                this.log("http://" + this.ipAddress + query_path + command);
                        }
                        callback(null);
                        this.wait = setTimeout(this.free.bind(this), powerOn === true ? 60000 : 300000);
                        try {
                                const resp = await this.api({
                                        method: 'get',
                                        url: 'http://' + this.ipAddress + query_path + command,
                                        timeout: 16000
                                }).catch(err => {
//                                      this.log.error('Error setting power state %s',err)
                                });
                        }catch(err) {
                                this.log.error('Error setting powerState %s',err)
                        }
                }
        },

        getServices: function () {
                return [this.informationService, this.switchService];
        }
};
