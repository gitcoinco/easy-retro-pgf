"use client";
import { Disclosure, Transition } from "@headlessui/react";
import Checkbox from "~/builderIdeas/component/Checkbox/Checkbox";
import { CheckBoxStateType } from "./Home";
import { newFilter } from "../Text";
import {
  CheckBoxEffort,
  CheckBoxExecutionStatus,
  CheckBoxSkillsets,
  CheckBoxType,
} from "./Filter/CheckBox";

interface CheckBoxFilterProps {
  checkBox: CheckBoxStateType;
  handleChangeCheckBox: (name: keyof CheckBoxStateType, value: string) => void;
  handleClearFilter: () => void;
}
export default function CheckBoxFilter({
  checkBox,
  handleChangeCheckBox,
  handleClearFilter,
}: CheckBoxFilterProps) {
  return (
    <div className="animate-slideleft z-10 col-span-1 hidden h-fit min-w-60  max-w-60 flex-col gap-4 border  p-4 pb-4 lg:flex">
      <div className="flex items-center justify-between gap-1 ">
        <h6 className="text-sm font-bold text-onPrimary-light ">Filter</h6>
        <button onClick={handleClearFilter} className="">
          <h6 className="text-xs font-normal text-onPrimary-light hover:text-primary-dark decoration-transparent">
            Clear Filters
          </h6>
        </button>
      </div>
      <hr className="h-[0.0625rem] bg-gray-200" />

      {/* 
            ░█▀▀▀ ▀▄░▄▀ ░█▀▀▀ ░█▀▀█ ░█─░█ ▀▀█▀▀ ▀█▀ ░█▀▀▀█ ░█▄─░█ ░█▀▀▀█ ▀▀█▀▀ ─█▀▀█ ▀▀█▀▀ ░█─░█ ░█▀▀▀█ 
            ░█▀▀▀ ─░█── ░█▀▀▀ ░█─── ░█─░█ ─░█── ░█─ ░█──░█ ░█░█░█ ─▀▀▀▄▄ ─░█── ░█▄▄█ ─░█── ░█─░█ ─▀▀▀▄▄ 
            ░█▄▄▄ ▄▀░▀▄ ░█▄▄▄ ░█▄▄█ ─▀▄▄▀ ─░█── ▄█▄ ░█▄▄▄█ ░█──▀█ ░█▄▄▄█ ─░█── ░█─░█ ─░█── ─▀▄▄▀ ░█▄▄▄█
        */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg text-left text-sm font-medium focus:outline-none ">
              <h6 className="self-center text-xs font-medium text-primary-dark">
                Execution Status
              </h6>
              <svg
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-purple-500`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="#698dff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Disclosure.Button>
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-200 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="text-sm text-gray-500">
                <CheckBoxExecutionStatus
                  checkBox={checkBox}
                  handleChangeCheckBox={handleChangeCheckBox}
                />
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <hr className="h-[0.0625rem] bg-gray-200" />

      {/* 
            ░█▀▀▀ ░█▀▀▀ ░█▀▀▀ ░█▀▀▀█ ░█▀▀█ ▀▀█▀▀ 
            ░█▀▀▀ ░█▀▀▀ ░█▀▀▀ ░█──░█ ░█▄▄▀ ─░█── 
            ░█▄▄▄ ░█─── ░█─── ░█▄▄▄█ ░█─░█ ─░█──
         */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg text-left text-sm font-medium focus:outline-none ">
              <h6 className="self-center text-xs font-medium text-primary-dark">
                Effort
              </h6>
              <svg
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-purple-500`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="#698dff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Disclosure.Button>
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-200 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="text-sm text-gray-500">
                <CheckBoxEffort
                  checkBox={checkBox}
                  handleChangeCheckBox={handleChangeCheckBox}
                />
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <hr className="h-[0.0625rem] bg-gray-200" />

      {/* 
              ░█▀▀▀█ ░█─▄▀ ▀█▀ ░█─── ░█─── 　 ░█▀▀▀█ ░█▀▀▀ ▀▀█▀▀ 
              ─▀▀▀▄▄ ░█▀▄─ ░█─ ░█─── ░█─── 　 ─▀▀▀▄▄ ░█▀▀▀ ─░█── 
              ░█▄▄▄█ ░█─░█ ▄█▄ ░█▄▄█ ░█▄▄█ 　 ░█▄▄▄█ ░█▄▄▄ ─░█──
          */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg text-left text-sm font-medium focus:outline-none ">
              <h6 className="self-center text-xs font-medium text-primary-dark">
                Skill Set
              </h6>
              <svg
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-purple-500`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="#698dff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Disclosure.Button>
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-200 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="text-sm text-gray-500">
                <CheckBoxSkillsets
                  checkBox={checkBox}
                  handleChangeCheckBox={handleChangeCheckBox}
                />
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <hr className="h-[0.0625rem] bg-gray-200" />

      {/*
            ░█─── ─█▀▀█ ░█▀▀█ ░█▀▀▀ ░█─── 
            ░█─── ░█▄▄█ ░█▀▀▄ ░█▀▀▀ ░█─── 
            ░█▄▄█ ░█─░█ ░█▄▄█ ░█▄▄▄ ░█▄▄█
        */}

      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg text-left text-sm font-medium focus:outline-none ">
              <h6 className="self-center text-xs font-medium text-primary-dark">
                Label
              </h6>
              <svg
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-primary-dark`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="#698dff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Disclosure.Button>
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-200 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="text-sm text-gray-500">
                {newFilter["labels"].map((item, i) => (
                  <Checkbox
                    key={i}
                    label={item}
                    value={item}
                    checked={checkBox["Label"].includes(item)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeCheckBox(
                        "Label" as keyof CheckBoxStateType,
                        e.target.value,
                      )
                    }
                  />
                ))}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      {/* <hr className='h-[0.0625rem] bg-gray-200'/> */}

      {/* <div className="flex flex-col gap-1 ">
            <h6 className="text-xs font-medium text-gray-400 mb-2">Category</h6>
            <CheckBoxCategory
                checkBox={checkBox}
                handleChangeCheckBox={handleChangeCheckBox}
            />
        </div> */}

      {/* {newFilter["type"].length > 1 && <hr className='h-[0.0625rem] bg-gray-200'/>}

        {newFilter["type"].length > 1 && 
            <Disclosure 
            defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center w-full justify-between rounded-lg text-left text-sm font-medium focus:outline-none ">
              <h6 className="text-xs font-medium text-gray-400 self-center">Type</h6>
                <svg
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-purple-500`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
              </Disclosure.Button>
              <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-200 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Disclosure.Panel className="text-sm text-gray-500">
                    <CheckBoxType
                        checkBox={checkBox}
                        handleChangeCheckBox={handleChangeCheckBox}
                    />
                    </Disclosure.Panel>
                </Transition>
            </>
          )}
        </Disclosure>
        } */}
    </div>
  );
}
