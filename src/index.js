import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import initialData from "./initial-data-";
import Column from "./Column.jsx";
import { DragDropContext } from "react-beautiful-dnd";
import "reset-css";

const Container = styled.div`
  display: flex;
`;

const App = () => {
  const [appState, setAppState] = useState(initialData);

  const onDragEnd = (result) => {
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

    const start = appState.columns[source.droppableId];
    const finish = appState.columns[destination.droppableId];
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...appState,
        columns: {
          ...appState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setAppState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    const newState = {
      ...appState,
      columns: {
        ...appState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setAppState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {appState.columnOrder.map((columnId) => {
          const column = appState.columns[columnId];
          const tasks = column.taskIds.map((taskId) => appState.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Container>
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
