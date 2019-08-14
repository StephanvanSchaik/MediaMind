import { Player } from '../common';

class SoundCloudPlayer extends Player {
	buttons: Element | null = null;

	constructor() {
		super("soundcloud");
	}

	init(): void {
		this.buttons = document.querySelector('.playControls');

		if (this.buttons == null) {
			console.error('no element ".playControls"');
			return;
		}

		let updateButton = (button: Element) => {
			if (button.classList.contains('playControls__play playing')) {
				if (this.info.status != "Paused") {
					this.setPaused();
				}
			} else if (button.classList.contains('playControls__play')) {
				if (this.info.status != "Playing") {
					this.setPlaying();
				}
			} else if (button.classList.contains('playControls__next')) {
				this.set({
					can_go_next: true
				});
			} else if (button.classList.contains('playControls__prev')) {
				this.set({
					can_go_previous: true
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

		let nowPlaying = this.buttons.querySelector('.playControls__soundBadge');

		if (nowPlaying == null) {
			console.error('no element ".playControls__soundBadge"');
			return;
		}

		this.addNowPlayingObserver(nowPlaying as Element);
	}

	addNowPlayingObserver(el: Element) {
		let observer = new MutationObserver((mutations) => {
			let updateArtists = false;

			mutations.forEach((mutation) => {
				if (mutation.type == 'characterData') {
					if (mutation.target.parentElement == null) {
						return;
					}

					if (mutation.target.parentElement.matches('.playbackSoundBadge__titleLink')) {
						this.set({
							title: (mutation.target as HTMLElement).title || undefined
						});
					}

					if (mutation.target.parentElement.matches('.playbackSoundBadge__lightLink') &&
					    (mutation.target as HTMLElement).title != null) {
						this.set({
							'artists': [(mutation.target as HTMLElement).title]
						});
					}
				} else if (mutation.type == 'attributes') {
					let target = mutation.target as Element;

					if (target.classList.contains('sc-artwork')) {
						let style = window.getComputedStyle(target, null);

						if (style.backgroundImage) {
							this.set({
								art_url: style.backgroundImage.slice(4, -1).replace(/"/g, "")
							});
						}
					}
				}
			});
		});

		observer.observe(el, {
			characterData: true,
			attributes: true,
			attributeFilter: ['class'],
			subtree: true
		});

		let title = el.querySelector('.playbackSoundBadge__titleLink') as HTMLElement;

		if (title != null && title.title != null) {
			this.set({
				title: title.title
			});
		}

		let artist = el.querySelector('.playbackSoundBadge__lightLink') as HTMLElement;

		if (artist != null && artist.title != null) {
			this.set({
				artists: [artist.title]
			});
		}
	}

	play(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.playControls__play') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	pause(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.playControls__play') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	playPause(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.playControls__play') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	next(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.playControls__next') as HTMLElement);

		if (button) {
			button.click();
		}
	}

	previous(): void {
		if (this.buttons == null) {
			return;
		}

		let button = (this.buttons.querySelector('.playControls__prev') as HTMLElement);

		if (button) {
			button.click();
		}
	}
}

window.addEventListener('load', (_) => {
	console.log('SoundCloud');
	let player = new SoundCloudPlayer();
	player.init();
}, true);
