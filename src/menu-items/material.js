// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap
};

//-----------------------|| materials ||-----------------------//

export const materials = {
    id: 'materials',
    type: 'group',
    children: [
        {
            id: 'materials',
            title: 'Materials',
            type: 'collapse',
            icon: icons['IconBrandChrome'],
            children: [
                {
                    id: 'material-category',
                    title: 'Material',
                    type: 'item',
                    url: '/materials',
                    breadcrumbs: false
                },
                {
                    id: 'material-products',
                    title: 'Material Products',
                    type: 'item',
                    url: '/material-products',
                    breadcrumbs: false
                },
                {
                    id: 'material-attributes',
                    title: 'Material Attributes',
                    type: 'item',
                    url: '/attributes',
                    breadcrumbs: false
                }
            ]
        }
    ]
};
