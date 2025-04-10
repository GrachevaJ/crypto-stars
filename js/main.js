import { getUserData, getContractorsData } from './api.js';
import { createUserData, hideUserProfile } from './user.js';
import { onGetDataSuccess, serverError } from './data.js';
import './map.js';
import {setFormBuySubmit} from './form-buy.js';
import {setFormSellSubmit} from './form-sell.js';


getUserData(createUserData, hideUserProfile);

getContractorsData(onGetDataSuccess, serverError);

setFormBuySubmit();
setFormSellSubmit();
