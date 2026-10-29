/*jslint browser */

const quantityPattern = /^[1-9]\d{0,5}$/;

function calculate(event) {
    const quantityField = document.getElementById("calc-quantity");
    const productSelect = document.getElementById("calc-product");
    const errorBox = document.getElementById("calc-error");
    const resultBox = document.getElementById("calc-result");
    const text = quantityField.value.trim();
    const quantity = parseInt(text, 10);
    const price = parseInt(productSelect.value, 10);
    const total = price * quantity;

    event.preventDefault();
    errorBox.textContent = "";
    resultBox.textContent = "";
    quantityField.classList.remove("is-invalid");

    if (quantityPattern.test(text)) {
        resultBox.textContent = `Стоимость заказа: ${total.toLocaleString("ru-RU")} ₽`;
    } else {
        errorBox.textContent = "Введите целое число от 1 до 999999: только цифры, без пробелов и других символов.";
        quantityField.classList.add("is-invalid");
    }
}

function init() {
    const button = document.getElementById("calc-button");
    button.addEventListener("click", calculate);
}

window.addEventListener("DOMContentLoaded", init);