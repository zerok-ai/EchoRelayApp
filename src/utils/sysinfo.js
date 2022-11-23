// get hosts and ips
import os from 'os';

const nets = os.networkInterfaces();
const ipconfig = Object.create(null); // Or just '{}', an empty object
const hostname = os.hostname();
for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		if (!ipconfig[name]) {
			ipconfig[name] = [];
		}
		ipconfig[name].push(net.address);
	}
}

const sysinfo = {
    ipconfig,
    hostname
};

export default sysinfo;