const userProfile = document.querySelector('.user-profile');

const createUserData = (data) => {
  userProfile.querySelector('.user-profile__name').textContent = data.userName;
  const balances = Array.from(data.balances);
  let cryptoBalance = 0;
  let rubleBalance = 0;
  balances.forEach((element) => {
    if (element.currency === 'KEKS') {
      cryptoBalance += element.amount;
    }
    if (element.currency === 'RUB') {
      rubleBalance += element.amount;
    }
  });

  userProfile.querySelector('#user-crypto-balance').textContent = cryptoBalance;
  userProfile.querySelector('#user-fiat-balance').textContent = rubleBalance;
};

const hideUserProfile = () => {
  userProfile.style.display = 'none';
};

export { createUserData, hideUserProfile};
