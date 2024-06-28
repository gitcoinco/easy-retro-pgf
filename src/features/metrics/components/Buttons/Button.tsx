import { tv } from "tailwind-variants";
import { Spinner } from "~/components/ui/Spinner";

const buttonClass = tv({
  slots: {
    base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    leftIcon: "size-4",
    rightIcon: "size-4",
  },
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      destructive: "bg-[#ff143c] text-[#f2f8fb] hover:bg-[#ff143c]/90",
      success: "bg-[#e6ffeb] text-[#1f995f] hover:bg-[#e6ffeb]/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-[#f4f8fb] text-[#080c19] hover:bg-[#f4f8fb]/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      xs: "h-8 rounded-md text-xs px-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
    isLoading: {
      true: {
        leftIcon: "animate-spin",
      },
    },
    hasChildren: {
      true: {
        leftIcon: "mr-2",
        rightIcon: "ml-2",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type Variants =
  | "default"
  | "accent"
  | "destructive"
  | "success"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type Sizes = "default" | "xs" | "sm" | "lg" | "icon";

type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: Variants;
  size?: Sizes;
  icon?: any;
  iconLeft?: any;
  iconRight?: any;
  children?: string;
};

export function Button({
  onClick,
  disabled = false,
  isLoading = false,
  variant,
  size,
  icon,
  iconLeft,
  iconRight,
  children,
}: ButtonProps) {
  const { base, rightIcon, leftIcon } = buttonClass({
    variant,
    size,
    hasChildren: !!children,
    isLoading,
  });

  const LeftIcon = isLoading ? Spinner : icon || iconLeft;
  const RightIconElement = iconRight;

  return (
    <button disabled={disabled} onClick={onClick} className={base()}>
      {LeftIcon && <LeftIcon className={leftIcon()} />}
      {children}
      {RightIconElement && <RightIconElement className={rightIcon()} />}
    </button>
  );
}
