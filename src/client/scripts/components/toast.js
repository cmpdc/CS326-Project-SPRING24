import { minimizeIcon } from "../icons.js";
import { addComponent } from "../utils.js";

class Toast {
	static existingToasts = [];

	constructor({ text, onComplete = undefined, position = "top center", interval = 4000 }) {
		if (typeof text !== "string") throw new Error("Text must be a string");
		if (!["top left", "top center", "top right", "bottom left", "bottom center", "bottom right"].includes(position)) {
			throw new Error(`Position must be one of "top left", "top center", "top right", "bottom left", "bottom center", "bottom right"`);
		}

		if (typeof interval !== "number") throw new Error("Interval must be a number");

		this.text = text;
		this.position = position;
		this.interval = interval;
		this.onComplete = onComplete;

		this.#createToast();
		this.#setAutoHide();
	}

	#createToast() {
		const [vertical, horizontal] = this.position.split(" ");

		this.textElement = addComponent({
			type: "span",
			props: {
				textContent: this.text,
			},
		});

		this.sliderElement = addComponent({
			type: "div",
			props: {
				classList: ["slider"],
				style: "width: 100%; height: 2px;",
			},
		});

		const toastInnerElem = addComponent({
			type: "div",
			props: {
				classList: ["toast-inner"],
				children: [this.textElement, this.sliderElement],
			},
		});

		const closeButton = addComponent({
			type: "div",
			props: {
				classList: ["closeButton"],
				children: [minimizeIcon],
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();

					this.#handleClose();
				},
			},
		});

		this.toastElement = addComponent({
			type: "div",
			props: {
				classList: ["toast", `toast-${vertical}-${horizontal}`],
				children: [toastInnerElem, closeButton],
				onMouseEnter: () => {
					this.isPaused = true;
				},
				onMouseLeave: () => {
					this.isPaused = false;
				},
			},
		});

		const verticalPos = vertical === "top" ? "20px" : "unset";
		const bottomPos = vertical === "bottom" ? "20px" : "unset";
		const rightPos = horizontal === "right" ? "10px" : "unset";

		const offset = 50;

		this.toastElement.style.height = `${offset}px`;
		this.toastElement.style.position = "fixed";
		this.toastElement.style[vertical] = verticalPos;
		this.toastElement.style.bottom = bottomPos;
		this.toastElement.style.left = horizontal === "center" ? "50%" : "unset";
		this.toastElement.style.right = rightPos;
		this.toastElement.style.transform =
			horizontal === "center"
				? `translate(-50%, ${(offset + 10) * Toast.existingToasts.length}px)`
				: `translateY(${(offset + 10) * Toast.existingToasts.length}px)`;

		let toastContainerElem = document.querySelector("#toastContainer");

		if (!toastContainerElem) {
			const _elem = addComponent({
				type: "div",
				props: {
					id: "toastContainer",
				},
			});

			const appElem = document.querySelector("#app");
			appElem.appendChild(_elem);
			toastContainerElem = _elem;
		}

		if (toastContainerElem) {
			toastContainerElem.appendChild(this.toastElement);
			Toast.existingToasts.push(this.toastElement);
		}
	}

	#handleClose() {
		if (this.onComplete) {
			this.onComplete();
		}

		this.toastElement.remove();
		Toast.existingToasts = Toast.existingToasts.filter((toast) => toast !== this.toastElement);

		Toast.existingToasts.forEach((toast, index) => {
			const [_, horizontal] = this.position.split(" ");

			const offset = 50;

			toast.style.transform = horizontal === "center" ? `translate(-50%, ${offset + 10 * index}px)` : `translateY(${offset + 10 * index}px)`;
		});
	}

	#setAutoHide() {
		const originalInterval = this.interval;
		let remainingTime = originalInterval;
		let lastTime = Date.now();

		const animateSlider = () => {
			if (!this.isPaused) {
				const currentTime = Date.now();
				const elapsed = currentTime - lastTime;
				remainingTime -= elapsed;
				lastTime = currentTime;

				const widthPercentage = (remainingTime / originalInterval) * 100;
				this.sliderElement.style.width = `${widthPercentage}%`;
			} else {
				lastTime = Date.now();
			}

			if (remainingTime > 0) {
				requestAnimationFrame(animateSlider);
			} else {
				this.#handleClose();
			}
		};

		requestAnimationFrame(animateSlider);
	}
}

export default Toast;
