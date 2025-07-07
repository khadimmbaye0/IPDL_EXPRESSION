import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Typography,
  Modal,
  TextField
} from '@mui/material';
import { besoinApi } from './services/besoinApi';

const sampleData = [
  {
    id: 1,
    rubrique: 'Materiel',
    statut: 'en attente',
  },
  {
    id: 2,
    rubrique: 'Materiel',
    statut: 'en attente',
  },
];

function DevModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
        minWidth: 250,
        textAlign: 'center',
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          En cours de développement
        </Typography>
        <Button variant="contained" onClick={onClose} sx={{ mt: 1 }}>Fermer</Button>
      </Box>
    </Modal>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'en attente':
      return { backgroundColor: '#E5F0FB', color: '#334B6B' };
    case 'valide':
      return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
    case 'rejete':
      return { backgroundColor: '#FFEBEE', color: '#D32F2F' };
    default:
      return { backgroundColor: '#F5F5F5', color: '#757575' };
  }
};

export default function TableGestionBesoins() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedBesoin, setSelectedBesoin] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBesoin, setEditBesoin] = useState(null);
  const [editQuantite, setEditQuantite] = useState(0);
  const [editMontant, setEditMontant] = useState(0);
  const [editTotal, setEditTotal] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteBesoin, setDeleteBesoin] = useState(null);

  useEffect(() => {
    besoinApi.getMyBesoins().then(besoins => {
      // Tri croissant par ID
      besoins.sort((a, b) => a.id - b.id);
      setData(besoins);
    });
  }, []);

  const handleAction = () => {
    setModalOpen(true);
  };

  return (
    <Box sx={{ width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex' }}>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          boxShadow: '0 4px 24px 0 rgba(51,75,107,0.08)',
          borderRadius: 3,
          overflowX: 'auto',
          background: '#FFF',
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
              <TableCell sx={{ fontWeight: 600, color: '#334B6B', fontSize: '0.95rem', borderTopLeftRadius: 12, py: 1 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#334B6B', fontSize: '0.95rem', py: 1 }}>Rubrique</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#334B6B', fontSize: '0.95rem', py: 1 }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#334B6B', fontSize: '0.95rem', borderTopRightRadius: 12, py: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: '#FFF',
                  borderBottom: '1px solid #E5E7EB',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell sx={{ py: 1, fontSize: '0.97rem' }}>{row.id}</TableCell>
                <TableCell sx={{ py: 1, fontSize: '0.97rem' }}>{row.nom_rubrique}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={row.statut}
                    sx={{
                      ...getStatusColor(row.statut),
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      borderRadius: 2,
                      px: 1.2,
                      py: 0.2,
                      height: 24,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedBesoin(row);
                        setModalOpen(true);
                      }}
                      sx={{
                        backgroundColor: '#2176FF',
                        color: '#FFF',
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        fontWeight: 600,
                        fontSize: '0.90rem',
                        boxShadow: 'none',
                        textTransform: 'none',
                        minWidth: 80,
                        '&:hover': {
                          backgroundColor: '#185dc6',
                        },
                      }}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setEditBesoin(row);
                        setEditQuantite(row.quantite);
                        setEditMontant(row.montant);
                        setEditTotal(row.quantite * row.montant);
                        setEditModalOpen(true);
                      }}
                      sx={{
                        backgroundColor: '#FFF',
                        color: '#2176FF',
                        borderColor: '#2176FF',
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        fontWeight: 600,
                        fontSize: '0.90rem',
                        textTransform: 'none',
                        minWidth: 80,
                        '&:hover': {
                          backgroundColor: '#E5F0FB',
                          borderColor: '#2176FF',
                        },
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setDeleteBesoin(row);
                        setDeleteModalOpen(true);
                      }}
                      sx={{
                        backgroundColor: '#F44336',
                        color: '#FFF',
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        fontWeight: 600,
                        fontSize: '0.90rem',
                        textTransform: 'none',
                        minWidth: 80,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#d32f2f',
                        },
                      }}
                    >
                      Supprimer
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          minWidth: 350,
          textAlign: 'left',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Détails de la demande
          </Typography>
          {selectedBesoin && (
            <>
              <Typography><b>Rubrique :</b> {selectedBesoin.nom_rubrique}</Typography>
              <Typography><b>Quantité :</b> {selectedBesoin.quantite}</Typography>
              <Typography><b>Montant :</b> {selectedBesoin.montant}</Typography>
              <Typography><b>Total :</b> {selectedBesoin.total}</Typography>
              <Typography><b>Description :</b> {selectedBesoin.description}</Typography>
              <Typography><b>Statut :</b> {selectedBesoin.statut}</Typography>
              <Typography><b>Date :</b> {selectedBesoin.date_soumission}</Typography>
            </>
          )}
          <Button variant="contained" onClick={() => setModalOpen(false)} sx={{ mt: 2 }}>Fermer</Button>
        </Box>
      </Modal>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          minWidth: 350,
          textAlign: 'left',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Modifier le besoin
          </Typography>
          {editBesoin && (
            <>
              <Typography><b>Rubrique :</b> {editBesoin.nom_rubrique}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Quantité"
                  type="number"
                  value={editQuantite}
                  onChange={e => {
                    setEditQuantite(e.target.value);
                    setEditTotal(e.target.value * editMontant);
                  }}
                  fullWidth
                />
                <TextField
                  label="Montant"
                  type="number"
                  value={editMontant}
                  onChange={e => {
                    setEditMontant(e.target.value);
                    setEditTotal(editQuantite * e.target.value);
                  }}
                  fullWidth
                />
              </Box>
              <TextField
                label="Total"
                type="number"
                value={editTotal}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={async () => {
                  await besoinApi.updateBesoin(editBesoin.id, {
                    id_rubrique: editBesoin.id_rubrique,
                    quantite: editQuantite,
                    montant: editMontant,
                    total: editTotal,
                    description: editBesoin.description
                  });
                  setEditModalOpen(false);
                  // Recharge la liste
                  besoinApi.getMyBesoins().then(setData);
                }}
                sx={{ mr: 2 }}
              >
                Enregistrer
              </Button>
              <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
                Annuler
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          minWidth: 350,
          textAlign: 'center',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Confirmer la suppression
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Es-tu sûr de vouloir supprimer ce besoin ?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await besoinApi.deleteBesoin(deleteBesoin.id);
              setDeleteModalOpen(false);
              besoinApi.getMyBesoins().then(setData);
            }}
            sx={{ mr: 2 }}
          >
            Supprimer
          </Button>
          <Button variant="outlined" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
        </Box>
      </Modal>
    </Box>
  );
} 