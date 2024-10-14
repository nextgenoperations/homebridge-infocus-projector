# An [INFOCUS](https://www.infocus.com) Projector plugin for [Homebridge](https://github.com/nfarina/homebridge).  

This creates a switch in homekit for the power status of the projector.

This is a fork from @ecoen66 [homebridge-epson-projector](https://github.com/ecoen66/homebridge-epson-projector), with a few fixes.

This was tested to work with the INFOCUS IN3118HD. It may work with any other INFOCUS projector with web control.

# Installation
Run these commands:

    % sudo npm install -g homebridge
    % sudo npm install -g homebridge-infocus-projector


NOTE: If you install homebridge like this:

    sudo npm install -g --unsafe-perm homebridge

Then all subsequent installations must be like this:

    sudo npm install -g --unsafe-perm homebridge-epson-iprojection

# Configuration

Example accessory config (needs to be added to the homebridge config.json):
 ...

		"accessories": [
			{
				"name": "Projector",
				"ipAddress": "192.168.1.115",
				"model": "2150",
				"timeout": 10000,
				"refreshInterval": 15,
				"debug": false,
				"accessory": "Epson iProjection"
			}
		]
 ...

### Config Explanation:

Field           						| Description
----------------------------|------------
**accessory**   						| (required) Must always be "Epson iProjection".
**name**										| (required) The name you want to use for for the light switch widget.
**ipAddress**								| (required) The IP address of the projector (should be static, not DHCP).
**model**										| (optional) This shows up in the homekit accessory Characteristics.
**timeout**									| (optional) The timeout duration for the web API calls.
**refreshInterval**					| (optional) The number of minutes between power status polls and updates. Default is 15
**debug**										| (optional) Enables additional logging.

To make your projector work with the plugin:

1. Connect your projector to your home network.
2. Write down the IP address of the projector.
3. Create your config file according to the above example (or using the Homebridge UI).

This plugin is still very experimental. Please create an issue or a pull request for any problem you encountered.

The fact that it is slow to recognize the power status change after turning the projector on or off is a known issue - but it works...
