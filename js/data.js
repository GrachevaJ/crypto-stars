import { showList } from './map.js';
import { openModal} from './modal.js';

const usersTemplate = document.querySelector('#user-table-row__template').content;
const usersList = document.querySelector('.users-list__table-body');
const verified = document.querySelector('input[id="checked-users"]');
const filterUsers = document.querySelector('.users-nav .tabs__controls');
const errorMessage = document.querySelector('#server-error');

let userStatus = '';
let usersContainer = [];

const createSellersData = (seller) => {
  const user = usersTemplate.cloneNode(true);
  user.querySelector('.users-list__table-name span').textContent = seller.userName;
  if (!seller.isVerified) {
    user.querySelector('.users-list__table-name svg').style.display = 'none';
  }
  user.querySelector('.users-list__table-currency').textContent = seller.balance.currency;
  user.querySelector('.users-list__table-exchangerate').textContent = `${seller.exchangeRate} ₽`;
  user.querySelector('.users-list__table-cashlimit').textContent = `${seller.minAmount}₽ - ${(seller.balance.amount * seller.exchangeRate).toFixed(2)}₽`;

  const badgesList = user.querySelector('.users-list__badges-list');
  badgesList.innerHTML = '';
  const badges = seller.paymentMethods;
  badges.forEach((item) => {
    const newBadge = document.createElement('li');
    newBadge.classList.add('badge');
    newBadge.textContent = item.provider;
    badgesList.append(newBadge);

  });
  const btn = user.querySelector('.users-list__table-btn');
  btn.addEventListener('click', () => openModal(seller));
  return user;
};

const createBuyersData = (buyer) => {
  const user = usersTemplate.cloneNode(true);
  user.querySelector('.users-list__table-name span').textContent = buyer.userName;
  if (!buyer.isVerified) {
    user.querySelector('.users-list__table-name svg').style.display = 'none';
  }
  user.querySelector('.users-list__table-currency').textContent = buyer.balance.currency;
  user.querySelector('.users-list__table-exchangerate').textContent = `${buyer.exchangeRate} ₽` ;
  user.querySelector('.users-list__table-cashlimit').textContent = `${buyer.minAmount}₽ - ${buyer.balance.amount}₽`;
  document.querySelector('.users-list__table-payments').style.display = 'none';
  user.querySelector('.users-list__table-payments').textContent = '';

  const btn = user.querySelector('.users-list__table-btn');
  btn.addEventListener('click', () => openModal(buyer));

  return user;
};

const renderSellers = (users) => {

  const fragment = document.createDocumentFragment();

  users.forEach((user) => {
    if (user.status === 'seller') {
      const seller = createSellersData(user);
      fragment.append(seller);
    }
  });

  usersList.append(fragment);
};

const renderBuyers = (users) => {

  const fragment = document.createDocumentFragment();

  users.forEach((user) => {
    if (user.status === 'buyer') {
      const buyer = createBuyersData(user);
      fragment.append(buyer);
    }
  });

  usersList.append(fragment);
};

const turnFilterOn = (loadedUsers) => {
  usersContainer = [...loadedUsers];
  userStatus = 'seller';
};

const checkVerified = () => {
  if (verified.checked) {
    return usersContainer.filter((item) => item.isVerified);
  } else {
    return usersContainer;
  }
};

const filter = () => {
  switch (userStatus) {
    case 'seller':
      return [...usersContainer];
    case 'buyer':
      return [...usersContainer];
  }
};

const renderUsers = (users) => {

  usersList.querySelectorAll('.users-list__table-row').forEach((element) => element.remove());
  if (userStatus === 'seller') {
    renderSellers(users);
  }
  if (userStatus === 'buyer') {
    renderBuyers(users);
  }
};

verified.addEventListener('change', () => renderUsers(checkVerified()));

filterUsers.addEventListener('click', (evt) => {
  const clickedButton = evt.target;
  filterUsers
    .querySelector('.is-active')
    .classList.remove('is-active');
  clickedButton.classList.add('is-active');
  userStatus = clickedButton.id;
  renderUsers(filter());
  renderUsers(checkVerified());

  if (clickedButton.id === 'buyer') {
    document.querySelector('#map-btn').classList.remove('is-active');
    document.querySelector('#list-btn').classList.add('is-active');
    showList();
    renderUsers(filter());
    renderUsers(checkVerified());
  }

});


const onGetDataSuccess = (data) => {
  showList();
  turnFilterOn(data);
  renderUsers(filter());
};

const serverError = () => {
  document.querySelector('#map-container').classList.add('visually-hidden');
  document.querySelector('#server-on').classList.add('visually-hidden');
  errorMessage.style.display = 'block';
};

export {onGetDataSuccess, serverError};
