import { sendData } from './api.js';
import { PASSWORD } from './form-buy.js';

const formSell = document.querySelector('.modal-sell');

const sendingField = formSell.querySelector('[name="sendingAmount"]');
const receivingField = formSell.querySelector('[name="receivingAmount"]');
const dataExchangeRate = formSell.querySelector('.transaction-info__item--exchangerate .transaction-info__data');
const limit = formSell.querySelector('.transaction-info__item--cashlimit .transaction-info__data');
const btnExchangeAllRub = formSell.querySelector('.exchange-all-rub');
const btnExchangeAllKeks = formSell.querySelector('.exchange-all-keks');
const passwordField = formSell.querySelector('[name="paymentPassword"]');
const successMessage = formSell.querySelector('.modal__validation-message--success');
const errorMessage = formSell.querySelector('.modal__validation-message--error');


const pristineSell = new Pristine(formSell, {
  classTo: 'form-sell',
  errorClass: 'form-sell--invalid',
  successClass: 'form-sell--valid',
  errorTextParent: 'form-sell',
  errorTextTag: 'span',
  errorTextClass: 'custom-input__error'
});

function getMinLimit(string) {
  const min = string.split('-')[0];
  return Number(min.slice(0, -2));
}

function getMaxLimit (string) {
  const max = string.split('-')[1];
  return Number(max.slice(0, -1));
}

function getExchangeRate (string) {
  return Number(string.slice(0, -1));
}

function convertKeksInRub () {
  const rub = sendingField.value * getExchangeRate(dataExchangeRate.textContent);
  receivingField.value = rub;
  return receivingField.value;
}
function convertRubInKeks () {
  const keks = receivingField.value / getExchangeRate(dataExchangeRate.textContent);
  sendingField.value = keks;
  return sendingField.value;
}

function validateSendingField (value) {
  convertKeksInRub();
  return value <= btnExchangeAllKeks.value;
}

function validateReceivingField (value) {
  convertRubInKeks();
  return value >= getMinLimit(limit.textContent) && value <= getMaxLimit(limit.textContent);
}

function validatePassword (password) {
  return password === PASSWORD;
}
btnExchangeAllKeks.addEventListener('click', () => {
  sendingField.value = btnExchangeAllKeks.value;
  validateSendingField();
  pristineSell.reset();
});

btnExchangeAllRub.addEventListener('click', () => {
  receivingField.value = getMaxLimit(limit.textContent);
  validateReceivingField();
});


sendingField.addEventListener('change', validateSendingField);
receivingField.addEventListener('change', validateSendingField);
pristineSell.addValidator(sendingField, validateSendingField, 'Недостаточно KEKS');
pristineSell.addValidator(receivingField, validateReceivingField, 'Введите сумму согласно лимиту');
pristineSell.addValidator(passwordField, validatePassword, 'Введен неверный пароль');


const showErrorMessage = () => {
  errorMessage.style.display = 'block';
  errorMessage.classList.add('modal__validation-message');
};

const showSuccessMessage = () => {
  successMessage.style.display = 'block';
  successMessage.classList.add('modal__validation-message');
};

const setFormSellSubmit = () => {
  formSell.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristineSell.validate();
    if (isValid) {
      sendData(
        () => showSuccessMessage(),
        () => showErrorMessage(),
        new FormData(evt.target));
    }

  });
};

export {setFormSellSubmit};