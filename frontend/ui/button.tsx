import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
