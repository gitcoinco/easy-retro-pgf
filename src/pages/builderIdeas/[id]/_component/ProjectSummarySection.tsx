import type { MarkDownData } from "~/builderIdeas/(navbar)/(home)/component/Home";

export default function ProjectSummarySection({
  content,
}: {
  content: MarkDownData;
}) {
  return (
    <section
      id="ProjectSummary"
      className="w-auto items-center bg-background-dark p-4 lg:mx-10 lg:mb-6 lg:rounded-md lg:shadow-md"
    >
      <div className="mx-4 my-4 text-xl font-bold text-gray-900">
        Project Summary
      </div>
      <hr className="mx-4 my-6 hidden border-t border-gray-300 lg:block" />
      <div className="mx-4 flex text-gray-500">
        Proposing Delegate:<p className="font-bold">&nbsp;Rabbithole</p>
      </div>
      <div className="mx-4 flex text-gray-500">
        Proposal&nbsp;
        <p className="text-decoration-line: underline">Tier</p>:&nbsp;
        <p className="text-decoration-line: underline">Fledgling</p>
      </div>
      <div className="mx-4 flex text-gray-500">
        Baseline grant amount:
        <p className="font-bold">&nbsp;200,000 OP</p>
      </div>
      <div className="mx-4 flex text-gray-500">
        Should this Foundation Mission be fulfilled by one or multiple
        applicants:<p className="font-bold">&nbsp;Multiple</p>
      </div>

      <div className="mx-4 mt-4 flex text-gray-500">
        Start date:<p className="font-bold">&nbsp;ASAP</p>
      </div>
      <div className="mx-4 flex text-gray-500">
        Completion date:<p className="font-bold">&nbsp;8/31/2024</p>
      </div>

      <div className="mx-4 my-4">
        <button className="h-[48px] w-[144px] rounded-md border bg-red-600 px-4 py-2 text-white hover:bg-red-500">
          Apply
        </button>
      </div>
    </section>
  );
}
