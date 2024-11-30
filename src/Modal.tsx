import React from 'react';
import { activeModal } from './atoms';
import { useAtom } from 'jotai';

export const Modal: React.FC = () => {
    const [modal] = useAtom(activeModal);

    if (!modal) return null;

    const { component: ModalComponent, props } = modal;

    return <ModalComponent {...props} />;
};
