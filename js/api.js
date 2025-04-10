let userData = [];

const getUserData = (onSuccess, onFail) => {
  fetch('https://cryptostar.grading.htmlacademy.pro/user')
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
      userData = data;
    })
    .catch(() => onFail());
};

const getContractorsData = (onSuccess, onFail) => {
  fetch('https://cryptostar.grading.htmlacademy.pro/contractors')
    .then((responce) => responce.json())
    .then((data) => onSuccess(data))
    .catch(() => onFail());
};

const sendData = (onSuccess, onFail, body) => {
  fetch('https://cryptostar.grading.htmlacademy.pro/',
    {
      method: 'POST',
      body,
    },
  )
    .then((responce) => {
      if(responce.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
};

export {getUserData, getContractorsData, sendData, userData};
