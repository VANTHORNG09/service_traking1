import { create } from 'zustand';
import { Service, ServiceStats } from '../types';
import api from '../services/api';

interface ServiceState {
  services: Service[];
  serviceStats: ServiceStats | null;
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  createService: (serviceData: Partial<Service>) => Promise<Service>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  fetchServiceStats: () => Promise<void>;
  clearError: () => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  serviceStats: null,
  currentService: null,
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/services');
      set({ services: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch services', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchServiceById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/services/${id}`);
      set({ currentService: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch service', 
        isLoading: false 
      });
      throw error;
    }
  },

  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/services', serviceData);
      set((state) => ({ services: [...state.services, response.data], isLoading: false }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create service', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      set((state) => ({
        services: state.services.map(s => s.id === id ? response.data : s),
        currentService: response.data,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update service', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/services/${id}`);
      set((state) => ({
        services: state.services.filter(s => s.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete service', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchServiceStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/services/stats');
      set({ serviceStats: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch service stats', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));