import React from "react";

interface OptionProp {
    value: string | number;
    name: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    choices: OptionProp[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ choices, ...props }, ref) => {
        return (
            <select ref={ref} {...props}>
                {choices.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                        {choice.name}
                    </option>
                ))}
            </select>
        );
    }
);
Select.displayName = "Select";
export default Select;
