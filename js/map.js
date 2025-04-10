import { getContractorsData } from './api.js';
import { serverError } from './data.js';
import { openModal } from './modal.js';

const usersList = document.querySelector('.users-list');
const mapContainer = document.querySelector('#map-container');
const tabsListOrMap = document.querySelector('.users-nav__tabs .list-map');
const baloonTemplate = document.querySelector('#map-baloon__template').content;
const verified = document.querySelector('input[id="checked-users"]');

let usersContainer = [];

const showMap = () => {
  usersList.classList.add('visually-hidden');
  mapContainer.classList.remove('visually-hidden');
  mapContainer.style.display = 'block';
};

const showList = () => {
  mapContainer.classList.add('visually-hidden');
  usersList.classList.remove('visually-hidden');
  usersList.style.display = 'block';
};

const map = L.map('map').on('load', showMap)
  .setView({
    lat: 59.92749,
    lng: 30.31127,
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const markerGroup = L.layerGroup().addTo(map);
const createBaloon = (data) => {
  const userCard = baloonTemplate.cloneNode(true);

  userCard.querySelector('.user-card__user-name span').textContent = data.userName;
  if (!data.isVerified) {
    userCard.querySelector('.user-card__user-name svg').style.display = 'none';
  }
  userCard.querySelector('.currency').textContent = data.balance.currency;
  userCard.querySelector('.exchangeRate').textContent = data.exchangeRate;
  userCard.querySelector('.limit').textContent = `${data.minAmount}₽ - ${Math.floor(data.balance.amount * data.exchangeRate)}₽`;

  const badgesList = userCard.querySelector('.user-card__badges-list');
  badgesList.innerHTML = '';
  const badges = data.paymentMethods;
  badges.forEach((item) => {
    const newBadge = document.createElement('li');
    newBadge.classList.add('badge');
    newBadge.textContent = item.provider;
    badgesList.append(newBadge);
  });

  const btn = userCard.querySelector('.user-card__change-btn');
  btn.addEventListener('click', () => openModal(data));

  return userCard;

};

const iconVerifiedUser = L.icon({
  iconUrl: 'img/pin-verified.svg',
  iconSize: [30, 60],
  iconAnchor: [15, 60],
});

const iconUser = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [30, 60],
  iconAnchor: [15, 60],
});

const createPinMarkers = (data, icon) => {

  const {coords} = data;
  const cardPopup = createBaloon(data);
  const lat = coords.lat;
  const lng = coords.lng;


  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(cardPopup);
};


const turnFilterOn = (loadedUsers) => {
  usersContainer = [...loadedUsers];
};

const checkVerified = () => {
  if (verified.checked) {
    return usersContainer.filter((item) => item.isVerified);
  } else {
    return usersContainer;
  }
};
const renderBaloon = (cards) => {
  cards
    .slice()
    .filter((card) => card.coords !== undefined)
    .forEach((card) => {
      if (card.isVerified) {
        createPinMarkers(card, iconVerifiedUser);
      } else {
        createPinMarkers(card, iconUser);
      }
    });
};

verified.addEventListener('change', () => {
  markerGroup.clearLayers();
  checkVerified();
  renderBaloon(checkVerified());
}
);

const onOpenMap = (data) => {
  showMap();
  turnFilterOn(data);
  checkVerified();
  renderBaloon(checkVerified());
};

tabsListOrMap.addEventListener('click', (evt) => {
  const clickedButton = evt.target;
  tabsListOrMap
    .querySelector('.is-active')
    .classList.remove('is-active');
  clickedButton.classList.add('is-active');
  document.querySelector('#buyer').classList.remove('is-active');
  document.querySelector('#seller').classList.add('is-active');
  if (clickedButton.id === 'map-btn') {
    getContractorsData(onOpenMap, serverError);
  } else {
    showList();
  }
});


export { showList };
