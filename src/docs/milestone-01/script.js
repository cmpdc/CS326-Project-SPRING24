const teamMembers = [
	{
		name: "Christian Dela Cruz",
		photoURL: "photos/Christian.jpg",
		bannerURL: "photos/ChristianBackground.jpg",
		role: "Project Lead",
		bio: "Hi! The name’s Christian. I am a junior computer science student. I am an aspiring front-end developer.",
	},
	{
		name: "Jason Huang",
		photoURL: "photos/jason.jpg",
		bannerURL: "photos/jasonBackground.jpg",
		role: "Backend Developer",
		bio: "Hi! My name is Jason. I am a senior CS major and an aspiring full-stack developer. I am currently project lead and full-stack developer for my semester project in CS 320. I am responsible for database storage and retrieval and API integration for MeetUp.",
	},
	{
		name: "Annanta Budhathoki",
		photoURL: "photos/Annanta.jpg",
		bannerURL: "photos/AnnantaBackground.jpg",
		role: "Frontend Developer",
		bio: "Hello my name is Annanta and I am a 3rd year computer science student. I am interested in cybersecurity and swe. Last semester I took 320 and I worked as a front end developer where I created React components using Tailwind to implement them. I learned some things about front end, but I would like to learn more about backend development because I didn’t get much of an opportunity to learn about it.",
	},
	{
		name: "Justin Baldwin",
		photoURL: "https://gifdb.com/images/high/ponyo-curious-watch-wp9eayuzb6wre0b2.gif",
		bannerURL: "https://64.media.tumblr.com/943c4aee81da35bab1d0a864ed98f339/tumblr_o2xtj5KT6L1qhgh8jo1_500.gif",
		role: "Documentation Lead",
		bio: "My name is Justin. I am a Junior CompSci major. I have a background in coding. My primary focus is on implementation and functional coding.",
	},
];

const teamNameElem = document.querySelectorAll(".teamName");

const navigation = document.querySelector("#navigationBar");
const navLinks = navigation.querySelectorAll("a");
const tempElem = document.querySelector(".tempElem");

const headerElem = document.querySelector("#vision");

const teamElem = document.querySelector("#team");
const teamMembersElem = document.querySelector("#team .teamMembers");

const hamburgerElem = document.createElement("span");
hamburgerElem.classList.add("hamburger-wrapper");
hamburgerElem.addEventListener("click", (e) => {
	e.stopPropagation();
	e.target.classList.toggle("open");
});

for (let i = 0; i < 3; i++) {
	const spanElem = document.createElement("span");
	hamburgerElem.appendChild(spanElem);
}

navigation.appendChild(hamburgerElem);

let lastClickedLink = null;

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
	const teamMembersSorted = teamMembers.sort((a, b) => {
		const nameA = a.name.split(" ");
		const nameB = b.name.split(" ");

		const firstNameComparison = nameA[0].localeCompare(nameB[0]);
		if (firstNameComparison !== 0) {
			return firstNameComparison;
		}

		if (nameA.length > 1 && nameB.length > 1) {
			return nameA[1].localeCompare(nameB[1]);
		}

		return nameA.length - nameB.length;
	});

	teamMembersSorted.forEach((member) => {
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
	const scrollPosition = window.scrollY;
	const parallaxSpeed = 0.4;
	if (headerElem) {
		headerElem.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
	}

	if (teamElem) {
		teamElem.style.transform = `translateY(${scrollPosition * (parallaxSpeed - 0.45)}px)`;
	}
};

const setTempElemToLink = (targetElem) => {
	const offset = 20;
	tempElem.style.width = `${targetElem.offsetWidth + offset}px`;
	tempElem.style.left = `${targetElem.offsetLeft - offset / 2}px`;
};

const navLinksEffects = () => {
	const clickedClassName = "clicked";

	const handleLinkClick = (event) => {
		event.preventDefault();
		const currentlyClicked = event.target.classList.contains(clickedClassName);

		navLinks.forEach((link) => link.classList.remove(clickedClassName));

		if (hamburgerElem.classList.contains("open")) hamburgerElem.classList.remove("open");

		if (!currentlyClicked) {
			event.target.classList.add(clickedClassName);
			setTempElemToLink(event.target);

			lastClickedLink = event.target;
		}
	};

	navLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();

			handleLinkClick(e);

			const href = this.getAttribute("href");
			if (href && href.startsWith("#")) {
				const targetElement = document.querySelector(href);
				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}

				const highlightedClassName = "highlighted";

				targetElement.classList.add(highlightedClassName);
				setTimeout(() => {
					targetElement.classList.remove(highlightedClassName);
				}, 1250);
			}
		});
	});
};

const updateTempElemPositionOnResize = () => {
	if (lastClickedLink) {
		setTempElemToLink(lastClickedLink);
	}
};

const replaceTeamName = () => {
	teamNameElem.forEach((elem) => {
		elem.textContent = "MeetUp";
	});
};

document.addEventListener("DOMContentLoaded", () => {
	injectTeamMembers();
	navLinksEffects();
	replaceTeamName();

	window.addEventListener("resize", () => {
		updateTempElemPositionOnResize();
	});

	window.addEventListener("scroll", () => {
		parallaxEffectHeader();
	});
});
