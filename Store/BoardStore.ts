import { create } from "zustand";
import { getTodoGroupedByColumn } from "@/Lib/getTodoGroupedByColumn";
import { database, storage ,ID } from "@/appwrite";
import uploadImage from "@/Lib/uploadImage";
import { title } from "process";
import { stat } from "fs";
interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateToDoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  newTaskInput:string;
  image: File | null;
  newTaskType:TypedColumn;
  setNewTaskInput:(input:string)=>void;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  setNewTaskType:(columnId:TypedColumn)=>void;
  setImage:(image: File | null)=> void;
  addTask:(todo : string , columnId: TypedColumn, image?: File | null)=> void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodoGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => {
    set({ board });
  },
  image:null,
  setImage:(image:File | null)=>{set({image})},
  updateToDoInDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASEID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  searchString: "",
  newTaskInput:'',
  newTaskType:"todo",
  setSearchString: (searchString) => {
    set({ searchString });
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASEID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id
    );
  },
  setNewTaskInput:(input:string)=>{
    set({newTaskInput:input})
  },
  setNewTaskType:(columnId:TypedColumn)=>{
   set({newTaskType:columnId})
  },
  addTask: async (todo : string , columnId: TypedColumn, image?: File | null)=>{
    let file: Image | undefined;
    if(image){
      const fileUploaded= await uploadImage(image);
      if(fileUploaded){
        file={
          bucketId: fileUploaded.bucketId,
          fileId:fileUploaded.$id
        }; 
      }
    }
    const {$id}=await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASEID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      ID.unique(),
      {
        title:todo , 
        status:columnId,
        ...(file && {image : JSON.stringify(file)})
      }
    );
    set({newTaskInput:""});
    set((state)=>{
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo={
        $id,
        $createdAt:new Date().toISOString(),
        title:todo,
        status:columnId,
        ...(file && {image:file})
      }
      // get what column the user want to add a task to 
      const column=newColumns.get(columnId);
      if(!column){
        newColumns.set(columnId,{
          id:columnId,
          todos:[newTodo],
        });
      }else{
        newColumns.get(columnId)?.todos.push(newTodo)
      }
      return{
        board:{
          columns:newColumns
        }
      }
    })
   
  }
}));
