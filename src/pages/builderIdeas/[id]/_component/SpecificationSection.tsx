import type { MarkDownData } from "~/builderIdeas/(navbar)/(home)/component/Home";

export default function SpecificationSection({
  content,
  specificationRef,
}: {
  content: MarkDownData;
  specificationRef: React.MutableRefObject<HTMLElement | null>;
}) {
  // const {title, ...rest} = MarkDownData
  const newContent = content.contentHtml.replace(/<h1>.*?<\/h1>/gs, "");
  return (
    <section
      id="Specification"
      //  min-h-[60vh]
      className="w-auto items-center  border-0 bg-background-dark p-5 sm:p-6 md:p-10 lg:mb-6  lg:border border-outline-dark"
      // @ts-ignore
      ref={specificationRef}
    >
      <h6 className="my-4 mb-6 text-3xl font-bold text-onPrimary-light">
        Specification
      </h6>
      <hr className="mb-4 hidden lg:block" />
      <div
        className="render list-none break-words text-onPrimary-light"
        dangerouslySetInnerHTML={{ __html: newContent }}
      />
    </section>
  );
}
