import { useEffect, useState } from 'react';
import { Pet } from './types/Pet';
import { getAllPets, addPet, deletePet, updatePet } from './api/petService';
import Modal from 'react-modal';

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Pet>({
    name: '',
    species: '',
    breed: '',
    gender: 'male',
    image: '',
    description: '',
    price: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllPets().then((data) => {
      setPets(data);
      setFilteredPets(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editPet) {
      setEditPet({ ...editPet, [e.target.name]: e.target.value });
    } else {
      setNewPet({ ...newPet, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPet) {
      const updated = await updatePet(editPet);
      const updatedPets = pets.map((p) => (p.id === updated.id ? updated : p));
      setPets(updatedPets);
      setFilteredPets(updatedPets);
    } else {
      const added = await addPet(newPet);
      const updatedPets = [...pets, added];
      setPets(updatedPets);
      setFilteredPets(updatedPets);
    }
    setNewPet({
      name: '',
      species: '',
      breed: '',
      gender: 'male',
      image: '',
      description: '',
      price: 0,
    });
    setEditPet(null);
    setIsModalOpen(false);
  };

  const handleEdit = (pet: Pet) => {
    setEditPet(pet);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePet(id);
      const updatedPets = pets.filter((pet) => pet.id !== id);
      setPets(updatedPets);
      setFilteredPets(updatedPets);
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = pets.filter((pet) =>
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.gender.toLowerCase().includes(query)
    );
    setFilteredPets(filtered);
  };

  return (
    <div className="container">
      <h1>Pet Store</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search pets..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <button onClick={() => { setIsModalOpen(true); setEditPet(null); }}>Add Pet</button>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>{editPet ? 'Edit Pet' : 'Add Pet'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={editPet ? editPet.name : newPet.name} placeholder="Name" onChange={handleChange} />
          <input name="species" value={editPet ? editPet.species : newPet.species} placeholder="Species" onChange={handleChange} />
          <input name="breed" value={editPet ? editPet.breed : newPet.breed} placeholder="Breed" onChange={handleChange} />
          <select name="gender" value={editPet ? editPet.gender : newPet.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input name="image" value={editPet ? editPet.image : newPet.image} placeholder="Image URL" onChange={handleChange} />
          <textarea name="description" value={editPet ? editPet.description : newPet.description} placeholder="Description" onChange={handleChange} />
          <input name="price" type="number" value={editPet ? editPet.price : newPet.price} placeholder="Price" onChange={handleChange} />

          <div className="center-button">
            <button type="submit" className="button-submit">
              {editPet ? 'Update Pet' : 'Add Pet'}
            </button>
          </div>
        </form>
      </Modal>

      <ul>
        {filteredPets.map((pet) => (
          <li key={pet.id} className="pet-card">
            <h3>Name: {pet.name}</h3>
            <p>Species: {pet.species}</p>
            <p>Breed: {pet.breed}</p>
            <p>Gender: {pet.gender}</p>
            {pet.image && <img src={pet.image} alt={pet.name} width="100" />}
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
