import { toast } from "sonner";

export async function copyToClipboard({
  text,
  description,
  withToast = true,
}: {
  text: string;
  description?: string;
  withToast?: boolean;
}) {
  try {
    await navigator.clipboard.writeText(text);
    withToast && toast.success("Copied to clipboard", { description });
  } catch (e) {
    withToast && toast.error("Failed copy to clipboard", { description });
    console.error(e);
  }
}
