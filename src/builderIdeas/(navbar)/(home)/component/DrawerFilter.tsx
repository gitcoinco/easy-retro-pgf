"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import CloseIcon from "../../../../../public/builderIdeas/icon/CloseIcon";
import { newFilter } from "../Text";
import { CheckBoxStateType } from "./Home";
export default function DrawerFilter({
  open,
  onClose,
  checkBox,
  handleChangeCheckBox,
  handleClearFilter,
}: {
  open: boolean;
  onClose: () => void;
  checkBox: CheckBoxStateType;
  handleChangeCheckBox: (name: keyof CheckBoxStateType, value: string) => void;
  handleClearFilter: () => void;
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 block h-full w-full lg:hidden"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/25" />

        <div className="fixed inset-0 h-full w-screen overflow-y-auto">
          <div className="flex h-full items-center justify-center text-center ">
            <Transition.Child
              as={Fragment}
              enter="duration-500"
              enterFrom="-translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="ease-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-full transform flex-col overflow-x-hidden overflow-y-scroll bg-background-dark p-4 text-left shadow-xl transition-all">
                <Dialog.Title as="div" className="flex justify-between ">
                  <div />
                  <h6 className="text-base font-bold text-onPrimary-light">
                    Filter By
                  </h6>
                  <div className="cursor-pointer" onClick={onClose}>
                    <CloseIcon />
                  </div>
                </Dialog.Title>

                <hr className="m-0 my-3 w-full  border-gray-200" />
                <div className="flex flex-col gap-4">
                  {/* <div className="flex flex-col gap-2">
                      <h6 className="text-xs font-medium text-gray-400">Type</h6>
                      <div className="flex gap-2 items-center flex-wrap">
                        {newFilter["type"].map((item, i) => (
                          <div
                            key={i}
                            className={` 
                          lg:block h-8
                          hover:bg-secondaryRed hover:text-primaryRed hover:border hover:border-primaryRed
                          border rounded-full px-3 py-1.5 cursor-pointer transition-colors self-center shrink-0
                          ${checkBox["Type"].includes(item) ? "bg-secondaryRed text-primaryRed border-secondaryRed" : "text-slate-900 border"}
                          `}
                            onClick={() => {
                              handleChangeCheckBox("Type" as keyof CheckBoxStateType, item)
                            }}
                          >
                            <p className=" text-sm font-normal ">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div> */}

                  <div className="flex flex-col gap-2">
                    <h6 className="text-xs font-medium text-primary-dark">
                      Execution Status
                    </h6>
                    <div className="flex flex-wrap items-center gap-2">
                      {newFilter["execution-status"].map((item, i) => (
                        <div
                          key={i}
                          className={` 
                          hover:bg-secondaryRed hover:text-primaryRed
                          hover:border-primaryRed h-8 shrink-0 cursor-pointer
                          self-center rounded-full border px-3 py-1.5 transition-colors hover:border lg:block
                          ${
                            checkBox["ExecutionStatus"].includes(item.id)
                              ? " border-primary-dark text-primary-dark"
                              : "border text-onPrimary-light"
                          }
                          `}
                          onClick={() => {
                            handleChangeCheckBox(
                              "ExecutionStatus" as keyof CheckBoxStateType,
                              item.id,
                            );
                          }}
                        >
                          <p className=" text-sm font-normal ">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h6 className="mb-1 text-xs font-medium text-primary-dark">
                      Effort
                    </h6>
                    <div className="flex flex-wrap items-center gap-2">
                      {newFilter["effort"].map((item, i) => (
                        <div
                          key={i}
                          className={` 
                        hover:bg-secondaryRed hover:text-primaryRed
                        hover:border-primaryRed h-8 shrink-0 cursor-pointer
                        self-center rounded-full border px-3 py-1.5 transition-colors hover:border lg:block
                        ${
                          checkBox["Effort"].includes(item)
                            ? " border-primary-dark text-primary-dark"
                            : "border text-onPrimary-light"
                        }
                        `}
                          onClick={() => {
                            handleChangeCheckBox(
                              "Effort" as keyof CheckBoxStateType,
                              item,
                            );
                          }}
                        >
                          <p className=" text-sm font-normal ">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h6 className="mb-1 text-xs font-medium text-primary-dark">
                      Category
                    </h6>
                    <div className="flex flex-wrap items-center gap-2">
                      {newFilter["category"].map((item, i) => (
                        <div
                          key={i}
                          className={` 
                      hover:bg-secondaryRed hover:text-primaryRed
                      hover:border-primaryRed h-8 shrink-0 cursor-pointer
                      self-center rounded-full border px-3 py-1.5 transition-colors hover:border lg:block
                      ${
                        checkBox["Category"].includes(item.id)
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
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h6 className="mb-1 text-xs font-medium text-primary-dark">
                      Skill Sets
                    </h6>
                    <div className="flex flex-wrap items-center gap-2">
                      {newFilter["skillsets"].options.map((item, i) => (
                        <div
                          key={i}
                          className={` 
                            hover:bg-secondaryRed hover:text-primaryRed
                            hover:border-primaryRed h-8 shrink-0 cursor-pointer
                            self-center rounded-full border px-3 py-1.5 transition-colors hover:border lg:block
                            ${
                              checkBox["SkillSets"].includes(item)
                                ? " border-primary-dark text-primary-dark"
                                : "border text-onPrimary-light"
                            }
                            `}
                          onClick={() => {
                            handleChangeCheckBox(
                              "SkillSets" as keyof CheckBoxStateType,
                              item,
                            );
                          }}
                        >
                          <p className=" text-sm font-normal ">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h6 className="mb-2 text-xs font-medium text-primary-dark">
                      Label
                    </h6>
                    <div className="flex flex-wrap items-center gap-2">
                      {newFilter["labels"].map((item, i) => (
                        <div
                          key={i}
                          className={` 
                      hover:bg-secondaryRed hover:text-primaryRed
                      hover:border-primaryRed h-8 shrink-0 cursor-pointer
                      self-center rounded-full border px-3 py-1.5 transition-colors hover:border lg:block
                      ${
                        checkBox["Label"].includes(item)
                          ? " border-primary-dark text-primary-dark"
                          : "border text-onPrimary-light"
                      }
                      `}
                          onClick={() => {
                            handleChangeCheckBox(
                              "Label" as keyof CheckBoxStateType,
                              item,
                            );
                          }}
                        >
                          <p className=" text-sm font-normal ">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8" />

                <div className="mt-auto grid w-full grid-cols-1 content-center items-center  gap-4 min-[305px]:grid-cols-2 ">
                  <div
                    onClick={handleClearFilter}
                    className=" flex cursor-pointer items-center justify-center bg-inherit bg-onPrimary-light px-7 py-3 text-scrim-dark hover:bg-primary-dark"
                  >
                    <h6 className="text-center text-base font-semibold ">
                      Clear All
                    </h6>
                  </div>

                  <div
                    className="flex cursor-pointer items-center justify-center border px-7 py-3 text-white hover:border-primary-dark hover:text-primary-dark"
                    onClick={onClose}
                  >
                    <h6 className="text-base font-semibold ">Apply</h6>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
