import { createElement } from "react";
import { twclsx } from "../../libs/twclsx";

export type UnstyledButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const UnstyledButton: React.FunctionComponent<UnstyledButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return createElement(
    "button",
    {
      ...props,
      className: twclsx("inline-flex items-center justify-center", className)
    },
    children
  );
};
