import { Markdown } from "~/components/ui/Markdown";

export function InvalidAdmin() {
  return (
    <div>
      <Markdown>{`### Invalid Admin Account
  Only admins can access this page.

  `}</Markdown>
    </div>
  );
}
