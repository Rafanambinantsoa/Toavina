import { Category2, ClipboardText, People, DollarSquare, UserOctagon, BookSaved, Receipt, Setting2 } from 'iconsax-react';

export const navbarItems = [
    { label: 'Tableau de bord', icon: <Category2 />, path: '/' },
    { label: 'Projets', icon: <ClipboardText />, path: '/projects' },
    { label: 'Clients', icon: <People />, path: '/clients' },
    { label: 'Devis', icon: <DollarSquare />, path: '/quotes' },
    { label: 'Ouvriers', icon: <UserOctagon />, path: '/workers' },
    { label: 'Bibliothèque', icon: <BookSaved />, path: '/library' },
    { label: 'Factures', icon: <Receipt />, path: '/invoices' },
    { label: 'Paramètres', icon: <Setting2 />, path: '/settings' },
];