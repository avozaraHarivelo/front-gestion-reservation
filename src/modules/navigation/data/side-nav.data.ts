import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: 'OPTION',
        items: ['reservation'],
    },
];

export const sideNavItems: SideNavItems = {
   
    reservation: {
        icon: 'table',
        text: 'Réservation',
        link: '/reservation',
    },
};
