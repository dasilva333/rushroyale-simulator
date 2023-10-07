import { useState } from 'react';

function useModalSequence() {
    const [activeModal, setActiveModal] = useState(null);

    const showSelectionModal = () => setActiveModal('selection');
    const showConfigurationModal = () => setActiveModal('configuration');
    const closeModal = () => setActiveModal(null);

    return {
        activeModal,
        showSelectionModal,
        showConfigurationModal,
        closeModal
    };
}

export default useModalSequence;
