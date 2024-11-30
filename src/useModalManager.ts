import { useAtom } from 'jotai';
import { activeModal } from './atoms';
import { ModalType } from './types/ModalTypes';

export const useModalManager = (modals: ModalType[]) => {
    const [, setModal] = useAtom(activeModal);

    const openModal = <T>(modal: ModalType): Promise<T> => {
        return new Promise((resolve) => {
            setModal({
                ...modal,
                props: {
                    ...modal.props,
                    onClose: (result: T) => {
                        setModal(null);
                        resolve(result);
                    },
                },
            });
        });
    };

    const closeModal = () => {
        setModal(null);
    };

    const callModal = (id: string, additionalProps?: Record<string, any>) => {
        const modal = modals.find((m) => m.id === id);
        if (!modal) {
            throw new Error(`Modal with id "${id}" not found`);
        }

        return openModal({
            ...modal,
            props: { ...modal.props, ...additionalProps },
        });
    };

    return { callModal, closeModal };
};

