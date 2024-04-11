export const createRef = () => {
	return {
		current: null,
	};
};

export const addComponent = ({ type, ref, props }) => {
	const elem = document.createElement(type);

	if (ref) {
		ref.current = elem;
	}

	if (props) {
		Object.entries(props).forEach(([key, value]) => {
			if (key === "classList") {
				value.filter(Boolean).forEach((className) => elem.classList.add(className));
			} else if (key.startsWith("on") && typeof value === "function") {
				const eventName = key.substring(2).toLowerCase();
				elem.addEventListener(eventName, value);
			} else if (key === "attributes") {
				Object.entries(value).forEach(([attrName, attrValue]) => {
					elem.setAttribute(attrName, attrValue);
				});
			} else if (key === "children") {
				value.forEach((child) => {
					if (typeof child === "string") {
						elem.innerHTML += child;
					} else if (child instanceof Node) {
						// If "child" is already a DOM element, append it directly
						elem.appendChild(child);
					} else {
						const childElement = addComponent(child);
						elem.appendChild(childElement);
					}
				});
			} else {
				elem[key] = value;
			}
		});
	}

	return elem;
};
