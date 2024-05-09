import LinkIcon from "../../../../../public/builderIdeas/icon/LinkIcon";
import type { MarkDownData } from "./Home";
import Link from "next/link";
import { handleStatus } from "./GridCard";
import { newFilter } from "../Text";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { categoryKeyAndValue } from "../Text";
export default function ListCard({
  currentItems,
}: {
  currentItems: Omit<MarkDownData, "contentHtml">[];
}) {
  return (
    <>
      {currentItems.length !== 0 ? (
        <div className="relative overflow-x-hidden">
          <table className="w-full table-fixed text-left text-sm rtl:text-right ">
            <thead className="text-base font-semibold text-onPrimary-light ">
              <tr>
                <th scope="col" className="w-[40%] px-3 py-4 2xl:w-5/12">
                  <h6 className="text-base/semibold text-onPrimary-light">
                    Project
                  </h6>
                </th>
                <th scope="col" className="w-[40%] px-3 py-4 2xl:w-5/12">
                  <h6 className="text-base/semibold text-onPrimary-light">
                    Category
                  </h6>
                </th>
                <th scope="col" className="flex w-[20%] px-3 py-4 2xl:w-2/12">
                  <h6 className="text-base/semibold shrink-0 text-onPrimary-light">
                    Estimate Effort
                  </h6>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, i) => {
                return (
                  <tr className="border" key={i}>
                    <th className="flex flex-col p-5">
                      <div
                        data-tooltip-id={item.contributions["execution-status"]}
                        className="mb-2.5 flex w-fit cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 pr-2 hover:bg-gray-100"
                      >
                        {handleStatus(item.contributions["execution-status"])}
                        <ReactTooltip
                          opacity={100}
                          id={item.contributions["execution-status"]}
                          place="top"
                          variant="error"
                          style={{ zIndex: 99, backgroundColor: "#6c7283" }}
                          className="text-sm font-light"
                          content={
                            newFilter["execution-status"].find(
                              (elem) =>
                                elem.name ===
                                item.contributions["execution-status"],
                            )?.description
                          }
                        />
                      </div>

                      <Link
                        href={`/builderIdeas/${item.id}`}
                        className="flex cursor-pointer items-center  gap-1 pb-2 "
                      >
                        <h6 className="text-sm font-bold text-primary-dark hover:underline">
                          {item.title}
                        </h6>
                        <LinkIcon />
                      </Link>
                      <p className="line-clamp-2 text-sm font-normal text-onPrimary-light ">
                        {item.description}
                      </p>
                    </th>

                    <td className="px-3 py-4 ">
                      <div className="flex flex-wrap gap-2">
                        <div className="w-fit grow-0 cursor-pointer rounded-full bg-[#FFEDAC] px-2 py-1 text-scrim-dark hover:bg-[#ffedac99]">
                          <p className="line-clamp-1 break-all text-xs font-normal">
                            {categoryKeyAndValue[item.category]
                              ? categoryKeyAndValue[item.category]
                              : item.category.replace("-", "")}
                          </p>
                        </div>
                        <div className="inline-flex w-fit cursor-pointer rounded-full bg-slate-100 px-2 py-1 hover:bg-slate-200/75">
                          <h6 className="line-clamp-1 break-all text-xs font-normal text-scrim-dark">
                            {item.type}
                          </h6>
                        </div>
                        {item.labels.map((subItem, i) => (
                          <div
                            key={i}
                            className="inline-flex w-fit cursor-pointer rounded-full bg-slate-100 px-2 py-1 hover:bg-slate-200/75"
                          >
                            <h6 className="line-clamp-1 break-all text-xs font-normal text-scrim-dark">
                              {subItem}
                            </h6>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <h6 className="text-sm font-normal text-outline-dark">
                        {item.effort}
                      </h6>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h6 className="col-span-1 w-full text-center text-xl font-medium text-gray-500 lg:col-span-2 xl:col-span-3">
          0 Items Found
        </h6>
      )}
    </>
  );
}
