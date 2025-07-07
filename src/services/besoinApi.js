// src/services/besoinApi.js
import axios from 'axios';

const API_URL = 'https://ipdl-backend-61889efa69fe.herokuapp.com/api';

const getToken = () => localStorage.getItem('token');

export const besoinApi = {
  // Créer un besoin
  create: async (data) => {
    const res = await axios.post(`${API_URL}/besoins`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },

  // Lister MES besoins
  getMyBesoins: async () => {
    const res = await axios.get(`${API_URL}/mes-besoins`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data.besoins;
  },

  // Lister TOUS les besoins (chef/admin)
  getAll: async () => {
    const res = await axios.get(`${API_URL}/besoins`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data.besoins;
  },

  // Valider un besoin
  valider: async (id) => {
    const res = await axios.put(`${API_URL}/besoins/${id}/valider`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },

  // Rejeter un besoin
  rejeter: async (id) => {
    const res = await axios.put(`${API_URL}/besoins/${id}/rejeter`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },

  updateBesoin: async (id, data) => {
    const res = await axios.put(`${API_URL}/besoins/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },

  deleteBesoin: async (id) => {
    const res = await axios.delete(`${API_URL}/besoins/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  }
};