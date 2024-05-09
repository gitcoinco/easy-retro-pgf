import EffortIcon from "../../../../../public/builderIdeas/icon/EffortIcon";
import type { MarkDownData } from "./Home";
import Link from "next/link";
import { categoryKeyAndValue, newFilter } from "../Text";
import StatusCheck from "../../../../../public/builderIdeas/icon/StatusCheck";
import StatusNotStart from "../../../../../public/builderIdeas/icon/StatusNotStart";
import StatusInDiscussion from "../../../../../public/builderIdeas/icon/StatusInDiscussion";
import StatusInProgressClose from "../../../../../public/builderIdeas/icon/StatusInProgressClose";
import StatusInProgressOpen from "../../../../../public/builderIdeas/icon/StatusInProgressOpen";
import StatusAbandoned from "../../../../../public/builderIdeas/icon/StatusAbandoned";
import { Tooltip as ReactTooltip } from "react-tooltip";

export function handleStatus(status: string) {
  switch (status) {
    case "not-started":
      return (
        <>
          <StatusNotStart />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              Not Started
            </h6>
          </div>
        </>
      );
    case "in-discussion":
      return (
        <>
          <StatusInDiscussion />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              In Discussion
            </h6>
          </div>
        </>
      );
    case "in-progress-open":
      return (
        <>
          <StatusInProgressOpen />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              In Progress Open
            </h6>
          </div>
        </>
      );
    case "in-progress-closed":
      return (
        <>
          <StatusInProgressClose />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              In Progress - Closed
            </h6>
          </div>
        </>
      );
    case "completed":
      return (
        <>
          <StatusCheck />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              Completed
            </h6>
          </div>
        </>
      );
    case "abandoned":
      return (
        <>
          <StatusAbandoned />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              Abandoned
            </h6>
          </div>
        </>
      );

    default:
      return (
        <>
          <StatusNotStart />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-gray-900">
              Not Started
            </h6>
          </div>
        </>
      );
  }
}

export default function GridCard({
  data,
}: {
  data: Omit<MarkDownData, "contentHtml">;
}) {
  // {data.contribution["execution-status"]}

  return (
    <div className="flex h-full flex-col gap-4 border p-3 hover:border-outline-dark">
      <div className="flex items-center justify-between">
        <div
          data-tooltip-id={data.contributions["execution-status"]}
          className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 hover:bg-gray-100"
        >
          {handleStatus(data.contributions["execution-status"])}

          <ReactTooltip
            opacity={100}
            id={data.contributions["execution-status"]}
            place="top"
            variant="error"
            style={{ zIndex: 99 ,backgroundColor: "#6c7283" }}
            className="text-sm font-light"
            content={
              newFilter["execution-status"].find(
                (elem) => elem.id === data.contributions["execution-status"],
              )?.description
            }
          />
        </div>
      </div>

      <div>
        <Link
          className="mb-2 line-clamp-1 text-base font-semibold text-primary-dark hover:underline"
          href={`/builderIdeas/${data.id}`}
        >
          {data.title}
        </Link>
        <p className="line-clamp-2 text-xs font-normal text-onPrimary-light">
          {data.description}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="bg-[#FFEDAC] text-scrim-dark inline-flex w-fit grow-0 cursor-pointer rounded-full px-2 py-1 hover:bg-[#ffedac99] hover:shadow-sm">
          <p className="line-clamp-1 break-all text-xs font-normal">
            {categoryKeyAndValue[data.category]
              ? categoryKeyAndValue[data.category]
              : data.category.replace("-", "")}
          </p>
        </div>
        <div className="inline-flex w-fit cursor-pointer rounded-full bg-slate-50 px-2 py-1 hover:bg-slate-100/90 hover:shadow-sm">
          <h6 className="line-clamp-2 break-all text-xs font-normal text-scrim-dark">
            {data.type}
          </h6>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <EffortIcon />
          <div className="flex items-center gap-1">
            <h6 className="line-clamp-1 text-xs font-medium text-outline-dark">
              {data.effort}
            </h6>
            <h6 className="text-xs font-medium text-outline-dark">Effort</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
