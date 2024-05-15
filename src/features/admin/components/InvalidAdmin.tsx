import { Heading } from "~/components/ui/Heading";

export function InvalidAdmin() {
  return (
    <div>
      <Heading size="2xl" as="h3">
        Invalid Admin Account
      </Heading>
      <p>Only admins can access this page.</p>
    </div>
  );
}
