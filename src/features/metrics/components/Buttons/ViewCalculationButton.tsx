import { ArrowUpRight } from "lucide-react";
import { Button } from "./Button";

export function ViewCalculationButton() {
  return (
    <Button variant="link" iconRight={ArrowUpRight}>
      {"View calculation"}
    </Button>
  );
}
