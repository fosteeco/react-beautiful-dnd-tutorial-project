import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import initialData from "./initial-data-";
import Column from "./Column.jsx";
import { DragDropContext } from "react-beautiful-dnd";
import "reset-css";

const App = () => {
  const [appState, setAppState] = useState(initialData);

  const onDragEnd = (result) => {
    // TODO: reorder our column
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = appState.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    setAppState({
      ...appState,
      columns: {
        ...appState.columns,
        [newColumn.id]: newColumn,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {appState.columnOrder.map((columnId) => {
        const column = appState.columns[columnId];
        const tasks = column.taskIds.map((taskId) => appState.tasks[taskId]);
        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
