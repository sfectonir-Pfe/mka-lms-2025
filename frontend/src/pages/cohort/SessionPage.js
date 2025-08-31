import React, { useState } from "react";
import { Container, Button, Stack } from "@mui/material";
import { useTranslation } from 'react-i18next';

import AddSessionView from "../../features/views/cohort/AddSessionView";
import SessionList from "../../features/views/cohort/SessionList";
import RoleGate from "../auth/RoleGate";

const SessionPage = () => {
  const { t } = useTranslation();
  const [showList, setShowList] = useState(false);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
        <RoleGate roles={['CreateurDeFormation','Admin']}>
        <Button
          variant={!showList ? "contained" : "outlined"}
          onClick={() => setShowList(false)}
        >
          ➕ {t('session.addSession')}
        </Button>
        </RoleGate>
        <Button
          variant={showList ? "contained" : "outlined"}
          onClick={() => setShowList(true)}
        >
          📋 {t('session.sessionList')}
        </Button>
      </Stack>

      {showList ? <SessionList /> : <AddSessionView />}
    </Container>
  );
};

export default SessionPage;
