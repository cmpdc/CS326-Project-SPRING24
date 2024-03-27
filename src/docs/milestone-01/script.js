const teamMembers = [
	{
		name: "Christian Dela Cruz",
		photoURL: "https://gifdb.com/images/high/ponyo-curious-watch-wp9eayuzb6wre0b2.gif",
		bannerURL: "https://64.media.tumblr.com/943c4aee81da35bab1d0a864ed98f339/tumblr_o2xtj5KT6L1qhgh8jo1_500.gif",
		role: "Role Here",
		bio: "Hello, my name is Christian but you can call me uri!",
	},
	{
		name: "Jason Juang",
		photoURL: "https://gifdb.com/images/high/ponyo-curious-watch-wp9eayuzb6wre0b2.gif",
		bannerURL: "https://64.media.tumblr.com/943c4aee81da35bab1d0a864ed98f339/tumblr_o2xtj5KT6L1qhgh8jo1_500.gif",
		role: "Role Here",
		bio: "Bio here",
	},
	{
		name: "Annanta Budhathoki",
		photoURL: "https://gifdb.com/images/high/ponyo-curious-watch-wp9eayuzb6wre0b2.gif",
		bannerURL: "https://64.media.tumblr.com/943c4aee81da35bab1d0a864ed98f339/tumblr_o2xtj5KT6L1qhgh8jo1_500.gif",
		role: "Role Here",
		bio: "Bio here",
	},
	{
		name: "Justin Baldwin",
		photoURL: "https://gifdb.com/images/high/ponyo-curious-watch-wp9eayuzb6wre0b2.gif",
		bannerURL: "https://64.media.tumblr.com/943c4aee81da35bab1d0a864ed98f339/tumblr_o2xtj5KT6L1qhgh8jo1_500.gif",
		role: "Role Here",
		bio: "Bio here",
	},
];

const showDialog = (content, dataType) => {
	const dialogClassName = "dialogModal";
	const dialogIndicatorClassName = `${dialogClassName}-open`;

	document.body.classList.add(`${dialogIndicatorClassName}`);

	const dialogElem = document.createElement("div");
	dialogElem.classList.add(dialogClassName);
	dialogElem.setAttribute("data-type", dataType);

	const dialogBackdropElem = document.createElement("div");
	dialogBackdropElem.classList.add(`${dialogClassName}-backdrop`);
	dialogElem.appendChild(dialogBackdropElem);

	const dialogInnerElem = document.createElement("div");
	dialogInnerElem.classList.add(`${dialogClassName}-inner`);
	dialogInnerElem.innerHTML = content;

	dialogElem.appendChild(dialogInnerElem);

	if (!document.body.querySelector(`.${dialogClassName}`)) {
		document.body.appendChild(dialogElem);
	}

	setTimeout(() => {
		const removeDialog = (event) => {
			if (!dialogInnerElem.contains(event.target)) {
				dialogElem.remove();
				document.removeEventListener("click", removeDialog);
				document.body.classList.remove(dialogIndicatorClassName);
			}
		};

		document.addEventListener("click", removeDialog);
	}, 10);
};

const injectTeamMembers = () => {
	const teamMembersElem = document.querySelector("#team .teamMembers");

	teamMembers.sort((a, b) => a - b);
	teamMembers.forEach((member) => {
		const memberElem = document.createElement("div");
		memberElem.classList.add(`member`, `member-${member.name.split(" ")[0].toLowerCase()}`);

		memberElem.innerHTML = `
            <div class="photo" style="background-image: url(${member.photoURL});"></div>
            <span class="name">${member.name}</span>
            <span class="role">${member.role}</span>`;

		memberElem.addEventListener("click", () => {
			const dialogClassName = "memberInfo";
			const dialogContent = `<div class="${dialogClassName}">
                <div class="top">
                    <div class="banner" style="background-image: url(${member.bannerURL})"></div>
                    <div class="photo" style="background-image: url(${member.photoURL});"></div>
                </div>
                <div class="content">
                    <div class="info">
                        <span class="name">${member.name}</span>
                        <span class="role">${member.role}</span>
                    </div>
                    <div class="bio">${member.bio}</div>
                </div>
            </div>`;

			showDialog(dialogContent, dialogClassName);
		});

		teamMembersElem.appendChild(memberElem);
	});
};

const parallaxEffectHeader = () => {
	const headerElem = document.querySelector("#vision");
	const teamElem = document.querySelector("#team");

	const scrollPosition = window.scrollY;
	const parallaxSpeed = 0.4;
	if (headerElem) {
		headerElem.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
	}

	if (teamElem) {
		teamElem.style.transform = `translateY(${scrollPosition * (parallaxSpeed - 0.45)}px)`;
	}
};

const navLinksEffects = () => {
	const navLinks = document.querySelectorAll("#navigationBar a");
	const tempElem = document.querySelector(".tempElem");

	const clickedClassName = "clicked";

	const firstLink = navLinks[0];
	setTempElemToLink(firstLink);

	function setTempElemToLink(link) {
		tempElem.style.width = `${link.offsetWidth}px`;
		tempElem.style.left = `${link.offsetLeft}px`;
	}

	function handleLinkClick(event) {
		event.preventDefault();
		const currentlyClicked = event.target.classList.contains(clickedClassName);

		navLinks.forEach((link) => link.classList.remove(clickedClassName));

		if (!currentlyClicked) {
			event.target.classList.add(clickedClassName);
			setTempElemToLink(event.target);
		}
	}

	navLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();

			handleLinkClick(e);

			const href = this.getAttribute("href");
			if (href && href.startsWith("#")) {
				const targetElement = document.querySelector(href);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: "smooth" });
				}
			}
		});
	});
};

const replaceTeamName = () => {
	const teamNameElem = document.querySelectorAll(".teamName");
	teamNameElem.forEach((elem) => {
		elem.textContent = "MeetUp";
	});
};

function init() {
	injectTeamMembers();
	navLinksEffects();
	replaceTeamName();

	window.addEventListener("scroll", () => {
		parallaxEffectHeader();
	});
}

export default init;
