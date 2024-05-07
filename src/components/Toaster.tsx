import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group "
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "dark:bg-surfaceContainerLow-dark bg-white font-sans w-full flex gap-2 p-4 border-2 rounded-xl",
          error: "group-[.toaster]:border-red-950 text-red-500",
          title: "font-bold tracking-wider -mt-1",
          description: "text-sm",
        },
      }}
    />
  );
}
