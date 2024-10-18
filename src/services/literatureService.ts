import axios from 'axios';
import { Literature } from '../interfaces/literatureInterface';

const API_URL = import.meta.env.VITE_API_URL;

// Ottieni tutte le letterature
export const getLiteratures = async (): Promise<Literature[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/literatures`);
        return response.data;
    } catch (error) {
        console.error('Error fetching literatures:', error);
        throw new Error('Failed to fetch literatures.');
    }
};

// Ottieni letteratura per ID
export const getLiteratureById = async (id: string): Promise<Literature> => {
    try {
        const response = await axios.get(`${API_URL}/api/literatures/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching literature with ID ${id}:`, error);
        throw new Error('Failed to fetch literature.');
    }
};
