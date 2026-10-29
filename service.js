/*jslint browser */

const quantityPattern = /^[1-9]\d{0,5}$/;

// Цены: у футболки есть опции (select), у духов есть свойство (чекбокс).
const catalog = {
    perfume: {
        price: 15000,
        propertyPrice: 500
    },
    shirt: {
        options: {
            classic: 0,
            limited: 2500,
            premium: 1000
        },
        price: 5000
    },
    ticket: {
        price: 2000
    }
};

function updatePrice() {
    const quantityField = document.getElementById("quantity");
    const errorBox = document.getElementById("quantity-error");
    const optionsGroup = document.getElementById("options-group");
    const propertyGroup = document.getElementById("property-group");
    const optionSelect = document.getElementById("product-option");
    const propertyBox = document.getElementById("product-property");
    const totalBox = document.getElementById("total");
    const typeRadio = document.querySelector("input[name='product-type']:checked");
    const product = catalog[typeRadio.value];
    const text = quantityField.value.trim();
    const isValid = quantityPattern.test(text);
    const hasOptions = product.options !== undefined;
    const hasProperty = product.propertyPrice !== undefined;
    let unitPrice = product.price;

    // Показываем или скрываем select и чекбокс в зависимости от типа товара.
    optionsGroup.classList.toggle("d-none", !hasOptions);
    propertyGroup.classList.toggle("d-none", !hasProperty);

    if (hasOptions) {
        unitPrice += product.options[optionSelect.value];
    }
    if (hasProperty && propertyBox.checked) {
        unitPrice += product.propertyPrice;
    }

    quantityField.classList.toggle("is-invalid", !isValid);
    if (isValid) {
        errorBox.textContent = "";
        totalBox.textContent = `${(unitPrice * parseInt(text, 10)).toLocaleString("ru-RU")} ₽`;
    } else {
        errorBox.textContent = "Введите целое число от 1 до 999999: только цифры.";
        totalBox.textContent = "—";
    }
}

function init() {
    const form = document.getElementById("calc-form");

    form.addEventListener("input", updatePrice);
    form.addEventListener("change", updatePrice);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });
    updatePrice();
}

window.addEventListener("DOMContentLoaded", init);
