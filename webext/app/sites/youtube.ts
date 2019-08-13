import { Player } from '../common';

class YoutubePlayer extends Player {
	video: HTMLVideoElement;
	next_btn: Element;

	constructor() {
		super("youtube");
	}

	init(): void {
		let pageManager = document.getElementById('page-manager');
		let watchFlexy = document.getElementsByTagName('ytd-watch-flexy')[0];

		if (watchFlexy == null) {
			this.waitForElement(pageManager, (el) => {
				return el.nodeName == 'YTD-WATCH-FLEXY';
			}, this.addWatchFlexyObserver.bind(this))
		} else {
			this.addWatchFlexyObserver(watchFlexy);
		}
	}

	addWatchFlexyObserver(watchFlexy: Element) {
		let infoContents = document.getElementById('info-contents');
		let infoRenderer = infoContents.querySelector('ytd-video-primary-info-renderer');

		if (infoRenderer == null) {
			this.waitForElement(infoContents, (el) => {
				return el.nodeName == 'YTD-VIDEO-PRIMARY-INFO-RENDERER';
			}, this.addTitleObserver.bind(this))
		} else {
			this.addTitleObserver(infoRenderer);
		}

		let videoContainer = watchFlexy.querySelector('ytd-player > div');
		let video = videoContainer.querySelector('video') as HTMLVideoElement;

		if (video == null) {
			this.waitForElement(videoContainer, (el) => {
				return el.id == 'movie_player';
			}, () => {
				this.attachVideoEvents(videoContainer.querySelector('video') as HTMLVideoElement)
				this.attachControls();
			});
		} else {
			this.attachVideoEvents(video);
			this.attachControls();
		}
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

		let titleObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type == 'childList') {
					if (mutation.addedNodes.length > 0
						&& mutation.addedNodes[0].nodeName == '#text') {
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

		this.set({
			title: titleElement.textContent
		});
	}

	play(): void {
		if (this.video.paused) {
			this.video.play();
		}
	}

	pause(): void {
		if (!this.video.paused) {
			this.video.pause();
		}
	}

	playPause(): void {
		if (this.video.paused) {
			this.video.play();
		} else {
			this.video.pause();
		}
	}

	next(): void {
		let btn = (this.next_btn as HTMLElement);

		if (btn) {
			btn.click();
		}
	}

	previous(): void {
		console.log('youtube: previous() not implemented')
	}
}

{
	let player = new YoutubePlayer();
	player.init();
}
