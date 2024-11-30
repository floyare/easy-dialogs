import { useAtom } from 'jotai';
import { activeDialog } from './atoms';
import { DialogType } from './types/DialogTypes';

export const useDialogManager = (Dialogs: DialogType[]) => {
    const [, setDialog] = useAtom(activeDialog);

    const openDialog = <T>(Dialog: DialogType): Promise<T> => {
        return new Promise((resolve) => {
            setDialog({
                ...Dialog,
                props: {
                    ...Dialog.props,
                    onClose: (result: T) => {
                        setDialog(null);
                        resolve(result);
                    },
                },
            });
        });
    };

    const closeDialog = () => {
        setDialog(null);
    };

    const callDialog = (id: string, additionalProps?: Record<string, any>) => {
        const Dialog = Dialogs.find((m) => m.id === id);
        if (!Dialog) {
            throw new Error(`Dialog with id "${id}" not found`);
        }

        return openDialog({
            ...Dialog,
            props: { ...Dialog.props, ...additionalProps },
        });
    };

    return { callDialog, closeDialog };
};

