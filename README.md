# @ecoen66/homebridge-epson-projector
An [EPSON](https://www.epson.com) Projector plugin for
[Homebridge](https://github.com/nfarina/homebridge).  This creates a a set of Light Switch in homekit,
 for the power status of the projector.

This is a fork from valkjsaaa's [homebridge-epson-projector](https://github.com/valkjsaaa/homebridge-epson-projector), modified to work with Axios.
This was tested to work with EPSON HomeCinema 2150. It should work with any other EPSON projector with EPSON iProjection support.

# Installation
Run these commands:

    % sudo npm install -g homebridge
    % sudo npm install -g @ecoen66/homebridge-epson-projector


NB: If you install homebridge like this:

    sudo npm install -g --unsafe-perm homebridge

Then all subsequent installations must be like this:

    sudo npm install -g --unsafe-perm @ecoen66/homebridge-epson-projector

# Configuration

Example accessory config (needs to be added to the homebridge config.json):
 ...

		"accessories": [
			{
				"name": "Projector",
				"ipAddress": "192.168.1.115",
				"model": "2150",
				"serial": "myserialno",
				"timeout": 10000,
				"debug": false,
				"accessory": "Epson Projector"
			}
		]
 ...

### Config Explanation:

Field           						| Description
----------------------------|------------
**accessory**   						| (required) Must always be "Epson Projector".
**name**										| (required) The name you want to use for for the light switch widget.
**ipAddress**								| (required) The IP address of the projector (should be static, not DHCP).
**serial**									| (optional) This shows up in the homekit accessory Characteristics.
**model**										| (optional) This shows up in the homekit accessory Characteristics.
**serial**									| (optional) This shows up in the homekit accessory Characteristics.
**timeout**									| (optional) The timeout duration for the web API calls.
**debug**										| (optional) Enables additional logging.

To make your projector work with the plugin:

1. Connect your projector to your home network.
2. Write down the IP address of the projector.
3. Create your config file according to the above example (or using the Homebridge UI).

This plugin is still very experimental. Please create an issue or a pull request for any problem you encountered.
The fact that it is slow to recognize the power status change after turning the projector on or off is a known issue - but it works...