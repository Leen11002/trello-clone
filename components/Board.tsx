"use client";
import { useBoardStore } from "@/Store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  const board = useBoardStore((state) => state.board);
  const getBoard = useBoardStore((state) => state.getBoard);
  const setBoardState = useBoardStore((state) => state.setBoardState);
  const updateToDoInDB = useBoardStore((state) => state.updateToDoInDB);

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) {
      return;
    }
    if (type == "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };
    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) {
      return;
    }
    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);
    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });
      updateToDoInDB(todoMoved, finishCol.id);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable
        droppableId="board"
        direction="horizontal"
        type="column"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
