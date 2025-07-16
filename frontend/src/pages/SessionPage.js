import React, { useState } from "react";
import { Container, Button, Stack } from "@mui/material";

import AddSessionView from "./users/views/AddSessionView";
import SessionList from "./users/views/SessionList";


const SessionPage = () => {
  const [showList, setShowList] = useState(false);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
        <Button
          variant={!showList ? "contained" : "outlined"}
          onClick={() => setShowList(false)}
        >
          ➕ Ajouter une session
        </Button>
        <Button
          variant={showList ? "contained" : "outlined"}
          onClick={() => setShowList(true)}
        >
          📋 Liste des sessions
        </Button>
      </Stack>

      {showList ? <SessionList /> : <AddSessionView />}
    </Container>
  );
};

export default SessionPage;
