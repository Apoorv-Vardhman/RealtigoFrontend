// assets
import { IconBrandChrome, IconHelp, IconSitemap ,IconUsers} from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap,
    IconUsers:IconUsers
};

//-----------------------|| Orders ||-----------------------//

export const sliders = {
    id: 'sliders',
    type: 'group',
    children: [
        {
            id: 'sliders-index',
            title: 'Sliders',
            type: 'item',
            url: '/sliders',
            icon: icons['IconSitemap'],
            breadcrumbs: false
        },
        {
            id: 'users-index',
            title: 'Users',
            type: 'item',
            url: '/users',
            icon: icons['IconUsers'],
            breadcrumbs: false
        },
        {
            id: 'users-index-deleted',
            title: 'Deleted users',
            type: 'item',
            url: '/users/deleted',
            icon: icons['IconUsers'],
            breadcrumbs: false
        },
    ]
};
