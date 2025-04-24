import { useEffect, useState } from 'react';
import { Pet } from './types/Pet';
import { getAllPets, addPet, deletePet } from './api/petService';
import Modal from 'react-modal';

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Pet>({
    name: '',
    species: '',
    breed: '',
    gender: 'male', // Default to male
    image: '',
    description: '',
    price: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);

  useEffect(() => {
    getAllPets().then(setPets);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const added = await addPet(newPet);
    setPets([...pets, added]);
    setIsModalOpen(false); // Close the modal after submitting
  };

  const handleEdit = (pet: Pet) => {
    setEditPet(pet);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPet) {
      const updatedPet = await addPet(editPet); // Use appropriate method for update
      setPets(pets.map((p) => (p.id === updatedPet.id ? updatedPet : p)));
      setIsModalOpen(false); // Close modal after update
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePet(id);
      setPets(pets.filter((pet) => pet.id !== id)); // Remove pet from the state
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  return (
    <div className="container">
      <h1>Pet Store</h1>
      <button onClick={() => setIsModalOpen(true)}>Add Pet</button>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>{editPet ? 'Edit Pet' : 'Add Pet'}</h2>
        <form onSubmit={editPet ? handleEditSubmit : handleSubmit}>
          <input name="name" value={newPet.name} placeholder="Name" onChange={handleChange} />
          <input name="species" value={newPet.species} placeholder="Species" onChange={handleChange} />
          <input name="breed" value={newPet.breed} placeholder="Breed" onChange={handleChange} />
          <select name="gender" value={newPet.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input name="image" value={newPet.image} placeholder="Image URL" onChange={handleChange} />
          <textarea name="description" value={newPet.description} placeholder="Description" onChange={handleChange} />
          <input name="price" type="number" value={newPet.price} placeholder="Price" onChange={handleChange} />
          
          {/* Button centered */}
          <div className="center-button">
            <button type="submit" className="button-submit">
              {editPet ? 'Update Pet' : 'Add Pet'}
            </button>
          </div>
        </form>
      </Modal>

      <ul>
        {pets.map((pet) => (
          <li key={pet.id} className="pet-card">
            <h3>Name: {pet.name}</h3>
            <p>Species: {pet.species}</p>
            <p>Breed: {pet.breed}</p>
            <p>Gender: {pet.gender}</p>
            <img src={pet.image} alt={pet.name} width="100" />
            <p>Description: {pet.description}</p>
            <p>Price: ${pet.price}</p>
            <button onClick={() => handleEdit(pet)}>Edit</button>
            <button onClick={() => handleDelete(pet.id!)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
