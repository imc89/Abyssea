// Importa las dependencias necesarias de React.
import React from 'react';
// Importa los datos de las criaturas.
import { creatureData } from '../../game/creatures';

// Componente para mostrar el modal de la galería.
const GalleryModal = ({ discoveredCreatures, onShowCreatureModal, onClose }) => {
    // Renderiza el componente.
    return (
        <div id="galleryModal" className="modal-overlay show">
            <div className="gallery-content">
                <button id="closeGalleryBtn" className="close-button" onClick={onClose}>&times;</button>
                <h2>Galería de Criaturas Marinas</h2>
                <div id="galleryGrid" className="gallery-grid">
                    {creatureData.map(creature => (
                        <div
                            key={creature.id}
                            className={`gallery-item ${discoveredCreatures[creature.id] ? 'discovered' : ''}`}
                            onClick={() => {
                                if (discoveredCreatures[creature.id]) {
                                    onShowCreatureModal(creature);
                                }
                            }}
                        >
                            <img src={creature.imageSrc} alt={creature.name} />
                            <h3>{creature.name}</h3>
                            <p className="status">
                                {discoveredCreatures[creature.id] ? 'Descubierto' : '???'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default GalleryModal;
