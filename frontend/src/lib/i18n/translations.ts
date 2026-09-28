import { useState, useEffect } from 'react';
import { useLanguageStore, Language } from '@/store/language-store';

export const translations = {
  en: {
    // Brand & System
    appName: 'Inventory',
    managementSystem: 'Management System',
    
    // Navigation Sections
    sectionMain: 'Main',
    sectionInventory: 'Inventory',
    sectionTransactions: 'Transactions',
    sectionSettings: 'Settings',

    // Nav Links
    navDashboard: 'Dashboard',
    navProducts: 'Products',
    navStock: 'Stock',
    navCustomers: 'Customers',
    navSuppliers: 'Suppliers',
    navEmployees: 'Employees',
    navSales: 'Sales',
    navPurchases: 'Purchases',
    navReturns: 'Returns',
    navPayments: 'Payments',
    navUsers: 'Users',
    navRoles: 'Roles & Access',

    // Actions & Common
    logout: 'Logout',
    account: 'Account',
    signedIn: 'Signed in',
    toggleTheme: 'Toggle theme',
    switchLanguage: 'Switch language',
    notifications: 'Notifications',
    profile: 'Profile',
    english: 'English',
    khmer: 'ភាសាខ្មែរ',
    search: 'Search...',
    refresh: 'Refresh',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    active: 'Active',
    inactive: 'Inactive',
    protected: 'Protected',
    total: 'Total',
    status: 'Status',
    role: 'Role',
    created: 'Created',
    actions: 'Actions',
    username: 'Username',
    email: 'Email',
    fullName: 'Full Name',
    welcomeBack: 'Welcome back',
    signInSubtitle: 'Sign in to manage your warehouse',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    forgotPassword: 'Forgot password?',
    password: 'Password',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',

    // Breadcrumb translations
    dashboard: 'Dashboard',
    products: 'Products',
    stock: 'Stock',
    customers: 'Customers',
    suppliers: 'Suppliers',
    employees: 'Employees',
    sales: 'Sales',
    purchases: 'Purchases',
    returns: 'Returns',
    payments: 'Payments',
    settings: 'Settings',
    users: 'Users',
    roles: 'Roles & Access',
  },
  km: {
    // Brand & System
    appName: 'សារពើភ័ណ្ឌ',
    managementSystem: 'ប្រព័ន្ធគ្រប់គ្រង',

    // Navigation Sections
    sectionMain: 'ទំព័រដើម',
    sectionInventory: 'សារពើភ័ណ្ឌ',
    sectionTransactions: 'ប្រតិបត្តិការ',
    sectionSettings: 'ការកំណត់',

    // Nav Links
    navDashboard: 'ផ្ទាំងគ្រប់គ្រង',
    navProducts: 'ទំនិញ',
    navStock: 'ស្តុកទំនិញ',
    navCustomers: 'អតិថិជន',
    navSuppliers: 'អ្នកផ្គត់ផ្គង់',
    navEmployees: 'បុគ្គលិក',
    navSales: 'ការលក់',
    navPurchases: 'ការទិញចូល',
    navReturns: 'ការបង្វិលសង',
    navPayments: 'ការទូទាត់',
    navUsers: 'អ្នកប្រើប្រាស់',
    navRoles: 'តួនាទី និងសិទ្ធិ',

    // Actions & Common
    logout: 'ចាកចេញ',
    account: 'គណនី',
    signedIn: 'បានចូលប្រើ',
    toggleTheme: 'ប្តូររូបរាង',
    switchLanguage: 'ប្តូរភាសា',
    notifications: 'ការជូនដំណឹង',
    profile: 'ប្រវត្តិរូប',
    english: 'English',
    khmer: 'ភាសាខ្មែរ',
    search: 'ស្វែងរក...',
    refresh: 'ផ្ទុកឡើងវិញ',
    add: 'បន្ថែម',
    edit: 'កែសម្រួល',
    delete: 'លុប',
    cancel: 'បោះបង់',
    save: 'រក្សាទុក',
    active: 'សកម្ម',
    inactive: 'អសកម្ម',
    protected: 'ការពារ',
    total: 'សរុប',
    status: 'ស្ថានភាព',
    role: 'តួនាទី',
    created: 'កាលបរិច្ឆេទបង្កើត',
    actions: 'សកម្មភាព',
    username: 'ឈ្មោះអ្នកប្រើ',
    email: 'អ៊ីមែល',
    fullName: 'ឈ្មោះពេញ',
    welcomeBack: 'សូមស្វាគមន៍ការត្រឡប់មកវិញ',
    signInSubtitle: 'ចូលប្រើប្រាស់ដើម្បីគ្រប់គ្រងឃ្លាំងរបស់អ្នក',
    signIn: 'ចូលប្រើ',
    signingIn: 'កំពុងចូលប្រើ...',
    forgotPassword: 'ភ្លេចពាក្យសម្ងាត់?',
    password: 'ពាក្យសម្ងាត់',
    enterEmail: 'បញ្ចូលអ៊ីមែលរបស់អ្នក',
    enterPassword: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក',

    // Breadcrumb translations
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    products: 'ទំនិញ',
    stock: 'ស្តុកទំនិញ',
    customers: 'អតិថិជន',
    suppliers: 'អ្នកផ្គត់ផ្គង់',
    employees: 'បុគ្គលិក',
    sales: 'ការលក់',
    purchases: 'ការទិញចូល',
    returns: 'ការបង្វិលសង',
    payments: 'ការទូទាត់',
    settings: 'ការកំណត់',
    users: 'អ្នកប្រើប្រាស់',
    roles: 'តួនាទី និងសិទ្ធិ',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang: Language = mounted ? language : 'en';

  const t = (key: TranslationKey | string): string => {
    const dict = translations[currentLang] as Record<string, string>;
    const defaultDict = translations.en as Record<string, string>;
    return dict[key] || defaultDict[key] || key;
  };

  return {
    language: currentLang,
    setLanguage,
    toggleLanguage,
    t,
    isKhmer: currentLang === 'km',
  };
}
