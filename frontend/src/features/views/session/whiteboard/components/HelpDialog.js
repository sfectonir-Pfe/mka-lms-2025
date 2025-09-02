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
      name: t('whiteboard.tools.pen', 'Pen'),
      description: t('whiteboard.helpDialog.descriptions.drawFree', 'Dessiner librement sur le tableau blanc'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.drawFree', 'Cliquez et glissez pour dessiner'),
    },
    {
      icon: TextIcon,
      name: t('whiteboard.tools.text', 'Text'),
      description: t('whiteboard.helpDialog.descriptions.addText', 'Ajouter du texte au tableau blanc'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.addText', 'Cliquez où vous voulez placer le texte'),
    },
    {
      icon: RectangleIcon,
      name: t('whiteboard.tools.rectangle', 'Rectangle'),
      description: t('whiteboard.helpDialog.descriptions.drawRectangles', 'Dessiner des rectangles'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.drawRectangle', 'Cliquez et glissez pour créer un rectangle'),
    },
    {
      icon: CircleIcon,
      name: t('whiteboard.tools.circle', 'Circle'),
      description: t('whiteboard.helpDialog.descriptions.drawCircles', 'Dessiner des cercles'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.drawCircle', 'Cliquez et glissez pour créer un cercle'),
    },
    {
      icon: ArrowIcon,
      name: t('whiteboard.tools.arrow', 'Arrow'),
      description: t('whiteboard.helpDialog.descriptions.drawArrows', 'Dessiner des flèches'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.drawArrow', 'Cliquez et glissez pour créer une flèche'),
    },
    {
      icon: TableIcon,
      name: t('whiteboard.tools.table', 'Table'),
      description: t('whiteboard.helpDialog.descriptions.createTables', 'Créer des tableaux'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.createTable', 'Cliquez et glissez, puis configurez les cellules'),
    },
    {
      icon: PanIcon,
      name: t('whiteboard.tools.pan', 'Pan'),
      description: t('whiteboard.helpDialog.descriptions.panView', 'Déplacer la vue du tableau blanc'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.panView', 'Cliquez et glissez pour naviguer'),
    },
    {
      icon: SelectIcon,
      name: t('whiteboard.tools.select', 'Select'),
      description: t('whiteboard.helpDialog.descriptions.selectEdit', 'Sélectionner et modifier des éléments'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.selectItem', "Cliquez sur un élément pour le sélectionner"),
    },
  ]

  const actions = [
    {
      icon: UndoIcon,
      name: t('whiteboard.tools.undo', 'Undo'),
      description: t('whiteboard.helpDialog.descriptions.undo', 'Annuler la dernière action'),
      shortcut: 'Ctrl+Z',
    },
    {
      icon: RedoIcon,
      name: t('whiteboard.tools.redo', 'Redo'),
      description: t('whiteboard.helpDialog.descriptions.redo', 'Rétablir une action annulée'),
      shortcut: 'Ctrl+Y',
    },
    {
      icon: DeleteIcon,
      name: t('whiteboard.actions.deleteSelected', 'Delete Selected'),
      description: t('whiteboard.helpDialog.descriptions.deleteSelected', 'Supprimer les éléments sélectionnés'),
      shortcut: 'Delete',
    },
    {
      icon: ClearIcon,
      name: t('whiteboard.actions.clearAll', 'Clear All'),
      description: t('whiteboard.helpDialog.descriptions.clearAll', 'Effacer tout le tableau blanc'),
      shortcut: t('whiteboard.helpDialog.shortcutHints.clearAllButton', 'Bouton dans la toolbar'),
    },
  ]

  const shortcuts = [
    { key: 'Ctrl+Z', action: t('whiteboard.helpDialog.shortcutLabels.undo', 'Annuler') },
    { key: 'Ctrl+Y', action: t('whiteboard.helpDialog.shortcutLabels.redo', 'Rétablir') },
    { key: 'Delete', action: t('whiteboard.helpDialog.shortcutLabels.deleteSelection', 'Supprimer la sélection') },
    { key: 'Ctrl+A', action: t('whiteboard.helpDialog.shortcutLabels.selectAll', 'Sélectionner tout') },
    { key: t('whiteboard.helpDialog.shortcutLabels.mouseWheel', 'Molette souris'), action: t('whiteboard.helpDialog.shortcutLabels.zoom', 'Zoom avant/arrière') },
    { key: t('whiteboard.helpDialog.shortcutLabels.rightClickDrag', 'Clic droit + glisser'), action: t('whiteboard.helpDialog.shortcutLabels.pan', 'Déplacer la vue') },
    { key: t('whiteboard.helpDialog.shortcutLabels.doubleClick', 'Double-clic'), action: t('whiteboard.helpDialog.shortcutLabels.editText', 'Éditer le texte') },
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
          {t('whiteboard.helpDialog.title', "Guide d'utilisation du Tableau Blanc")}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Outils de dessin */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PenIcon />
              {t('whiteboard.helpDialog.drawingTools', 'Outils de dessin')}
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
              {t('whiteboard.helpDialog.mainActions', 'Actions principales')}
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
              {t('whiteboard.helpDialog.shortcuts', 'Raccourcis clavier et souris')}
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
              {t('whiteboard.helpDialog.tipsTitle', "Conseils d'utilisation")}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                {t('whiteboard.helpDialog.tips.usePan', "Utilisez l'outil Pan pour naviguer dans de grands tableaux blancs")}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                {t('whiteboard.helpDialog.tips.doubleClickToEdit', 'Double-cliquez sur un texte pour le modifier')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                {t('whiteboard.helpDialog.tips.multiSelectCtrl', 'Sélectionnez plusieurs éléments en maintenant Ctrl enfoncé')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                {t('whiteboard.helpDialog.tips.mouseWheelZoom', 'Utilisez la molette de la souris pour zoomer et dézoomer')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                {t('whiteboard.helpDialog.tips.tableCellSizes', 'Les tableaux peuvent être configurés avec différentes tailles de cellules')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          {t('common.close', 'Fermer')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default HelpDialog
