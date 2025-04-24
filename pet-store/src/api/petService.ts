import { Pet } from '../types/Pet';

const API_BASE = 'http://localhost:8080/martin/pets';

export const getAllPets = async (): Promise<Pet[]> => {
  const res = await fetch(API_BASE);
  return await res.json();
};

export const addPet = async (pet: Pet): Promise<Pet> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet),
  });
  return await res.json();
};

export const addBulkPets = async (pets: Pet[]): Promise<Pet[]> => {
  const res = await fetch(`${API_BASE}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pets),
  });
  return await res.json();
};

export const deletePet = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      throw new Error('Failed to delete pet');
    }
  };