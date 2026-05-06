document.addEventListener("DOMContentLoaded", () => {
	const talentModal = document.getElementById("talentModal");
	const form = document.getElementById("talentForm");
	const successBox = document.getElementById("formSuccess");
	const comments = document.getElementById("comments");
	const commentsCounter = document.getElementById("commentsCounter");
	const formErrorSummary = document.getElementById("formErrorSummary");
	const companyMailtoLink = document.querySelector("[data-company-mailto]");
	const openTalentTriggers = document.querySelectorAll("[data-open-talent-modal]");
	const closeTalentTriggers = document.querySelectorAll("[data-close-talent-modal]");
	const firstField = document.getElementById("fullName");
	let lastFocusedTrigger = null;


	if (
		!talentModal ||
		!form ||
		!successBox ||
		!comments ||
		!commentsCounter ||
		!firstField
	) {
		return;
	}

	const errorMessages = {
		fullName: "El nombre debe contener al menos nombre y apellido",
		email: "Ingresa un email válido (ejemplo: <nombre@empresa.com>)",
		phone: "El teléfono debe incluir código de país (ejemplo: +34 612 345 678)",
		country: "Selecciona tu país de residencia",
		experience: "Los años de experiencia deben estar entre 0 y 50",
		sector: "Selecciona el sector de tu interés",
		englishLevel: "Indica tu nivel de inglés",
		availability: "Selecciona tu disponibilidad",
		linkedin: "Si incluyes LinkedIn, debe ser una URL válida",
		privacy: "Debes aceptar la política de tratamiento de datos para continuar"
	};

	const fieldToErrorId = {
		fullName: "errorFullName",
		email: "errorEmail",
		phone: "errorPhone",
		country: "errorCountry",
		experience: "errorExperience",
		sector: "errorSector",
		englishLevel: "errorEnglishLevel",
		availability: "errorAvailability",
		linkedin: "errorLinkedin",
		comments: "errorComments",
		privacy: "errorPrivacy"
	};

	const controlledFields = [
		"fullName",
		"email",
		"phone",
		"country",
		"experience",
		"sector",
		"englishLevel",
		"linkedin",
		"privacy"
	];

	const getField = (name) => form.elements[name];

	const updateBodyScroll = () => {
		const isTalentOpen = !talentModal.classList.contains("hidden");
		document.body.classList.toggle("modal-open", isTalentOpen);
	};

	const setFieldError = (fieldName, message) => {
		const errorEl = document.getElementById(fieldToErrorId[fieldName]);
		if (!errorEl) {
			return;
		}

		errorEl.textContent = message || "";

		if (fieldName === "privacy") {
			const privacyField = getField("privacy");
			if (privacyField && privacyField.parentElement) {
				privacyField.setAttribute("aria-invalid", message ? "true" : "false");
				privacyField.parentElement.classList.toggle("border-rose-500", Boolean(message));
				privacyField.parentElement.classList.toggle("bg-rose-50", Boolean(message));
			}
			return;
		}

		if (fieldName === "availability") {
			const radios = form.querySelectorAll('input[name="availability"]');
			radios.forEach((radio) => {
				radio.setAttribute("aria-invalid", message ? "true" : "false");
				if (radio.parentElement) {
					radio.parentElement.classList.toggle("border-rose-500", Boolean(message));
					radio.parentElement.classList.toggle("bg-rose-50", Boolean(message));
				}
			});
			return;
		}

		const field = getField(fieldName);
		if (!field) {
			return;
		}

		field.setAttribute("aria-invalid", message ? "true" : "false");
		field.classList.toggle("border-rose-500", Boolean(message));
		field.classList.toggle("focus:border-rose-500", Boolean(message));
		field.classList.toggle("focus:ring-rose-200", Boolean(message));
	};

	const openTalentModal = () => {
		talentModal.classList.remove("hidden");
		talentModal.setAttribute("aria-hidden", "false");
		openTalentTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
		updateBodyScroll();
		firstField.focus();
	};

	const closeTalentModal = () => {
		talentModal.classList.add("hidden");
		talentModal.setAttribute("aria-hidden", "true");
		openTalentTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
		updateBodyScroll();
		if (lastFocusedTrigger instanceof HTMLElement) {
			lastFocusedTrigger.focus();
		}
	};

	const clearTalentValidationState = () => {
		Object.keys(fieldToErrorId).forEach((fieldName) => {
			setFieldError(fieldName, "");
		});
		if (formErrorSummary) {
			formErrorSummary.classList.add("hidden");
			formErrorSummary.innerHTML = "";
		}
	};

	const resetTalentModalState = () => {
		form.reset();
		form.classList.remove("hidden");
		successBox.classList.add("hidden");
		clearTalentValidationState();
		updateCommentsCounter();
	};

	const cancelTalentFlow = () => {
		resetTalentModalState();
		closeTalentModal();
	};

	const updateCommentsCounter = () => {
		const length = comments.value.length;
		commentsCounter.textContent = `${length}/500`;

		if (length > 500) {
			setFieldError("comments", `Los comentarios no pueden exceder 500 caracteres (quedan ${500 - length})`);
		} else {
			setFieldError("comments", "");
		}
	};

	const validators = {
		fullName: () => {
			const value = getField("fullName").value.trim();
			const hasTwoWords = value.split(/\s+/).filter(Boolean).length >= 2;
			return hasTwoWords ? "" : errorMessages.fullName;
		},
		email: () => {
			const value = getField("email").value.trim();
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(value) ? "" : errorMessages.email;
		},
		phone: () => {
			const value = getField("phone").value.trim();
			const phoneRegex = /^\+\d{1,4}(?:[\s-]?\d){6,14}$/;
			return phoneRegex.test(value) ? "" : errorMessages.phone;
		},
		country: () => (getField("country").value ? "" : errorMessages.country),
		experience: () => {
			const value = getField("experience").value.trim();
			const num = Number(value);
			if (value === "" || Number.isNaN(num)) {
				return errorMessages.experience;
			}
			return num >= 0 && num <= 50 ? "" : errorMessages.experience;
		},
		sector: () => (getField("sector").value ? "" : errorMessages.sector),
		englishLevel: () => (getField("englishLevel").value ? "" : errorMessages.englishLevel),
		availability: () => {
			const selected = form.querySelector('input[name="availability"]:checked');
			return selected ? "" : errorMessages.availability;
		},
		linkedin: () => {
			const value = getField("linkedin").value.trim();
			if (!value) {
				return "";
			}
			const linkedinRegex = /^https?:\/\/.+/i;
			return linkedinRegex.test(value) ? "" : errorMessages.linkedin;
		},
		comments: () => {
			const length = comments.value.length;
			return length <= 500
				? ""
				: `Los comentarios no pueden exceder 500 caracteres (quedan ${500 - length})`;
		},
		privacy: () => (getField("privacy").checked ? "" : errorMessages.privacy)
	};

	const validateField = (name) => {
		const message = validators[name]();
		setFieldError(name, message);
		return !message;
	};

	const validateAll = () => {
		const fields = [
			"fullName",
			"email",
			"phone",
			"country",
			"experience",
			"sector",
			"englishLevel",
			"availability",
			"linkedin",
			"comments",
			"privacy"
		];
		const errors = [];

		fields.forEach((field) => {
			const message = validators[field]();
			setFieldError(field, message);
			if (message) {
				errors.push(message);
			}
		});

		return errors;
	};

	const showAccumulatedErrors = (errors) => {
		if (!formErrorSummary) {
			return;
		}

		if (!errors.length) {
			formErrorSummary.classList.add("hidden");
			formErrorSummary.innerHTML = "";
			return;
		}

		const items = errors
			.map((error) => `<li>${error.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</li>`)
			.join("");

		formErrorSummary.innerHTML = `<p class=\"font-semibold\">Corrige los siguientes errores:</p><ul class=\"mt-2 list-disc space-y-1 pl-5\">${items}</ul>`;
		formErrorSummary.classList.remove("hidden");
	};

	openTalentTriggers.forEach((trigger) => {
		trigger.setAttribute("aria-controls", "talentModal");
		trigger.setAttribute("aria-expanded", "false");
	});

	openTalentTriggers.forEach((trigger) => {
		trigger.addEventListener("click", (event) => {
			event.preventDefault();
			lastFocusedTrigger = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
			openTalentModal();
		});
	});

	closeTalentTriggers.forEach((trigger) => {
		trigger.addEventListener("click", () => {
			cancelTalentFlow();
		});
	});

	if (companyMailtoLink) {
		companyMailtoLink.addEventListener("click", (event) => {
			event.preventDefault();
			cancelTalentFlow();
			window.location.href = companyMailtoLink.getAttribute("href") || "mailto:contacto@nexova.com";
		});
	}

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!talentModal.classList.contains("hidden")) {
			cancelTalentFlow();
		}
	});

	controlledFields.forEach((fieldName) => {
		const field = getField(fieldName);
		if (!field) {
			return;
		}

		const eventName = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "blur";
		field.addEventListener(eventName, () => {
			if (talentModal.classList.contains("hidden")) {
				return;
			}
			validateField(fieldName);
		});
	});

	form.querySelectorAll('input[name="availability"]').forEach((radio) => {
		radio.addEventListener("change", () => {
			if (talentModal.classList.contains("hidden")) {
				return;
			}
			validateField("availability");
		});
	});

	comments.addEventListener("input", () => {
		if (talentModal.classList.contains("hidden")) {
			return;
		}
		updateCommentsCounter();
		validateField("comments");
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const errors = validateAll();
		if (errors.length > 0) {
			showAccumulatedErrors(errors);
			return;
		}

		showAccumulatedErrors([]);

		form.classList.add("hidden");
		successBox.classList.remove("hidden");
	});

	updateCommentsCounter();
});
