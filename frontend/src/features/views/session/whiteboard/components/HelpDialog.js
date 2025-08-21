import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
} from "@mui/material"
import {
  Create as PenIcon,
  TextFields as TextIcon,
  CropSquare as RectangleIcon,
  RadioButtonUnchecked as CircleIcon,
  ArrowForward as ArrowIcon,
  TableChart as TableIcon,
  PanTool as PanIcon,
  SelectAll as SelectIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Help as HelpIcon,
  Keyboard as KeyboardIcon,
  Mouse as MouseIcon,
} from "@mui/icons-material"
import { useTranslation } from "react-i18next"

const HelpDialog = ({ open, onClose }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const tools = [
    {
      icon: PenIcon,
      name: "Pen",
      description: "Dessiner librement sur le tableau blanc",
      shortcut: "Cliquez et glissez pour dessiner",
    },
    {
      icon: TextIcon,
      name: "Text",
      description: "Ajouter du texte au tableau blanc",
      shortcut: "Cliquez où vous voulez placer le texte",
    },
    {
      icon: RectangleIcon,
      name: "Rectangle",
      description: "Dessiner des rectangles",
      shortcut: "Cliquez et glissez pour créer un rectangle",
    },
    {
      icon: CircleIcon,
      name: "Circle",
      description: "Dessiner des cercles",
      shortcut: "Cliquez et glissez pour créer un cercle",
    },
    {
      icon: ArrowIcon,
      name: "Arrow",
      description: "Dessiner des flèches",
      shortcut: "Cliquez et glissez pour créer une flèche",
    },
    {
      icon: TableIcon,
      name: "Table",
      description: "Créer des tableaux",
      shortcut: "Cliquez et glissez, puis configurez les cellules",
    },
    {
      icon: PanIcon,
      name: "Pan",
      description: "Déplacer la vue du tableau blanc",
      shortcut: "Cliquez et glissez pour naviguer",
    },
    {
      icon: SelectIcon,
      name: "Select",
      description: "Sélectionner et modifier des éléments",
      shortcut: "Cliquez sur un élément pour le sélectionner",
    },
  ]

  const actions = [
    {
      icon: UndoIcon,
      name: "Undo",
      description: "Annuler la dernière action",
      shortcut: "Ctrl+Z",
    },
    {
      icon: RedoIcon,
      name: "Redo",
      description: "Rétablir une action annulée",
      shortcut: "Ctrl+Y",
    },
    {
      icon: DeleteIcon,
      name: "Delete",
      description: "Supprimer les éléments sélectionnés",
      shortcut: "Delete",
    },
    {
      icon: ClearIcon,
      name: "Clear All",
      description: "Effacer tout le tableau blanc",
      shortcut: "Bouton dans la toolbar",
    },
  ]

  const shortcuts = [
    { key: "Ctrl+Z", action: "Annuler" },
    { key: "Ctrl+Y", action: "Rétablir" },
    { key: "Delete", action: "Supprimer la sélection" },
    { key: "Ctrl+A", action: "Sélectionner tout" },
    { key: "Molette souris", action: "Zoom avant/arrière" },
    { key: "Clic droit + glisser", action: "Déplacer la vue" },
    { key: "Double-clic", action: "Éditer le texte" },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <HelpIcon />
        <Typography variant="h6" component="div">
          Guide d'utilisation du Tableau Blanc
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Outils de dessin */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PenIcon />
              Outils de dessin
            </Typography>
            <List dense>
              {tools.map((tool, index) => (
                <React.Fragment key={tool.name}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <tool.icon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {tool.name}
                          </Typography>
                          <Chip
                            label={tool.shortcut}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={tool.description}
                    />
                  </ListItem>
                  {index < tools.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Actions */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <KeyboardIcon />
              Actions principales
            </Typography>
            <List dense>
              {actions.map((action, index) => (
                <React.Fragment key={action.name}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <action.icon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {action.name}
                          </Typography>
                          <Chip
                            label={action.shortcut}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </Box>
                      }
                      secondary={action.description}
                    />
                  </ListItem>
                  {index < actions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Raccourcis clavier */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MouseIcon />
              Raccourcis clavier et souris
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1 }}>
              {shortcuts.map((shortcut) => (
                <Box
                  key={shortcut.key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography variant="body2">{shortcut.action}</Typography>
                  <Chip
                    label={shortcut.key}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Conseils d'utilisation */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Conseils d'utilisation
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Utilisez l'outil Pan pour naviguer dans de grands tableaux blancs
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Double-cliquez sur un texte pour le modifier
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Sélectionnez plusieurs éléments en maintenant Ctrl enfoncé
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Utilisez la molette de la souris pour zoomer et dézoomer
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Les tableaux peuvent être configurés avec différentes tailles de cellules
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Compris !
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default HelpDialog
