import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TableGestionBesoins from './TableGestionBesoins';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import GestionBesoinsChef from './GestionBesoinsChef';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { besoinApi } from './services/besoinApi';

const theme = createTheme({
  palette: {
    primary: {
      main: '#334B6B',
    },
    background: {
      default: '#E5E7EB',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#FFF',
    },
  },
});

function App() {
  const [formData, setFormData] = useState({
    rubrique: '',
    quantite: '',
    montant: '',
    description: ''
  });
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Exprimer un besoin');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [role, setRole] = useState('chef');
  const [rubriques, setRubriques] = useState([]);

  // Calcul automatique du total
  useEffect(() => {
    const quantite = parseFloat(formData.quantite) || 0;
    const montant = parseFloat(formData.montant) || 0;
    setTotal(quantite * montant);
  }, [formData.quantite, formData.montant]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      // Nettoie l'URL pour ne pas garder les infos sensibles
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload(); // Recharge pour que l'app prenne en compte le token
    }
  }, []);

  useEffect(() => {
    fetch('https://ipdl-backend-61889efa69fe.herokuapp.com/api/rubriques', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setRubriques(data.rubriques));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'http://localhost:5173/';
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setShowError(false);
    setShowSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rubrique) {
      newErrors.rubrique = 'Rubrique requise';
    }
    
    if (!formData.quantite) {
      newErrors.quantite = 'Quantité requise';
    } else if (isNaN(formData.quantite) || parseFloat(formData.quantite) <= 0) {
      newErrors.quantite = 'Quantité doit être un nombre positif';
    }
    
    if (!formData.montant) {
      newErrors.montant = 'Montant requis';
    } else if (isNaN(formData.montant) || parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Montant doit être un nombre positif';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description du besoin requise';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description doit contenir au moins 10 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setShowError(false);
    setShowSuccess(false);
    
    try {
      // Simulation d'une requête API
      await besoinApi.create({
        id_rubrique: formData.rubrique,
        quantite: formData.quantite,
        montant: formData.montant,
        total: total,
        description: formData.description
      });
      
      setShowSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        rubrique: '',
        quantite: '',
        montant: '',
        description: ''
      });
      
    } catch (error) {
      setShowError(true);
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirige vers la page de connexion (AUTHENTIFICATION)
    window.location.href = 'http://localhost:5173/'; // Mets ici l'URL de ton app d'authentification
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#E5E7EB',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Hamburger menu for mobile */}
        {isMobile && (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', p: 1 }}>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: '#334B6B', fontSize: 32 }} />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: '#334B6B',
                fontWeight: 'bold',
                fontSize: '2rem',
                flex: 1,
                textAlign: 'center',
                letterSpacing: 1,
              }}
            >
              ESP
            </Typography>
          </Box>
        )}
        {/* Sidebar ESP (hidden on mobile) */}
        {!isMobile && (
          <Box
            sx={{
              width: { xs: '100%', md: 250 },
              backgroundColor: '#334B6B',
              minHeight: { xs: 'auto', md: '100vh' },
              padding: { xs: 2, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                marginBottom: { xs: 2, md: 4 },
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center',
                width: '100%',
                letterSpacing: 1,
              }}
            >
              ESP
            </Typography>
            {/* Menu items */}
            <Box
              sx={{
                backgroundColor: selectedMenu === 'Exprimer un besoin' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                borderRadius: 2,
                padding: '10px 18px',
                marginBottom: 2,
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                transition: 'background 0.2s',
              }}
              onClick={() => setSelectedMenu('Exprimer un besoin')}
            >
              <AddIcon sx={{ color: '#FFF', mr: 1, fontSize: 18 }} />
              <Typography
                sx={{
                  color: selectedMenu === 'Exprimer un besoin' ? '#FFF' : '#FFF',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  letterSpacing: 0.5,
                }}
              >
                Exprimer un besoin
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: selectedMenu === 'Mes Besoins' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                borderRadius: 2,
                padding: '10px 18px',
                marginBottom: 2,
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                transition: 'background 0.2s',
              }}
              onClick={() => setSelectedMenu('Mes Besoins')}
            >
              <ListIcon sx={{ color: '#FFF', mr: 1, fontSize: 18 }} />
              <Typography
                sx={{
                  color: selectedMenu === 'Mes Besoins' ? '#FFF' : '#FFF',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  letterSpacing: 0.5,
                }}
              >
                Mes Besoins
              </Typography>
            </Box>
            {role === 'chef' && (
              <Box
                sx={{
                  backgroundColor: selectedMenu === 'Gestion des besoins' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                  borderRadius: 2,
                  padding: '10px 18px',
                  marginBottom: 2,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  transition: 'background 0.2s',
                }}
                onClick={() => setSelectedMenu('Gestion des besoins')}
              >
                <AdminPanelSettingsIcon sx={{ color: '#FFF', mr: 1, fontSize: 18 }} />
                <Typography
                  sx={{
                    color: selectedMenu === 'Gestion des besoins' ? '#FFF' : '#FFF',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    letterSpacing: 0.5,
                  }}
                >
                  Gestion des besoins
                </Typography>
              </Box>
            )}
            
            {/* Déconnexion en bas du sidebar */}
            <Box sx={{ flex: 1 }} />
            <Box
              sx={{
                backgroundColor: 'transparent',
                borderRadius: 2,
                padding: '10px 18px',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                transition: 'background 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={handleLogout}
            >
              <LogoutIcon sx={{ color: '#FFF', mr: 1, fontSize: 18 }} />
              <Typography
                sx={{
                  color: '#FFF',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  letterSpacing: 0.5,
                }}
              >
                Déconnexion
              </Typography>
            </Box>
          </Box>
        )}
        {/* Drawer for mobile menu */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: 220,
              backgroundColor: '#334B6B',
              color: '#FFF',
              pt: 2,
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#FFF',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
              letterSpacing: 1,
            }}
          >
            ESP
          </Typography>
          <Divider sx={{ background: '#FFF', opacity: 0.1, mb: 1 }} />
          <Box
            sx={{
              backgroundColor: selectedMenu === 'Exprimer un besoin' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              borderRadius: 2,
              padding: '10px 18px',
              marginBottom: 2,
              cursor: 'pointer',
              width: '90%',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              transition: 'background 0.2s',
            }}
            onClick={() => { setSelectedMenu('Exprimer un besoin'); setDrawerOpen(false); }}
          >
            <AddIcon sx={{ color: '#FFF', mr: 1, fontSize: 20 }} />
            <Typography
              sx={{
                color: selectedMenu === 'Exprimer un besoin' ? '#FFF' : '#FFF',
                fontSize: selectedMenu === 'Exprimer un besoin' ? '1.1rem' : '1rem',
                fontWeight: 400,
                letterSpacing: 0.5,
              }}
            >
              Exprimer un besoin
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: selectedMenu === 'Mes Besoins' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              borderRadius: 2,
              padding: '10px 18px',
              marginBottom: 2,
              cursor: 'pointer',
              width: '90%',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              transition: 'background 0.2s',
            }}
            onClick={() => { setSelectedMenu('Mes Besoins'); setDrawerOpen(false); }}
          >
            <ListIcon sx={{ color: '#FFF', mr: 1, fontSize: 20 }} />
            <Typography
              sx={{
                color: selectedMenu === 'Mes Besoins' ? '#FFF' : '#FFF',
                fontSize: selectedMenu === 'Mes Besoins' ? '1.1rem' : '1rem',
                fontWeight: 400,
                letterSpacing: 0.5,
              }}
            >
              Mes Besoins
            </Typography>
          </Box>
          {role === 'chef' && (
            <Box
              sx={{
                backgroundColor: selectedMenu === 'Gestion des besoins' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                borderRadius: 2,
                padding: '10px 18px',
                marginBottom: 2,
                cursor: 'pointer',
                width: '90%',
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                transition: 'background 0.2s',
              }}
              onClick={() => { setSelectedMenu('Gestion des besoins'); setDrawerOpen(false); }}
            >
              <AdminPanelSettingsIcon sx={{ color: '#FFF', mr: 1, fontSize: 20 }} />
              <Typography
                sx={{
                  color: selectedMenu === 'Gestion des besoins' ? '#FFF' : '#FFF',
                  fontSize: selectedMenu === 'Gestion des besoins' ? '1.1rem' : '1rem',
                  fontWeight: 400,
                  letterSpacing: 0.5,
                }}
              >
                Gestion des besoins
              </Typography>
            </Box>
          )}
          
          {/* Déconnexion en bas du drawer mobile */}
          <Box sx={{ flex: 1 }} />
          <Box
            sx={{
              backgroundColor: 'transparent',
              borderRadius: 2,
              padding: '10px 18px',
              cursor: 'pointer',
              width: '90%',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              transition: 'background 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={handleLogout}
          >
            <LogoutIcon sx={{ color: '#FFF', mr: 1, fontSize: 20 }} />
            <Typography
              sx={{
                color: '#FFF',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: 0.5,
              }}
            >
              Déconnexion
            </Typography>
          </Box>
        </Drawer>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: { xs: 1, sm: 3 },
            overflow: 'auto',
          }}
        >
          <Card
            elevation={3}
            sx={{
              backgroundColor: '#FFF',
              borderRadius: 2,
              width: '100%',
              maxWidth: 1100,
              minHeight: 600,
              maxHeight: 'calc(100vh - 32px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 4px 24px 0 rgba(51,75,107,0.08)',
            }}
          >
            <CardContent sx={{ flex: '1 1 0', overflowY: 'auto', padding: { xs: 1, sm: 2 } }}>
              {selectedMenu === 'Exprimer un besoin' ? (
                <>
                  {showSuccess && (
                    <Alert 
                      severity="success" 
                      sx={{ 
                        marginBottom: 3,
                        '& .MuiAlert-message': {
                          color: '#000'
                        }
                      }}
                    >
                      Demande soumise avec succès !
                    </Alert>
                  )}

                  {showError && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        marginBottom: 3,
                        '& .MuiAlert-message': {
                          color: '#000'
                        }
                      }}
                    >
                      Erreur lors de la soumission. Veuillez réessayer.
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Première ligne: Rubrique et Quantité */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        marginBottom: 2,
                        marginTop: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <FormControl
                        fullWidth
                        error={!!errors.rubrique}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#FFF',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#999',
                          },
                          minWidth: { xs: '100%', sm: 220, md: 260 },
                          flex: 1,
                        }}
                      >
                        <InputLabel id="rubrique-label">Rubrique</InputLabel>
                        <Select
                          labelId="rubrique-label"
                          id="rubrique"
                          name="rubrique"
                          value={formData.rubrique}
                          label="Rubrique"
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E0E0E0',
                            },
                          }}
                        >
                          {rubriques.map((rubrique) => (
                            <MenuItem key={rubrique.id} value={rubrique.id}>
                              {rubrique.nom_rubrique}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.rubrique && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.rubrique}
                          </Typography>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        id="quantite"
                        name="quantite"
                        label="Quantité"
                        type="number"
                        value={formData.quantite}
                        onChange={handleChange}
                        error={!!errors.quantite}
                        helperText={errors.quantite}
                        variant="outlined"
                        inputProps={{ min: "0", step: "1" }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#FFF',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#999',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                          minWidth: { xs: '100%', sm: 220, md: 260 },
                          flex: 1,
                        }}
                      />
                    </Box>

                    {/* Deuxième ligne: Montant et Total */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        marginBottom: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <TextField
                        fullWidth
                        id="montant"
                        name="montant"
                        label="Montant"
                        type="number"
                        value={formData.montant}
                        onChange={handleChange}
                        error={!!errors.montant}
                        helperText={errors.montant}
                        variant="outlined"
                        inputProps={{ min: "0", step: "0.01" }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#FFF',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#999',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                          minWidth: { xs: '100%', sm: 220, md: 260 },
                          flex: 1,
                        }}
                      />

                      <TextField
                        fullWidth
                        id="total"
                        name="total"
                        label="Total"
                        type="number"
                        value={total.toFixed(2)}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#F5F5F5',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#999',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                          minWidth: { xs: '100%', sm: 220, md: 260 },
                          flex: 1,
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description du besoin"
                      multiline
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      error={!!errors.description}
                      helperText={errors.description}
                      variant="outlined"
                      sx={{
                        marginBottom: 3,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFF',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#999',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                      }}
                    />

                    {/* Bouton de soumission */}
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          backgroundColor: '#334B6B',
                          color: '#FFF',
                          fontWeight: 500,
                          fontSize: '1rem',
                          padding: '12px 32px',
                          borderRadius: 1,
                          textTransform: 'none',
                          minWidth: 150,
                          width: { xs: '100%', sm: 'auto' },
                          '&:hover': {
                            backgroundColor: '#2a3f57',
                          },
                          '&:disabled': {
                            backgroundColor: '#334B6B',
                            opacity: 0.7,
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Soumettre'
                        )}
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : selectedMenu === 'Mes Besoins' ? (
                <TableGestionBesoins />
              ) : selectedMenu === 'Gestion des besoins' && role === 'chef' ? (
                <GestionBesoinsChef />
              ) : null}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;