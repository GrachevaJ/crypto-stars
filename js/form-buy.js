import { sendData } from './api.js';

const formBuy = document.querySelector('.modal-buy');

const PASSWORD = '180712';

const sendingField = formBuy.querySelector('[name="sendingAmount"]');
const receivingField = formBuy.querySelector('[name="receivingAmount"]');
const dataExchangeRate = formBuy.querySelector('.transaction-info__item--exchangerate .transaction-info__data');
const limit = formBuy.querySelector('.transaction-info__item--cashlimit .transaction-info__data');
const btnExchangeAllRub = formBuy.querySelector('.exchange-all-rub');
const passwordField = formBuy.querySelector('[name="paymentPassword"]');
const successMessage = formBuy.querySelector('.modal__validation-message--success');
const errorMessage = formBuy.querySelector('.modal__validation-message--error');

const pristineBuy = new Pristine(formBuy, {
  classTo: 'form-validate',
  errorClass: 'form-validate--invalid',
  successClass: 'form-validate--valid',
  errorTextParent: 'form-validate',
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

function convertRubInKeks () {
  const keks = sendingField.value / getExchangeRate(dataExchangeRate.textContent);
  receivingField.value = keks;
}
function convertKeksInRub () {
  const rub = receivingField.value * getExchangeRate(dataExchangeRate.textContent);
  sendingField.value = rub;
}

function validateSendingField (value) {
  convertRubInKeks();
  return value >= getMinLimit(limit.textContent) && value <= getMaxLimit(limit.textContent);
}

function validateReceivingField (value) {
  convertKeksInRub();
  const keksMax = getMaxLimit(limit.textContent) / getExchangeRate(dataExchangeRate.textContent);
  return value <= keksMax;
}

passwordField.addEventListener('click', () => {
  passwordField.value = '';
});


btnExchangeAllRub.addEventListener('click', () => {
  sendingField.value = btnExchangeAllRub.value;
  validateSendingField();
});

function validatePassword (password) {
  return password === PASSWORD;
}

btnExchangeAllRub.addEventListener('click', validateReceivingField);
sendingField.addEventListener('change', validateReceivingField);
receivingField.addEventListener('change', validateReceivingField);

pristineBuy.addValidator(receivingField, validateReceivingField);
pristineBuy.addValidator(sendingField, validateSendingField, 'Введите сумму согласно лимиту');
pristineBuy.addValidator(passwordField, validatePassword, 'Введен неверный пароль');


const showErrorMessage = () => {
  errorMessage.style.display = 'block';
  errorMessage.classList.add('modal__validation-message');
};

const showSuccessMessage = () => {
  successMessage.style.display = 'block';
  successMessage.classList.add('modal__validation-message');
};

const setFormBuySubmit = () => {
  formBuy.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristineBuy.validate();
    if (isValid) {
      sendData(
        () => showSuccessMessage(),
        () => showErrorMessage(),
        new FormData(evt.target));
    }
  });
};

export {setFormBuySubmit, PASSWORD};
