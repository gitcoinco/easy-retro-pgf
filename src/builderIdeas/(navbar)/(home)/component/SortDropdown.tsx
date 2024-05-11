"use client";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { TabStateType } from "./Home";
import SortIcon from "../../../../../public/builderIdeas/icon/SortIcon";
import CorrectIcon from "../../../../../public/builderIdeas/icon/CorrectIcon";

export default function SortDropdown({
  state,
  setState,
}: {
  state: TabStateType;
  setState: React.Dispatch<React.SetStateAction<TabStateType>>;
}) {
  function handleChangeSort(char: "a" | "le" | "he" | "n") {
    setState((prev) => ({ ...prev, sort: char }));
  }

  return (
    <div className="w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="">
            <div
              className={`
            flex h-10 shrink-0 cursor-pointer
            gap-2 self-center rounded-full border px-3 py-2 
            text-onPrimary-light transition-colors hover:border hover:border-primary-dark hover:text-primary-dark
            `}
            >
              <SortIcon />
              <p className=" self-center text-sm font-normal">Name</p>
            </div>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md  bg-white p-4 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <h6 className="text-center text-sm font-bold text-gray-900">
              Sort By
            </h6>

            <div className="mt-4">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      state.sort === "a"
                        ? "bg-primary-dark hover:bg-outline-dark"
                        : "text-gray-900"
                    } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-gray-50`}
                    onClick={() => handleChangeSort("a")}
                  >
                    <h6>Alphabet (A-Z)</h6>
                    {state.sort === "a" && <CorrectIcon />}
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      state.sort === "le"
                        ? "bg-primary-dark hover:bg-outline-dark"
                        : "text-gray-900"
                    } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-normal hover:bg-gray-50`}
                    onClick={() => handleChangeSort("le")}
                  >
                    <h6>Low to High Effort</h6>
                    {state.sort === "le" && <CorrectIcon />}
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      state.sort === "he"
                        ? "bg-primary-dark hover:bg-outline-dark"
                        : "text-gray-900"
                    } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-normal hover:bg-gray-50`}
                    onClick={() => handleChangeSort("he")}
                  >
                    <h6>High to Low Effort</h6>
                    {state.sort === "he" && <CorrectIcon />}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
