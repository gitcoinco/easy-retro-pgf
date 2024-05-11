import React from "react";
import { Pagination } from "react-headless-pagination";
import ListCard from "./ListCard";
import GridCard from "./GridCard";
import CheckBoxFilter from "./CheckBoxFilter";
import type { CheckBoxStateType, MarkDownData, TabStateType } from "./Home";
import Input from "~/builderIdeas/component/Input";
import SearchIcon from "../../../../../public/builderIdeas/icon/SearchIcon";
import SettingIcon from "../../../../../public/builderIdeas/icon/SettingsIcon";
import SortDropDown from "./SortDropdown";
import GridIcon from "../../../../../public/builderIdeas/icon/GridIcon";
import ListIcon from "../../../../../public/builderIdeas/icon/ListIcon";
import { newFilter } from "../Text";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface ProjectTabProps {
  state: TabStateType;
  setState: React.Dispatch<React.SetStateAction<TabStateType>>;
  checkBox: CheckBoxStateType;
  handleChangeCheckBox: (name: keyof CheckBoxStateType, value: string) => void;
  currentPage: number;
  currentItems: Omit<MarkDownData, "contentHtml">[];
  pageCount: number;
  handlePageClick: (page: number) => void;
  handleClearFilter: () => void;
  search: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function ProjectTab({
  state,
  setState,
  checkBox,
  handleChangeCheckBox,
  currentItems,
  handlePageClick,
  pageCount,
  currentPage,
  handleClearFilter,
  handleSearchChange,
  search,
}: ProjectTabProps) {
  return (
    <div className="animate-slideleft mt-8 overflow-x-hidden">
      {/* 
                ▀█▀ ░█▄─░█ ░█▀▀█ ░█─░█ ▀▀█▀▀ 　 ░█▀▀▀█ ░█▀▀▀ ─█▀▀█ ░█▀▀█ ░█▀▀█ ░█─░█ 　 ░█▀▀▀█ ░█▀▀▀█ ░█▀▀█ ▀▀█▀▀ 　 ░█─── ─█▀▀█ ░█──░█ ░█▀▀▀█ ░█─░█ ▀▀█▀▀ 
                ░█─ ░█░█░█ ░█▄▄█ ░█─░█ ─░█── 　 ─▀▀▀▄▄ ░█▀▀▀ ░█▄▄█ ░█▄▄▀ ░█─── ░█▀▀█ 　 ─▀▀▀▄▄ ░█──░█ ░█▄▄▀ ─░█── 　 ░█─── ░█▄▄█ ░█▄▄▄█ ░█──░█ ░█─░█ ─░█── 
                ▄█▄ ░█──▀█ ░█─── ─▀▄▄▀ ─░█── 　 ░█▄▄▄█ ░█▄▄▄ ░█─░█ ░█─░█ ░█▄▄█ ░█─░█ 　 ░█▄▄▄█ ░█▄▄▄█ ░█─░█ ─░█── 　 ░█▄▄█ ░█─░█ ──░█── ░█▄▄▄█ ─▀▄▄▀ ─░█──
             */}
      <div className="flex flex-col gap-4 ">
        <div className="mt-4 flex items-center gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="w-full">
            <Input
              Icon={<SearchIcon />}
              value={search}
              onChange={handleSearchChange}
              className="min-h-[40px] w-full rounded-full border border-onPrimary-light bg-transparent px-1 py-1.5 text-onPrimary-light placeholder-outline-dark
              
              checked:bg-outline-dark focus:border-2 focus:border-primary-dark focus:shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-30
              "
              placeholder="Search Project"
            />
          </div>

          {/* Small Icon When On Mobile Device (use to open drawer filter) */}
          <div
            onClick={() => setState((prev) => ({ ...prev, drawer: true }))}
            className={`flex max-h-[40px] min-h-[40px] min-w-[44px] max-w-[44px] cursor-pointer items-center gap-2 rounded-full bg-onPrimary-light  px-3 py-2 hover:bg-primary-dark lg:hidden ${
              state.drawer && "bg-primary-dark"
            }`}
          >
            <SettingIcon className="" />
          </div>

          {/*             
                        ░█▀▀▀█ ░█▀▀▀█ ░█▀▀█ ▀▀█▀▀ 　 ░█▀▀█ ▀▀█▀▀ ░█▄─░█ 
                        ─▀▀▀▄▄ ░█──░█ ░█▄▄▀ ─░█── 　 ░█▀▀▄ ─░█── ░█░█░█ 
                        ░█▄▄▄█ ░█▄▄▄█ ░█─░█ ─░█── 　 ░█▄▄█ ─░█── ░█──▀█
                */}

          <div className="hidden flex-wrap items-center justify-end gap-3 lg:flex">
            <SortDropDown state={state} setState={setState} />

            {/* active #161616 ::: inactive #94A3B8 */}
            <div className="hidden h-10 gap-2 rounded-full border  p-1.5 lg:flex">
              <div
                className={`px-1 ${
                  state.view === "g" &&
                  "rounded-bl-xl rounded-br-sm rounded-tl-xl rounded-tr-sm bg-gray-100"
                }`}
                onClick={() => setState((prev) => ({ ...prev, view: "g" }))}
              >
                <GridIcon
                  fill={state.view === "g" ? "#6c7283" : "#fff"}
                  className="block cursor-pointer"
                />
              </div>

              <div className="w-[0.0625rem] border border-gray-200"></div>

              <div
                className={`px-1 ${
                  state.view === "l" &&
                  "rounded-bl-sm rounded-br-xl rounded-tl-sm rounded-tr-xl bg-gray-100"
                }`}
                onClick={() => setState((prev) => ({ ...prev, view: "l" }))}
              >
                <ListIcon
                  fill={state.view === "l" ? "#6c7283" : "#fff"}
                  className="block cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
                    ░█▀▀▀ ▀█▀ ░█─── ▀▀█▀▀ ░█▀▀▀ ░█▀▀█ 　 ░█▀▀█ ▀▀█▀▀ ░█▄─░█ 
                    ░█▀▀▀ ░█─ ░█─── ─░█── ░█▀▀▀ ░█▄▄▀ 　 ░█▀▀▄ ─░█── ░█░█░█ 
                    ░█─── ▄█▄ ░█▄▄█ ─░█── ░█▄▄▄ ░█─░█ 　 ░█▄▄█ ─░█── ░█──▀█
            */}
      {/* overflow-x-auto scrollbar-small scrollbar-thumb pb-2 */}
      <div className="mt-4 hidden flex-wrap items-center gap-2 lg:flex">
        <div
          onClick={() => {
            state.view === "g"
              ? setState((prev) => ({ ...prev, filter: !prev.filter }))
              : setState((prev) => ({ ...prev, dialog: true, filter: false }));
          }}
          className={`flex h-10 cursor-pointer items-center gap-2 rounded-full  bg-onPrimary-light px-3 py-2 hover:bg-primary-dark ${
            state.filter && "bg-onPrimary-light"
          }`}
        >
          <SettingIcon className="" />
          <h6 className="text-base font-normal text-scrim-dark">Filter</h6>
        </div>

        <div className="h-[1.625rem] w-[0.0625rem] border border-onPrimary-light"></div>

        <div
          className={`
                    h-10 shrink-0 cursor-pointer self-center
                    rounded-full border px-3 py-2 transition-colors hover:border-primary-dark hover:text-primary-dark
                    ${
                      Object.keys(checkBox).every(
                        (key) =>
                          checkBox[key as keyof CheckBoxStateType].length === 0,
                      )
                        ? " border-primary-dark text-primary-dark"
                        : "border text-onPrimary-light "
                    }
                    `}
          onClick={handleClearFilter}
        >
          <p className="text-sm font-normal ">All</p>
        </div>

        {/* 
                                
                ░█▀▀█ ─█▀▀█ ░█▀▀▄ ░█▀▀█ ░█▀▀▀ 
                ░█▀▀▄ ░█▄▄█ ░█─░█ ░█─▄▄ ░█▀▀▀ 
                ░█▄▄█ ░█─░█ ░█▄▄▀ ░█▄▄█ ░█▄▄▄

                */}
        {newFilter["category"].map((item, i) => (
          <div
            data-tooltip-id={item.id}
            key={i}
            className={`
                    ctn-category group relative h-10 shrink-0
                    cursor-pointer self-center rounded-full border
                    px-3 py-2 text-onPrimary-light transition-colors hover:border hover:border-primary-dark hover:text-primary-dark lg:block
                    ${
                      checkBox["Category"].some(
                        (elem) =>
                          elem ===
                          newFilter.category.find((elem) => elem.id === item.id)
                            ?.id,
                      )
                        ? " border-primary-dark text-primary-dark"
                        : "border text-onPrimary-light"
                    }
                    `}
            onClick={() => {
              handleChangeCheckBox(
                "Category" as keyof CheckBoxStateType,
                item.id,
              );
            }}
          >
            <p className=" text-sm font-normal ">{item.name}</p>

            {/* Tool tip */}
            <ReactTooltip
              opacity={100}
              id={item.id}
              place="top"
              variant="error"
              style={{ zIndex: 99, backgroundColor: "#6c7283" }}
              className="bg-outline-dark text-sm font-light"
              content={item.description}
            />
          </div>
        ))}
      </div>

      {/* 
                ░█─── ─█▀▀█ ░█──░█ ░█▀▀▀█ ░█─░█ ▀▀█▀▀ 
                ░█─── ░█▄▄█ ░█▄▄▄█ ░█──░█ ░█─░█ ─░█── 
                ░█▄▄█ ░█─░█ ──░█── ░█▄▄▄█ ─▀▄▄▀ ─░█──
            */}
      <div className="animate-slideup relative mt-[2.5rem]">
        {state.view === "g" ? (
          <div className="animate-slideleft flex gap-6">
            {/*  
                            ░█▀▀█ ░█─░█ ░█▀▀▀ ░█▀▀█ ░█─▄▀ ░█▀▀█ ░█▀▀▀█ ▀▄░▄▀ 
                            ░█─── ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▄─ ░█▀▀▄ ░█──░█ ─░█── 
                            ░█▄▄█ ░█─░█ ░█▄▄▄ ░█▄▄█ ░█─░█ ░█▄▄█ ░█▄▄▄█ ▄▀░▀▄
                        */}

            {state.filter && (
              <CheckBoxFilter
                checkBox={checkBox}
                handleChangeCheckBox={handleChangeCheckBox}
                handleClearFilter={handleClearFilter}
              />
            )}

            <div
              className={`grid h-fit w-full grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3`}
            >
              {currentItems.length !== 0 ? (
                currentItems.map((item, i) => {
                  // console.log(item)
                  if (item["contributions"]["execution-status"] == "") {
                    item["contributions"]["execution-status"] = "Not Started";
                  }
                  return (
                    <div className="" key={i}>
                      <GridCard data={item} />
                    </div>
                  );
                })
              ) : (
                <h6 className="col-span-1 w-full text-center text-xl font-medium text-gray-500 lg:col-span-2 xl:col-span-3">
                  0 Ideas Found
                </h6>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-slideright">
            <div className="hidden md:block">
              <ListCard currentItems={currentItems} />
            </div>
            <div className="flex flex-col gap-4 md:hidden">
              {currentItems.map((item, i) => (
                <React.Fragment key={i}>
                  <GridCard data={item} />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* 
                    ░█▀▀█ ─█▀▀█ ░█▀▀█ ▀█▀ ░█▄─░█ ▀▀█▀▀ ▀█▀ ░█▀▀▀█ ░█▄─░█ 
                    ░█▄▄█ ░█▄▄█ ░█─▄▄ ░█─ ░█░█░█ ─░█── ░█─ ░█──░█ ░█░█░█ 
                    ░█─── ░█─░█ ░█▄▄█ ▄█▄ ░█──▀█ ─░█── ▄█▄ ░█▄▄▄█ ░█──▀█
                */}
        {currentItems.length !== 0 && (
          <div className="mt-12 text-sm font-medium text-gray-500">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={handlePageClick}
              className="flex flex-wrap justify-end gap-4"
              truncableText="..."
              truncableClassName="border  min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] text-sm font-medium text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-50"
              edgePageCount={2}
              middlePagesSiblingCount={1}
              totalPages={pageCount}
            >
              <Pagination.PrevButton className="flex max-h-[2rem] min-h-[2rem] cursor-pointer items-center justify-center border px-2 text-sm font-medium text-onPrimary-light hover:border-primary-dark hover:text-primary-dark">
                Previous
              </Pagination.PrevButton>

              <div className="flex justify-center">
                <div className="flex list-none flex-wrap justify-start gap-1 lg:items-center lg:justify-center">
                  <Pagination.PageButton
                    as={<div />}
                    activeClassName="bg-gray-100 cursor-pointer hover:bg-gray-50 list-none"
                    inactiveClassName="list-none"
                    className=" flex max-h-[2rem] min-h-[2rem] min-w-[2rem] max-w-[2rem] cursor-pointer list-none items-center justify-center border hover:bg-gray-50"
                    dataTestIdInactive="list-none"
                  />
                </div>
              </div>

              <Pagination.NextButton className="flex max-h-[2rem] min-h-[2rem] cursor-pointer items-center justify-center border px-2 text-sm font-medium text-onPrimary-light hover:border-primary-dark hover:text-primary-dark">
                Next
              </Pagination.NextButton>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
