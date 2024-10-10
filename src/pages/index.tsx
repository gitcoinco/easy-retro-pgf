import { Header, Hero, InfoSection, Footer } from "~/components/LoadingPage";
import { BaseLayout } from "~/layouts/BaseLayout";

export default function ProjectsPage({ }) {
  return (

    <BaseLayout header={<Header />} customClassName="px-3 md:px-20 max-w-full">
      <Hero />
      <InfoSection />
      <Footer />
    </BaseLayout>
  );
}

