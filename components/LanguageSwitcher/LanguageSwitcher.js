'use client'
import { usePathname } from 'next/navigation';
import React from 'react';

export const LanguageSwitcher = () => {
    const pathname = usePathname();
    
    //console.log('Current pathname:', pathname, typeof pathname);

    const getOtherLangPath = (currentPath, targetLang) => {
        if (typeof currentPath !== 'string') {
            console.error('Expected string for currentPath, got:', typeof currentPath);
            return '/';
        }
        const pathParts = currentPath.split('/');
        pathParts[1] = targetLang;
        return pathParts.join('/');
    };

    const currentLang = pathname && typeof pathname === 'string' ? pathname.split('/')[1] : 'fr';

    return (
        <div className="flex langSwitcher border-none items-center	">
            <a 
                href={getOtherLangPath(pathname, 'fr')}
                className={`px-1 py-1 ${currentLang === 'fr' ? 'font-bold' : ''}`}
            >
                FR
            </a>
            <span>&nbsp;|&nbsp;</span>
            <a 
                href={getOtherLangPath(pathname, 'en')}
                className={`px-1 py-1 ${currentLang === 'en' ? 'font-bold' : ''}`}
            >
                EN
            </a>
        </div>
    );
};