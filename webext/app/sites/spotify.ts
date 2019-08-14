import { Player } from '../common';

class SpotifyPlayer extends Player {
	buttons: Element | null = null;

	constructor() {
		super("spotify");
	}

	init(): void {
		let nowPlayingBarLeft = document.querySelector('.now-playing-bar__left');
		let self = this;

		if (nowPlayingBarLeft == null) {
			var observer = new MutationObserver(function (mutations, observer) {
				let nowPlayingBarLeft = document.querySelector('.now-playing-bar__left');

				if (nowPlayingBarLeft != null) {
					self.setup(nowPlayingBarLeft);
					observer.disconnect();
				}
			});

			observer.observe(document, {
				childList: true,
				subtree: true
			});
		} else {
			this.setup(nowPlayingBarLeft);
		}
	}

	setup(nowPlayingBarLeft: Element) {
		this.buttons = document.querySelector('#main .player-controls__buttons');

		if (this.buttons == null) {
			console.error('no element "#main .player-controls__buttons"');
			return;
		}

		let updateButton = (button: Element) => {
			if (button.classList.contains('spoticon-play-16')) {
				if (this.info.status != "Paused") {
					this.setPaused();
				}
			} else if (button.classList.contains('spoticon-pause-16')) {
				if (this.info.status != "Playing") {
					this.setPlaying();
				}
			} else if (button.classList.contains('spoticon-skip-forward-16')) {
				this.set({
					can_go_next: !button.classList.contains('control-button--disabled')
				});
			} else if (button.classList.contains('spoticon-skip-back-16')) {
				this.set({
					can_go_previous: !button.classList.contains('control-button--disabled')
				});
			}
		};

		let buttonsObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type == 'attributes') {
					updateButton(mutation.target as Element);
				}
			});
		});

		buttonsObserver.observe(this.buttons, {
			attributes: true,
			attributeFilter: ['class'],
			subtree: true
		});

		[...this.buttons.children].forEach(updateButton);

		let nowPlaying = nowPlayingBarLeft.querySelector('.now-playing');

		if (nowPlaying == null) {
			this.waitForElement(nowPlayingBarLeft, (el) => {
				return el.nodeName == 'DIV' && el.classList.contains('now-playing');
			}, this.addNowPlayingObserver.bind(this));
		} else {
			this.addNowPlayingObserver(nowPlaying as Element);
		}
	}

	addNowPlayingObserver(el: Element) {
		let observer = new MutationObserver((mutations) => {
			let updateArtists = false;

			mutations.forEach((mutation) => {
				if (mutation.type == 'characterData') {
					if (mutation.target.parentElement == null) {
						return;
					}

					if (mutation.target.parentElement.matches('.track-info__name a')) {
						this.set({
							title: mutation.target.textContent || undefined
						});
					}

					if (mutation.target.parentElement.matches('.track-info__artists a')) {
						updateArtists = true;
					}
				} else if (mutation.type == 'attributes') {
					let target = mutation.target as Element;

					if (target.classList.contains('cover-art-image-loaded')) {
						let style = window.getComputedStyle(target, null);

						if (style.backgroundImage) {
							this.set({
								art_url: style.backgroundImage.slice(4, -1).replace(/"/g, "")
							});
						}
					}
				}
			});

			if (updateArtists) {
				this.set({
					artists: [...el.querySelectorAll('div.track-info > div.track-info__artists a')].map(x => x.textContent).filter((x): x is string => x != null)
				});
			}
		});

		observer.observe(el, {
			characterData: true,
			attributes: true,
			attributeFilter: ['class'],
			subtree: true
		});

		let title = el.querySelector('.track-info__name a');

		if (title != null && title.textContent != null) {
			this.set({
				title: title.textContent
			});
		}

		this.set({
			artists: [...el.querySelectorAll('div.track-info > div.track-info__artists a')].map(x => x.textContent).filter((x): x is string => x != null)
		});
	}

	play(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.spoticon-play-16') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	pause(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.spoticon-pause-16') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	playPause(): void {
		if (this.buttons == null) {
			return;
		}

		let button = ((this.buttons.querySelector('.spoticon-pause-16') || this.buttons.querySelector('.spoticon-play-16')) as HTMLElement);

		if (button) {
			button.click();
		}
	}

	next(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.spoticon-skip-forward-16') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	previous(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.spoticon-skip-back-16') as HTMLElement);

		if (button) {
			button.click();
		}
	}
}

console.log('Spotify');
let player = new SpotifyPlayer();
player.init();
