// Importa la dependencia necesaria de React.
import React, { useEffect } from 'react';

// Componente para mostrar el modal de una criatura.
const CreatureModal = ({ creature, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Si no hay ninguna criatura seleccionada, no renderiza nada.
    if (!creature) {
        return null;
    }

    // Renderiza el componente.
    return (
        <div id="creatureModal" className="modal-overlay show">
            <div className="modal-content">
                                <button id="closeModalBtn" className="close-button" onClick={onClose}>&times;</button>

                <div className="modal-body">
                    <div className="modal-text-content">
                        <h2 id="modalCreatureName">{creature.name}</h2>
                        <p id="modalCreatureDescription">{creature.description}</p>
                        <h3 id="modalCreatureFunFactTitle">Dato Curioso:</h3>
                        <p id="modalCreatureFunFact">{creature.funFact}</p>
                    </div>
                    <div className="modal-image-container">
                        <img id="modalCreatureImage" src={creature.imageSrc} alt={`Imagen de ${creature.name}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default CreatureModal;
