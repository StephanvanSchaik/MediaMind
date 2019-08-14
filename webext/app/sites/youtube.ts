import { Player } from '../common';

class YoutubePlayer extends Player {
	video: HTMLVideoElement | null = null;
	next_btn: Element | null = null;

	constructor() {
		super("youtube");
	}

	init(): void {
		let watchFlexy = document.getElementsByTagName('ytd-watch-flexy')[0];

		if (watchFlexy == null) {
			console.error('no element "ytd-watch-flexy"');
			return;
		}

		this.addWatchFlexyObserver(watchFlexy);
	}

	addWatchFlexyObserver(watchFlexy: Element) {
		//let infoContents = document.getElementById('info-contents');
		let infoRenderer = document.querySelector('ytd-video-primary-info-renderer');

		if (infoRenderer == null) {
			console.error('no element "ytd-video-primary-info-renderer"');
			return;
		}

		this.addTitleObserver(infoRenderer);

		let videoContainer = watchFlexy.querySelector('ytd-player > div');

		if (videoContainer == null) {
			console.error('no element "ytd-player > div"');
			return;
		}

		let video = videoContainer.querySelector('video') as HTMLVideoElement;

		if (video == null) {
			console.error('no element "video"');
			return;
		}

		this.attachVideoEvents(video);
		this.attachControls();
	}

	attachControls() {
		this.next_btn = document.querySelector('.ytp-next-button');

		if (this.next_btn) {
			this.set({
				can_go_next: true
			});
		}
	}

	attachVideoEvents(video: HTMLVideoElement) {
		this.video = video;

		this.video.addEventListener('play', () => {
			this.setPlaying();
		});

		this.video.addEventListener('pause', () => {
			this.setPaused();
		});

		if (this.video.paused) {
			this.setPaused();
		} else {
			this.setPlaying();
		}
	}

	addTitleObserver(infoRenderer: Element) {
		let titleElement = infoRenderer.querySelector('h1.title > yt-formatted-string');

		if (titleElement == null) {
			console.error('no element "h1.title > yt-formatted-string"');
			return;
		}

		let titleObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type == 'childList') {
					if (mutation.addedNodes.length > 0
						&& mutation.addedNodes[0].nodeName == '#text'
						&& mutation.target.textContent != null) {
						this.set({
							title: mutation.target.textContent
						});

						let params = new URLSearchParams(location.search);

						if (params.has('v')) {
							this.set({
								art_url: 'http://img.youtube.com/vi/' + params.get('v') + '/hqdefault.jpg'
							});
						}
					}
				}
			});
		});

		titleObserver.observe(titleElement, {
			childList: true,
		});

		let params = new URLSearchParams(location.search);

		if (params.has('v')) {
			this.set({
				art_url: 'http://img.youtube.com/vi/' + params.get('v') + '/hqdefault.jpg'
			});
		}

		if (titleElement.textContent) {
			this.set({
				title: titleElement.textContent
			});
		}
	}

	play(): void {
		if (this.video == null) {
			return;
		}

		if (this.video.paused) {
			this.video.play();
		}
	}

	pause(): void {
		if (this.video == null) {
			return;
		}

		if (!this.video.paused) {
			this.video.pause();
		}
	}

	playPause(): void {
		if (this.video == null) {
			return;
		}

		if (this.video.paused) {
			this.video.play();
		} else {
			this.video.pause();
		}
	}

	next(): void {
		if (this.video == null) {
			return;
		}

		let btn = (this.next_btn as HTMLElement);

		if (btn) {
			btn.click();
		}
	}

	previous(): void {
		console.log('youtube: previous() not implemented')
	}
}

window.addEventListener('load', (_) => {
	let player = new YoutubePlayer();
	player.init();
}, true);
