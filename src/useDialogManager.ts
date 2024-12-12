import { useAtom } from 'jotai';
import { activeDialog } from './atoms';

type InferDialogIdType<Dialogs> = Dialogs extends readonly { id: infer Id }[] ? Id : never;

type InferDialogType<Dialogs> = Dialogs extends readonly (infer D)[] ? D : never;

type InferDialogProps<Dialogs, TId> = Extract<
    InferDialogType<Dialogs>,
    { id: TId }
> extends { component: React.ComponentType<infer P> }
    ? P extends { additionalProps?: infer A }
    ? A extends undefined
    ? never
    : A
    : never
    : never;

export const useDialogManager = <
    Dialogs extends readonly { id: string; component: React.ComponentType<any>; props?: any }[]
>(
    Dialogs: Dialogs
) => {
    type DialogIdType = InferDialogIdType<Dialogs>;

    const [, setDialog] = useAtom(activeDialog);

    const openDialog = <T>(Dialog: InferDialogType<Dialogs>): Promise<T> => {
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

    const callDialog = async <T extends DialogIdType>(
        id: T,
        additionalProps?: InferDialogProps<Dialogs, T>
    ): Promise<boolean> => {
        const Dialog = Dialogs.find((dialog): dialog is InferDialogType<Dialogs> => dialog.id === id);
        if (!Dialog) {
            throw new Error(`Dialog with id "${id}" not found`);
        }

        return openDialog({
            ...Dialog,
            props: {
                ...(Dialog.props || {}),
                additionalProps: additionalProps
                    ? { ...additionalProps as Record<string, any> }
                    : undefined,
            },
        });
    };

    return { callDialog, closeDialog };
};
