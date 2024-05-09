"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import CloseIcon from "../../../../../../public/builderIdeas/icon/CloseIcon";
import Checkbox from "~/builderIdeas/component/Checkbox/Checkbox";
import type { CheckBoxStateType } from "../Home";
import {
  CheckBoxCategory,
  CheckBoxEffort,
  CheckBoxExecutionStatus,
  CheckBoxSkillsets,
} from "../Filter/CheckBox";
import { newFilter } from "../../Text";

interface DialogFilterProps {
  open: boolean;
  onClose: () => void;
  checkBox: CheckBoxStateType;
  handleChangeCheckBox: (name: keyof CheckBoxStateType, value: string) => void;
  handleClearFilter: () => void;
}
export default function DialogFilter({
  open,
  onClose,
  checkBox,
  handleChangeCheckBox,
  handleClearFilter,
}: DialogFilterProps) {
  return (
    <div>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 hidden lg:block"
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-h-[70vh] w-full max-w-5xl transform overflow-hidden overflow-y-auto  rounded-2xl bg-background-dark p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex justify-between ">
                    <div />
                    <h6 className="text-base font-bold text-onPrimary-light">
                      Filter
                    </h6>
                    <div className="cursor-pointer" onClick={onClose}>
                      <CloseIcon />
                    </div>
                  </Dialog.Title>

                  <hr className="m-0 my-3 w-full  border-gray-200" />

                  <div className="flex">
                    <div className=" flex flex-wrap gap-8">
                      <div className="flex flex-col gap-1  ">
                        <h6 className="self-center text-xs font-medium text-primary-dark">
                          Execution Status
                        </h6>
                        <CheckBoxExecutionStatus
                          checkBox={checkBox}
                          handleChangeCheckBox={handleChangeCheckBox}
                        />
                      </div>

                      <div className={`flex flex-col gap-1 `}>
                        <h6 className="mb-2 text-xs font-medium text-primary-dark">
                          Effort
                        </h6>
                        <CheckBoxEffort
                          checkBox={checkBox}
                          handleChangeCheckBox={handleChangeCheckBox}
                        />
                      </div>

                      <div className="flex flex-col gap-1  ">
                        <h6 className="mb-2 text-xs font-medium text-primary-dark">
                          Skill Set
                        </h6>
                        <CheckBoxSkillsets
                          checkBox={checkBox}
                          handleChangeCheckBox={handleChangeCheckBox}
                        />
                      </div>

                      <div className="flex flex-col gap-1  ">
                        <h6 className="mb-2 text-xs font-medium text-primary-dark">
                          Category
                        </h6>
                        <CheckBoxCategory
                          checkBox={checkBox}
                          handleChangeCheckBox={handleChangeCheckBox}
                        />
                      </div>

                      <div className="flex flex-col gap-1  ">
                        <h6 className="mb-2 text-xs font-medium text-primary-dark">
                          Label
                        </h6>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-1">
                            {newFilter["labels"]
                              .slice(
                                0,
                                Math.ceil(newFilter["labels"].length / 2),
                              )
                              .map((item, i) => (
                                <Checkbox
                                  key={i}
                                  label={item}
                                  value={item}
                                  checked={checkBox["Label"].includes(item)}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) =>
                                    handleChangeCheckBox(
                                      "Label" as keyof CheckBoxStateType,
                                      e.target.value,
                                    )
                                  }
                                />
                              ))}
                          </div>
                          <div className="flex flex-col gap-1">
                            {newFilter["labels"]
                              .slice(Math.ceil(newFilter["labels"].length / 2))
                              .map((item, i) => (
                                <Checkbox
                                  key={i}
                                  label={item}
                                  value={item}
                                  checked={checkBox["Label"].includes(item)}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) =>
                                    handleChangeCheckBox(
                                      "Label" as keyof CheckBoxStateType,
                                      e.target.value,
                                    )
                                  }
                                />
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* {newFilter["type"].length > 1 &&
                        <div className="flex flex-wrap flex-col gap-1 ">
                          <h6 className="text-xs font-medium text-gray-400 mb-2">Type</h6>
                          <CheckBoxType
                            checkBox={checkBox}
                            handleChangeCheckBox={handleChangeCheckBox}
                          />
                        </div>
                      } */}
                    </div>
                  </div>

                  <h6
                    onClick={handleClearFilter}
                    className="hover:text-primaryRed mt-3 cursor-pointer text-end text-sm font-bold text-gray-900 underline"
                  >
                    Clear Filters
                  </h6>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
