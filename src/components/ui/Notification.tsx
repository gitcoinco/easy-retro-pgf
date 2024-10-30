import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { type ComponentProps } from "react";

const notification = tv({
    base: "h-10 flex items-center bg-[#e89e30]/10 rounded-lg  p-4",
});

export const NotificationComponent = createComponent("div", notification);

export const Notification = ({
    title,
    ...props
}: ComponentProps<typeof NotificationComponent>) => {
    return (
        <NotificationComponent {...props}>
            <img src="/ErrorIcon.svg" alt="Error icon" />
            <h1 className="text-[#f88c11] text-sm font-semibold">{title}</h1>
        </NotificationComponent>
    );
};
