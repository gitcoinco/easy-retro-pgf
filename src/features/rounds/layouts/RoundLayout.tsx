import { type PropsWithChildren } from "react";
import { BaseLayout } from "~/layouts/BaseLayout";
import { Layout } from "~/layouts/DefaultLayout";

export function RoundLayout(props: PropsWithChildren) {
  return <Layout {...props} />;
}
