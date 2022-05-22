// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap
};

//-----------------------|| Services ||-----------------------//

export const services = {
    id: 'services',
    type: 'group',
    title: 'App Services',
    children: [
        {
            id: 'services',
            title: 'Services',
            type: 'collapse',
            icon: icons['IconBrandChrome'],
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Services Category',
                    type: 'item',
                    url: '/services/categories',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Services',
                    type: 'item',
                    url: '/services',
                    breadcrumbs: false
                }
            ]
        }
    ]
};
