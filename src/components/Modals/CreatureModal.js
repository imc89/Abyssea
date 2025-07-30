import React from 'react';

const CreatureModal = ({ creature, onClose }) => {
    if (!creature) {
        return null;
    }

    return (
        <div id="creatureModal" className="modal-overlay show">
            <div className="modal-content">
                <div className="modal-body">
                    <div className="modal-text-content">
                        <h2 id="modalCreatureName">{creature.name}</h2>
                        <p id="modalCreatureDescription">{creature.description}</p>
                        <h3 id="modalCreatureFunFactTitle">Dato Curioso:</h3>
                        <p id="modalCreatureFunFact">{creature.funFact}</p>
                    </div>
                    <div className="modal-image-container">
                        <img id="modalCreatureImage" src={creature.imageSrc} alt={`Imagen de ${creature.name}`} />
                        <button id="closeModalBtn" className="close-button" onClick={onClose}>&times;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatureModal;
