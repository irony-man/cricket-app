import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <label
        {...props}
        ref={ref}
      >
        {children}
      </label>
    );
  },
);
Label.displayName = "Label";
export default Label;
