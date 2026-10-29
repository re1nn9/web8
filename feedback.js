/*jslint browser */
"use strict";

// Адрес отправки формы: замените YOUR_FORM_ID на ID вашей формы в formcarry.com
const FORM_URL = "https://formcarry.com/s/YOUR_FORM_ID";
const STORAGE_KEY = "feedbackFormData";
const POPUP_HASH = "#feedback";
const FIELD_NAMES = ["fullname", "email", "phone", "organization", "message"];

const popup = document.getElementById("feedback-popup");
const form = document.getElementById("feedback-form");
const openButton = document.getElementById("feedback-open");
const closeButton = document.getElementById("feedback-close");
const submitButton = document.getElementById("feedback-submit");
const statusBox = document.getElementById("feedback-status");
const agreeBox = document.getElementById("feedback-agree");

// ---------- LocalStorage ----------

function saveFormData() {
    const data = {agree: agreeBox.checked};
    FIELD_NAMES.forEach(function (name) {
        data[name] = form.elements[name].value;
    });
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (ignore) {
        // хранилище недоступно (приватный режим и т. п.) - просто не сохраняем
    }
}

function restoreFormData() {
    let data = null;
    try {
        data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (ignore) {
        data = null;
    }
    if (!data) {
        return;
    }
    FIELD_NAMES.forEach(function (name) {
        if (typeof data[name] === "string") {
            form.elements[name].value = data[name];
        }
    });
    agreeBox.checked = data.agree === true;
}

function clearFormData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (ignore) {
        // ничего страшного
    }
    form.reset();
}

// ---------- Сообщения пользователю ----------

function showStatus(text, isError) {
    statusBox.textContent = text;
    statusBox.className = "alert mt-2 mb-0 py-2 " + (
        isError
            ? "alert-danger"
            : "alert-success"
    );
    statusBox.hidden = false;
}

function hideStatus() {
    statusBox.hidden = true;
    statusBox.textContent = "";
}

// ---------- Попап и History API ----------

function showPopup() {
    popup.hidden = false;
    document.body.classList.add("popup-open");
    form.elements.fullname.focus();
}

function hidePopup() {
    popup.hidden = true;
    document.body.classList.remove("popup-open");
    hideStatus();
    openButton.focus();
}

function openPopup() {
    if (!popup.hidden) {
        return;
    }
    history.pushState({feedback: true}, "", POPUP_HASH);
    showPopup();
}

function closePopup() {
    if (popup.hidden) {
        return;
    }
    if (history.state && history.state.feedback) {
        // popstate сам закроет форму
        history.back();
    } else {
        // страницу открыли сразу по ссылке с #feedback
        history.replaceState(null, "", location.pathname + location.search);
        hidePopup();
    }
}

window.addEventListener("popstate", function () {
    if (location.hash === POPUP_HASH) {
        showPopup();
    } else {
        hidePopup();
    }
});

openButton.addEventListener("click", openPopup);
closeButton.addEventListener("click", closePopup);

popup.addEventListener("click", function (event) {
    if (event.target === popup) {
        closePopup();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePopup();
    }
});

// ---------- Отправка через fetch ----------

async function sendForm(event) {
    event.preventDefault();
    hideStatus();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const payload = {};
    FIELD_NAMES.forEach(function (name) {
        payload[name] = form.elements[name].value.trim();
    });

    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    try {
        const response = await fetch(FORM_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        clearFormData();
        showStatus("Спасибо! Ваше сообщение отправлено.", false);
    } catch (ignore) {
        showStatus(
            "Не удалось отправить сообщение. Попробуйте ещё раз позже.",
            true
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Отправить";
    }
}

form.addEventListener("submit", sendForm);
form.addEventListener("input", saveFormData);
form.addEventListener("change", saveFormData);

// ---------- Старт ----------

restoreFormData();

if (location.hash === POPUP_HASH) {
    showPopup();
}
