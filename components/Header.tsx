"use client";
import Image from "next/image";
import Avatar from "react-avatar";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/Store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "@/Lib/fetchSuggestion";
function Header() {
  const searchString = useBoardStore((state) => state.searchString);
  const setSearchString = useBoardStore((state) => state.setSearchString);
  const board = useBoardStore((state) => state.board);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  // useEffect(() => {
  //   if (board.columns.size === 0) return;
  //   setIsLoading(true);
  //   const fetchSuggestionFun = async () => {
  //     const suggestion = await fetchSuggestion(board);
  //     setSuggestion(suggestion);
  //     setIsLoading(false);
  //   };
  //   fetchSuggestionFun();
  // }, [board]);
  return (
    <header className="mb-3"> 
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="
       absolute
       top-0
       left-0
       w-full
       h-96
       bg-gradient-to-br
       from-purple-400
       to-gray-400
       rounded-md
       filter
       blur-3xl
       opacity-50
       -z-50
      "
        />
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello logo"
          width={300}
          height={100}
          priority 
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain "
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial ">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 outline-none p-2"
            />
            <button hidden>Search</button>
          </form>
          <Avatar name="Leen AboAlHijaa" round size="50" color="#0055D1" />
        </div>
      </div>
      {/* <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1] ">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1
            ${isLoading && "animate-spin"}
            `}
          />
          {suggestion && !isLoading
            ? suggestion
            : " GPT is summarising your tasks for the day..."}
        </p>
      </div> */}
    </header>
  );
}

export default Header;
