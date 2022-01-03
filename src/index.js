import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import initialData from "./initial-data-";
import Column from "./Column.jsx";
import { DragDropContext } from "react-beautiful-dnd";
import "reset-css";

const App = () => {
  const [appState, setAppState] = useState(initialData);

  const onDragStart = () => {
    document.body.style.color = "orange";
    document.body.style.transition = "background-color 0.2s ease";
  };

  const onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(appState.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153,141,217, ${opacity})`;
  };

  const onDragEnd = (result) => {
    document.body.style.color = "inherit";
    document.body.style.backgroundColor = "inherit";
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
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      {appState.columnOrder.map((columnId) => {
        const column = appState.columns[columnId];
        const tasks = column.taskIds.map((taskId) => appState.tasks[taskId]);
        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
