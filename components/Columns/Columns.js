//NextJs/Components/Columns/Columns.js
"use client";

import React from "react";

export const Columns = ({
  children,
  textColor,
  backgroundColor,
  customClasses,
  customId,
}) => {
  return (
    <div
      className={`py-4 ${customClasses}`}
      style={{ color: textColor, backgroundColor }}
      id={customId}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          const originalClass = child.props?.className || "";
          const order = child.props?.order || "";

          return (
            <React.Fragment key={child.key || `column-${index}`}>
              {React.cloneElement(child, {
                className: `${originalClass} ${order}`.trim(),
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
