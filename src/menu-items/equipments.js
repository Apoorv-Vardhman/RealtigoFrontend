// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap
};

//-----------------------|| Orders ||-----------------------//

export const equipments = {
    id: 'equipments',
    type: 'group',
    children: [
        {
            id: 'equipments-index',
            title: 'Equipments',
            type: 'item',
            url: '/equipments',
            icon: icons['IconSitemap'],
            breadcrumbs: false
        },
    ]
};
