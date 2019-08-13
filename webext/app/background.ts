import { PlaybackStatus, PlayerInfo } from './common';

export class PlayerPort {
	public status: PlaybackStatus = "Stopped";
	public lastPlayTime: DOMHighResTimeStamp;
	constructor(
		public port: browser.runtime.Port,
		public category: string) {
	}
}

export type Command =
	| { "command": "Update", "data": PlayerInfo }
	| { "command": "Play" }
	| { "command": "Pause" }
	| { "command": "PlayPause" }
	| { "command": "Next" }
	| { "command": "Previous" }
	| { "command": "Raise" };

let nativePort = browser.runtime.connectNative("com.synkhronix.media_mind");

let playerPorts: PlayerPort[] = [];

nativePort.onMessage.addListener((command: Command) => {
	switch (command.command) {
		case "Play":
		case "Pause":
		case "PlayPause":
		case "Next":
		case "Previous":
			playerPorts.sort((a, b) => b.lastPlayTime - a.lastPlayTime);
			playerPorts[0].port.postMessage(command);
			break;
		case "Raise":
			console.warn("NYI: Raise");
			break;
		default:
			console.warn("Received command that shouldn't be handled in add-on background land.", command);
	}
});

function updateData(playerPort: PlayerPort, info: PlayerInfo) {
	if (info.status == 'Playing') {
		playerPorts.forEach((port) => {
			if (port.status == 'Playing' && port.port != playerPort.port) {
				port.port.postMessage({'command': 'Pause'});
			}
		});

		playerPort.lastPlayTime = performance.now();

		let command: Command = {
			command: "Update",
			data: info
		};

		nativePort.postMessage(command);
	} else {
		if (!playerPorts.some((pp) => pp.status == 'Playing')) {
			let command: Command = {
				command: "Update",
				data: info
			};

			nativePort.postMessage(command);
		}
	}

	playerPort.status = info.status;
}

browser.runtime.onConnect.addListener((port) => {
	let pp = new PlayerPort(port, port.name);

	playerPorts[port.sender.tab.id] = pp;

	port.onMessage.addListener((info: PlayerInfo) => {
		updateData(pp, info);
	});

	port.onDisconnect.addListener(() => {
		delete playerPorts[port.sender.tab.id];
	})
});
