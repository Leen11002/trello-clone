"use client";
import getUrl from "@/Lib/getUrl";
import { useBoardStore } from "@/Store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};
function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl , setImageUrl]= useState<string | null>( null);
  useEffect(()=>{

    if(todo.image){
      const fetchImage = async ()=>{
      const url = await getUrl(todo.image!)
      if(url){
        setImageUrl(url.toString());
      }
      }
      fetchImage()
    }
  }, [todo])
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="p-5 flex justify-between items-center">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8 " />
        </button>
      </div>
     {
      imageUrl && (
        <div className=" h-full w-full rounded-b-md">
          <Image
          src={imageUrl}
          alt="Task Image"
          width={400}
          height={200}
          priority 
          className="w-full object-contain rounded-b-md"
          />

          </div>
      )
     }

    </div>
  );
}

export default TodoCard;
