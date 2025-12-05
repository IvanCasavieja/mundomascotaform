import React, { useState } from 'react';
import headerImg from './header.jpg';
import footerImg from './footer.png';
import './MundoMascotaForm.css';

const maxPets = 5;
const SUBMIT_URL =
  (import.meta.env.VITE_MUNDO_MASCOTA_ENDPOINT || '').trim() ||
  '/.netlify/functions/submit';
const API_KEY = (import.meta.env.VITE_MUNDO_MASCOTA_KEY || '').trim();

const createEmptyPet = () => ({
  name: '',
  species: '',
  breed: '',
  weightRange: '',
  birthday: '',
  condition: '',
});

function MundoMascotaForm() {
  const [email, setEmail] = useState('');
  const [pets, setPets] = useState([createEmptyPet()]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePetChange = (index, field, value) => {
    setPets((prevPets) =>
      prevPets.map((pet, petIndex) =>
        petIndex === index ? { ...pet, [field]: value } : pet
      )
    );
  };

  const handleAddPet = () => {
    if (pets.length >= maxPets) {
      setStatusMessage(`Podés registrar hasta ${maxPets} mascotas.`);
      return;
    }
    setStatusMessage('');
    setPets((prevPets) => [...prevPets, createEmptyPet()]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setIsSubmitting(true);

    if (!SUBMIT_URL) {
      setStatusMessage('Configura el endpoint antes de enviar.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      email,
      pets,
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      const response = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatusMessage('¡Gracias! Tus datos fueron enviados.');
        setEmail('');
        setPets([createEmptyPet()]);
      } else {
        setStatusMessage('Ocurrió un problema al enviar. Intentá nuevamente.');
      }
    } catch (error) {
      console.error('Error enviando formulario', error);
      setStatusMessage('Ocurrió un problema al enviar. Intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mundo-mascota-form">
      <div className="mmf-shell">
        <img src={headerImg} alt="Formulario Mundo Mascota 2025" className="mmf-header" />

        <div className="mmf-card">
          <h1 className="mmf-title">Queremos conocer a tus mascotas para asesorarte mejor</h1>
          <p className="mmf-subtitle">Ingresá sus datos y te regalamos $300 en tu próxima compra*</p>

          <form className="mmf-form" onSubmit={handleSubmit}>
            <div className="mmf-field">
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tuemail@ejemplo.com"
              />
            </div>

            {pets.map((pet, index) => (
              <div className="mmf-pet-block" key={`pet-${index}`}>
                <div className="mmf-pet-header">Mascota {index + 1}</div>

                <div className="mmf-field">
                  <label htmlFor={`pet-name-${index}`}>Nombre de tu mascota*</label>
                  <input
                    id={`pet-name-${index}`}
                    type="text"
                    name={`pet-name-${index}`}
                    value={pet.name}
                    onChange={(e) => handlePetChange(index, 'name', e.target.value)}
                    required
                    placeholder="Firulais"
                  />
                </div>

                <div className="mmf-field">
                  <label htmlFor={`pet-species-${index}`}>Especie*</label>
                  <select
                    id={`pet-species-${index}`}
                    name={`pet-species-${index}`}
                    value={pet.species}
                    onChange={(e) => handlePetChange(index, 'species', e.target.value)}
                    required
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>

                <div className="mmf-field">
                  <label htmlFor={`pet-breed-${index}`}>Raza</label>
                  <input
                    id={`pet-breed-${index}`}
                    type="text"
                    name={`pet-breed-${index}`}
                    value={pet.breed}
                    onChange={(e) => handlePetChange(index, 'breed', e.target.value)}
                    placeholder="Labrador"
                  />
                </div>

                <div className="mmf-field">
                  <label htmlFor={`pet-weight-${index}`}>Peso*</label>
                  <select
                    id={`pet-weight-${index}`}
                    name={`pet-weight-${index}`}
                    value={pet.weightRange}
                    onChange={(e) => handlePetChange(index, 'weightRange', e.target.value)}
                    required
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="5 a 10 Kg (raza pequeña)">5 a 10 Kg (raza pequeña)</option>
                    <option value="10 a 25 Kg (raza mediana)">10 a 25 Kg (raza mediana)</option>
                    <option value="25 a 40 Kg (raza grande)">25 a 40 Kg (raza grande)</option>
                    <option value="+ 40 Kg (raza gigante)">+ 40 Kg (raza gigante)</option>
                  </select>
                </div>

                <div className="mmf-field">
                  <label htmlFor={`pet-birthday-${index}`}>Cumpleaños*</label>
                  <input
                    id={`pet-birthday-${index}`}
                    type="date"
                    name={`pet-birthday-${index}`}
                    value={pet.birthday}
                    onChange={(e) => handlePetChange(index, 'birthday', e.target.value)}
                    required
                  />
                </div>

                <div className="mmf-field">
                  <label htmlFor={`pet-condition-${index}`}>Condición*</label>
                  <select
                    id={`pet-condition-${index}`}
                    name={`pet-condition-${index}`}
                    value={pet.condition}
                    onChange={(e) => handlePetChange(index, 'condition', e.target.value)}
                    required
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="Normal">Normal</option>
                    <option value="Castrado y/o tendencia al sobrepeso">
                      Castrado y/o tendencia al sobrepeso
                    </option>
                    <option value="Sobrepeso y obesidad">Sobrepeso y obesidad</option>
                    <option value="Sensibilidad digestiva y/o cutánea, o rascado">
                      Sensibilidad digestiva y/o cutánea, o rascado
                    </option>
                    <option value="Enfermedad Renal">Enfermedad Renal</option>
                    <option value="Antecedentes de enfermedad de las vías urinarias">
                      Antecedentes de enfermedad de las vías urinarias
                    </option>
                    <option value="Trastornos urinarios en curso">Trastornos urinarios en curso</option>
                    <option value="Trastornos gastrointestinales">Trastornos gastrointestinales</option>
                    <option value="Trastornos osteoarticulares">Trastornos osteoarticulares</option>
                    <option value="Paladar exigente">Paladar exigente</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="mmf-add-btn"
              onClick={handleAddPet}
              disabled={pets.length >= maxPets}
            >
              + Agregar Mascota
            </button>

            <button type="submit" className="mmf-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>

            {statusMessage && <div className="mmf-status">{statusMessage}</div>}
          </form>

          <div className="mmf-legal">
            <p>*Cupón válido exclusivamente web en compras mayores a $3500.</p>
            <p>No acumulable con otras promociones.</p>
            <p>¡Gracias por tu tiempo! Te esperamos en nuestras sucursales.</p>
          </div>
        </div>

        <img src={footerImg} alt="Mundo Mascota" className="mmf-footer" />
      </div>
    </div>
  );
}

export default MundoMascotaForm;
