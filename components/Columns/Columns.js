//NextJs/Components/Columns/Columns.js
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
        {React.Children.map(children, (child, index) => (
          <React.Fragment key={child.key || `column-${index}`}>
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${
                child.props.order || ""
              }`.trim(),
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
