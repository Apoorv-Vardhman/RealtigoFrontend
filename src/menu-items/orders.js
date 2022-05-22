// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap
};

//-----------------------|| Orders ||-----------------------//

export const orders = {
    id: 'orders',
    type: 'group',
    title: 'App Orders',
    children: [
        {
            id: 'orders-index',
            title: 'Orders',
            type: 'item',
            url: '/orders',
            icon: icons['IconSitemap'],
            breadcrumbs: false
        },
    ]
};
