package com.martin.Pet;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import java.util.Optional;

@RestController
@RequestMapping("/martin/pets")
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    // Create a new pet
    @PostMapping
    public ResponseEntity<Pet> addPet(@RequestBody Pet pet) {
        Pet savedPet = petRepository.save(pet);
        return ResponseEntity.status(201).body(savedPet);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Pet>> addPetsInBulk(@RequestBody List<Pet> pets) {
        List<Pet> savedPets = petRepository.saveAll(pets);
        return new ResponseEntity<>(savedPets, HttpStatus.CREATED);
    }

    // Retrieve all pets
    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    // Retrieve pet by ID (Fixed)
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return petRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }

    // Update a pet by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@PathVariable Long id, @RequestBody Pet updatedPet) {
        if (petRepository.existsById(id)) {
            updatedPet.setId(id);
            Pet savedPet = petRepository.save(updatedPet);
            return ResponseEntity.ok(savedPet);
        }
        return ResponseEntity.status(404).body("{\"error\": \"Pet not found\"}");
    }

    // Delete a pet by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        if (petRepository.existsById(id)) {
            petRepository.deleteById(id);
            return ResponseEntity.ok("Pet with id {" + id + "} deleted.");
        }
        return ResponseEntity.status(404).body("{\"error\": \"Pet not found\"}");
    }

    // Search pets by keyword
    @GetMapping("/search/{key}")
    public List<Pet> searchPetsByKeyword(@PathVariable String key) {
        return petRepository.findByKeyword(key);
    }

    // Search pets by price
    @GetMapping("/search/price/{price}")
    public List<Pet> searchPetsByPrice(@PathVariable double price) {
        return petRepository.findByPriceLessThanEqual(price);
    }
}