import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper
} from '@mui/material';
import { besoinApi } from './services/besoinApi';

function DashboardCounters({ requests }) {
  const enAttente = requests.filter(r => r.statut === 'en attente').length;
  const valides = requests.filter(r => r.statut === 'valide').length;
  const rejetes = requests.filter(r => r.statut === 'rejete').length;
  return (
    <Grid container spacing={2} sx={{ mb: 3, width: '100%' }}>
      <Grid item xs={12} sm={4} sx={{ flex: 1 }}>
        <Paper elevation={0} sx={{ border: '2px solid #90caf9', borderRadius: 3, p: 2, textAlign: 'center', bgcolor: '#F7FBFF', height: '100%' }}>
          <Typography sx={{ color: '#2196F3', fontSize: '2rem', mb: 0.5, fontWeight: 400 }}>{enAttente}</Typography>
          <Typography sx={{ color: '#2196F3', fontSize: '1.1rem', fontWeight: 400 }}>En attentes</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ flex: 1 }}>
        <Paper elevation={0} sx={{ border: '2px solid #81c784', borderRadius: 3, p: 2, textAlign: 'center', bgcolor: '#F8FCF7', height: '100%' }}>
          <Typography sx={{ color: '#43A047', fontSize: '2rem', mb: 0.5, fontWeight: 400 }}>{valides}</Typography>
          <Typography sx={{ color: '#43A047', fontSize: '1.1rem', fontWeight: 400 }}>Valides</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ flex: 1 }}>
        <Paper elevation={0} sx={{ border: '2px solid #e57373', borderRadius: 3, p: 2, textAlign: 'center', bgcolor: '#FFF7F7', height: '100%' }}>
          <Typography sx={{ color: '#E53935', fontSize: '2rem', mb: 0.5, fontWeight: 400 }}>{rejetes}</Typography>
          <Typography sx={{ color: '#E53935', fontSize: '1.1rem', fontWeight: 400 }}>Rejettes</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 3,
  }).format(amount);
}

function getStatusColor(status) {
  switch (status) {
    case 'en attente':
      return { color: '#1976D2', bgcolor: '#E3F2FD', border: '1px solid #2196F3' };
    case 'valide':
      return { color: '#2E7D32', bgcolor: '#E8F5E8', border: '1px solid #4CAF50' };
    case 'rejete':
      return { color: '#D32F2F', bgcolor: '#FFEBEE', border: '1px solid #F44336' };
    default:
      return { color: '#757575', bgcolor: '#F5F5F5', border: '1px solid #BDBDBD' };
  }
}

export default function GestionBesoinsChef() {
  const [requests, setRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, requestId: null, currentStatus: null });

  useEffect(() => {
    besoinApi.getAll().then(setRequests);
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      if (action === 'valide') {
        await besoinApi.valider(requestId);
      } else if (action === 'rejete') {
        await besoinApi.rejeter(requestId);
      }
      // Recharge la liste depuis le backend
      const besoins = await besoinApi.getAll();
      setRequests(besoins);
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut !");
    }
    setConfirmDialog({ open: false, action: null, requestId: null, currentStatus: null });
  };

  const handleConfirmAction = (requestId, action, currentStatus) => {
    setConfirmDialog({ open: true, action, requestId, currentStatus });
  };

  const handleDetails = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const getActionText = (action, currentStatus) => {
    if (action === 'valide') {
      return currentStatus === 'rejete' ? 'valider' : 'valider';
    } else if (action === 'rejete') {
      return currentStatus === 'valide' ? 'rejeter' : 'rejeter';
    }
    return action === 'valide' ? 'valider' : 'rejeter';
  };

  const getActionColor = (action) => {
    return action === 'valide' ? 'success' : 'error';
  };

  const getConfirmationMessage = (action, currentStatus) => {
    if (action === 'valide' && currentStatus === 'rejete') {
      return 'Êtes-vous sûr de vouloir valider cette demande qui était rejetée ?';
    } else if (action === 'rejete' && currentStatus === 'valide') {
      return 'Êtes-vous sûr de vouloir rejeter cette demande qui était validée ?';
    } else if (action === 'valide' && currentStatus === 'en attente') {
      return 'Êtes-vous sûr de vouloir valider cette demande ?';
    } else if (action === 'rejete' && currentStatus === 'en attente') {
      return 'Êtes-vous sûr de vouloir rejeter cette demande ?';
    }
    return `Êtes-vous sûr de vouloir ${getActionText(action, currentStatus)} cette demande ?`;
  };

  const renderActionButtons = (request) => {
    const { id, statut } = request;
    
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {statut === 'en attente' && (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleConfirmAction(id, 'valide', statut)}
              sx={{
                minWidth: 90,
                textTransform: 'none',
                fontWeight: 400,
                borderRadius: 2,
                fontSize: '0.95rem',
              }}
            >
              Valider
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleConfirmAction(id, 'rejete', statut)}
              sx={{
                minWidth: 90,
                textTransform: 'none',
                fontWeight: 400,
                borderRadius: 2,
                fontSize: '0.95rem',
              }}
            >
              Rejeter
            </Button>
          </>
        )}
        
        {statut === 'valide' && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleConfirmAction(id, 'rejete', statut)}
            sx={{
              minWidth: 90,
              textTransform: 'none',
              fontWeight: 400,
              borderRadius: 2,
              fontSize: '0.95rem',
            }}
          >
            Rejeter
          </Button>
        )}
        
        {statut === 'rejete' && (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleConfirmAction(id, 'valide', statut)}
            sx={{
              minWidth: 90,
              textTransform: 'none',
              fontWeight: 400,
              borderRadius: 2,
              fontSize: '0.95rem',
            }}
          >
            Valider
          </Button>
        )}
        
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleDetails(request)}
          sx={{
            minWidth: 90,
            textTransform: 'none',
            fontWeight: 400,
            borderRadius: 2,
            fontSize: '0.95rem',
            backgroundColor: '#2196F3',
            '&:hover': {
              backgroundColor: '#1976D2',
            },
          }}
        >
          Details
        </Button>
      </Box>
    );
  };

  return (
    <Box>
      <DashboardCounters requests={requests} />
      <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F3F4F6' }}>
                <TableCell sx={{ fontWeight: 500, py: 2, fontSize: '1rem', color: '#334B6B' }}>Demandeur</TableCell>
                <TableCell sx={{ fontWeight: 500, py: 2, fontSize: '1rem', color: '#334B6B' }}>Rubrique</TableCell>
                <TableCell sx={{ fontWeight: 500, py: 2, fontSize: '1rem', color: '#334B6B' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 500, py: 2, fontSize: '1rem', color: '#334B6B' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 500, py: 2, fontSize: '1rem', color: '#334B6B' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.id}
                  sx={{ '&:hover': { bgcolor: '#F8F9FA' }, transition: 'background-color 0.2s ease' }}
                >
                  <TableCell sx={{ py: 2, fontSize: '0.95rem' }}>{request.nom_utilisateur} {request.prenom}</TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.95rem' }}>{request.nom_rubrique}</TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.95rem' }}>{formatCurrency(request.total)}</TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={request.statut}
                      size="small"
                      sx={{
                        ...getStatusColor(request.statut),
                        fontWeight: 400,
                        fontSize: '0.8rem',
                        borderRadius: 2,
                        px: 1.2,
                        py: 0.2,
                        height: 24,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    {renderActionButtons(request)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal de confirmation */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, action: null, requestId: null, currentStatus: null })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {getConfirmationMessage(confirmDialog.action, confirmDialog.currentStatus)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: null, requestId: null, currentStatus: null })}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 400 }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleAction(confirmDialog.requestId, confirmDialog.action)}
            variant="contained"
            color={getActionColor(confirmDialog.action)}
            sx={{ textTransform: 'none', fontWeight: 400 }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de détails */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
          Détails de la demande
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Demandeur :</strong> {selectedRequest.nom_utilisateur} {selectedRequest.prenom}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Rubrique :</strong> {selectedRequest.nom_rubrique}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Quantité :</strong> {selectedRequest.quantite}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Montant :</strong> {selectedRequest.montant}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Total :</strong> {formatCurrency(selectedRequest.total)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Description :</strong> {selectedRequest.description}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Date de soumission :</strong> {selectedRequest.date_soumission}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Statut :</strong>
                <Chip
                  label={selectedRequest.statut}
                  size="small"
                  sx={{
                    ...getStatusColor(selectedRequest.statut),
                    fontWeight: 400,
                    ml: 1,
                  }}
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 400 }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 