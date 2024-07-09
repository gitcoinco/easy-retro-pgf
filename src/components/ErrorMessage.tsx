import { AlertCircle } from "lucide-react";
import { Alert } from "./ui/Alert";

export function ErrorMessage({ error }: { error?: { message: string } }) {
  return (
    <Alert icon={AlertCircle} variant={"warning"} title={Error}>
      {error?.message}
    </Alert>
  );
}
