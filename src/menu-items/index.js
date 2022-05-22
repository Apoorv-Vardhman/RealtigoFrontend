import { dashboard } from './dashboard';
import {services} from "./services";
import {orders} from "./orders";
import {equipments} from "./equipments";
import {materials} from "./material";
import {sliders} from "./sliders";

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
    items: [dashboard, services,equipments,materials,orders,sliders]
};

export default menuItems;
