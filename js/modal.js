import { userData } from './api.js';

const mapContainer = document.querySelector('#map-container');
const mapButton = document.querySelector('#map-btn');


const modalBuy = document.querySelector('.modal--buy');
const payMethodsListBuy = modalBuy.querySelector('.modal__select-wrapper select');
const fieldBankCardBuy = modalBuy.querySelector('.bank-card input');
const formBuy = modalBuy.querySelector('.modal__content form');
const btnCloseModalBuy = modalBuy.querySelector('.modal__close-btn');
const overlayBuy = modalBuy.querySelector('.modal__overlay');
const successMessageBuy = modalBuy.querySelector('.modal__validation-message--success');
const errorMessageBuy = modalBuy.querySelector('.modal__validation-message--error');
const exchangeAllRub = modalBuy.querySelector('.exchange-all-rub');


const modalSell = document.querySelector('.modal--sell');
const payMethodsListSell = modalSell.querySelector('.modal__select-wrapper select');
const fieldBankCardSell = modalSell.querySelector('.bank-card input');
const formSell = modalSell.querySelector('.modal__content form');
const btnCloseModalSell = modalSell.querySelector('.modal__close-btn');
const overlaySell = modalSell.querySelector('.modal__overlay');
const successMessageSell = modalSell.querySelector('.modal__validation-message--success');
const errorMessageSell = modalSell.querySelector('.modal__validation-message--error');
const exchangeAllKeks = modalSell.querySelector('.exchange-all-keks');

let bankCardNumber = [];

const createPaymentMethods = (elem) => {
  const paymentMethods = elem.paymentMethods;
  bankCardNumber = [];
  if (elem.status === 'seller') {
    payMethodsListBuy.innerHTML = '<option selected disabled value="">Выберите платёжную систему</option>';
    paymentMethods.forEach((item) => {
      const newMethod = document.createElement('option');
      newMethod.textContent = item.provider;
      bankCardNumber.push(item);
      payMethodsListBuy.append(newMethod);
    });

    payMethodsListBuy.addEventListener('change', (evt) => {
      const checkedMethod = evt.target.value;
      bankCardNumber.forEach((item) => {
        if (checkedMethod === item.provider) {
          const bankCard = item.accountNumber;
          fieldBankCardBuy.value = bankCard;
        }
        if (checkedMethod === 'Cash in person') {
          fieldBankCardBuy.placeholder = '';
          fieldBankCardBuy.value = '';
        }
      });
    });
  } else {
    payMethodsListSell.innerHTML = '<option selected disabled value="">Выберите платёжную систему</option>';
    paymentMethods.forEach((item) => {
      const newMethod = document.createElement('option');
      newMethod.textContent = item.provider;
      bankCardNumber.push(item);
      payMethodsListSell.append(newMethod);
    });

    payMethodsListSell.addEventListener('change', (evt) => {
      const checkedMethod = evt.target.value;
      bankCardNumber.forEach((item) => {
        if (checkedMethod === item.provider) {
          const bankCard = item.accountNumber;
          fieldBankCardSell.value = bankCard;
        }
        if (checkedMethod === 'Cash in person') {
          fieldBankCardSell.placeholder = '';
          fieldBankCardSell.value = '';
        }
      });
    });
  }
};

const renderModalDetails = (data) => {

  if (data.status === 'seller') {
    if (!data.isVerified) {
      modalBuy.querySelector('.transaction-info__item--name .transaction-info__data svg').style.display = 'none';
    }

    modalBuy.querySelector('.transaction-info__item--name .transaction-info__data span').textContent = data.userName;
    modalBuy.querySelector('[name="contractorId"]').value = data.id;
    modalBuy.querySelector('[name="exchangeRate"]').value = data.exchangeRate;
    modalBuy.querySelector('.transaction-info__item--exchangerate .transaction-info__data').textContent = `${data.exchangeRate} ₽`;
    modalBuy.querySelector('[name="sendingCurrency"]').value = 'RUB';
    modalBuy.querySelector('[name="receivingCurrency"]').value = 'KEKS';
    modalBuy.querySelector('.transaction-info__item--cashlimit .transaction-info__data').textContent = `${data.minAmount}₽ - ${Math.floor(data.balance.amount * data.exchangeRate)}₽`;

    createPaymentMethods(data);
    modalBuy.querySelector('.crypto-wallet').value = userData.wallet.address;
  }

  if (data.status === 'buyer') {
    if (!data.isVerified) {
      modalSell.querySelector('.transaction-info__item--name .transaction-info__data svg').style.display = 'none';
    }

    modalSell.querySelector('.transaction-info__item--name .transaction-info__data span').textContent = data.userName;
    modalSell.querySelector('[name="contractorId"]').value = data.id;
    modalSell.querySelector('[name="exchangeRate"]').value = data.exchangeRate;
    modalSell.querySelector('.transaction-info__item--exchangerate .transaction-info__data').textContent = `${data.exchangeRate} ₽`;
    modalSell.querySelector('[name="sendingCurrency"]').value = 'KEKS';
    modalSell.querySelector('[name="receivingCurrency"]').value = 'RUB';
    modalSell.querySelector('.transaction-info__item--cashlimit .transaction-info__data').textContent = `${data.minAmount}₽ - ${data.balance.amount}₽`;

    createPaymentMethods(userData);
    modalSell.querySelector('.crypto-wallet').value = data.wallet.address;
  }


  userData.balances.forEach((item) => {
    if (item.currency === 'RUB') {
      exchangeAllRub.value = item.amount;
    } else {
      exchangeAllKeks.value = item.amount;
    }
  });
};

const openModal = (contractors) => {
  mapContainer.classList.add('visually-hidden');
  document.body.classList.add('scroll-lock');
  if (contractors.status === 'seller') {
    successMessageBuy.style.display = 'none';
    errorMessageBuy.style.display = 'none';
    modalBuy.style.display = 'block';
  } else {
    successMessageSell.style.display = 'none';
    errorMessageSell.style.display = 'none';
    modalSell.style.display = 'block';
  }
  renderModalDetails(contractors);
};

function closeModalBuy () {
  if (mapButton.classList.contains('is-active')) {
    mapContainer.classList.remove('visually-hidden');
  }
  modalBuy.style.display = 'none';
  document.body.classList.remove('scroll-lock');
  formBuy.reset();
}

function closeModalSell () {
  modalSell.style.display = 'none';
  document.body.classList.remove('scroll-lock');
  formSell.reset();
}

overlayBuy.addEventListener('click', closeModalBuy);
btnCloseModalBuy.addEventListener('click', closeModalBuy);

overlaySell.addEventListener('click', closeModalSell);
btnCloseModalSell.addEventListener('click', closeModalSell);

export {openModal};
