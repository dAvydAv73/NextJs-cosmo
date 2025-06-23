"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export const CallToActionButton = ({
  align = "left",
  buttonLabel,
  destination,
  btnclass = "btn",
}) => {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [url, setUrl] = useState('/');

  const btnMap = {
    true : "btninvert",
    false: "btn",
  }

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const parseUrl = (url) => {
    if (typeof url !== 'string') {
      console.warn('URL is not a string:', url);
      return '/';
    }

    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      
      // Check if it's an external URL
      if (url.startsWith('http') || url.startsWith('https')) {
        return url; // Return external URLs as-is
      }

      // Handle internal anchor links
      if (url.startsWith('#')) {
        return url;
      }

      // Handle internal links
      if (url.startsWith('/')) {
        return `/${locale}${url}`;
      }

      // For other cases, try to parse the URL
      try {
        const parsedUrl = new URL(url, currentOrigin);
        if (parsedUrl.origin === currentOrigin) {
          // It's an internal URL
          let path = parsedUrl.pathname;
          if (path.startsWith('/')) {
            path = path.slice(1);
          }
          return `/${locale}/${path}${parsedUrl.hash || ''}`;
        } else {
          // It's an external URL
          return url;
        }
      } catch (error) {
        console.error('Invalid URL:', url);
        return '/';
      }
    }

    // Fallback for server-side rendering
    return url;
  };

  useEffect(() => {
    if (destination?.url) {
      setUrl(parseUrl(destination.url));
    }
  }, [destination]);

  const handleScrollToAnchor = (event, url) => {
    if (url.startsWith('#')) {
      event.preventDefault();
      const elementId = url.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const target = destination?.target || '_self';
  const title = destination?.title;

  return (
    <div className={alignMap[align]}>
      <Link 
        href={url}
        target={target}
        className={`${btnMap[btnclass]} neutra-light`}
        onClick={(e) => handleScrollToAnchor(e, url)}
      >
        {buttonLabel}
      </Link>
    </div>
  );
};