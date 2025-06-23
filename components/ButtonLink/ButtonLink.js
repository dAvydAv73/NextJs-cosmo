import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const ButtonLink = ({
  destination,
  label,
  className = "",
}) => {
  return (
    <a 
      href={destination}
      className={`contactLink ${className}`}
    >
        <FontAwesomeIcon icon={faEnvelope} />
      
    </a>
  );
};

/*
 <a 
      href={destination}
      className={`contactLink ${className}`}
    >
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">
        <FontAwesomeIcon icon={faEnvelope} />
      </span>
    </a>
    */