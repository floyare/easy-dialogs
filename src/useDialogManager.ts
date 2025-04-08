import { useSetAtom } from 'jotai';
import { activeDialogs, getNextDialogKeyAtom, ActiveDialogInstance } from './atoms';
import React from 'react';

type InferDialogIdType<Dialogs> = Dialogs extends readonly { id: infer Id }[] ? Id : never;
type InferDialogType<Dialogs> = Dialogs extends readonly (infer D)[] ? D : never;

type InferDialogProps<Dialogs, TId> = Extract<
    InferDialogType<Dialogs>,
    { id: TId }
> extends { component: React.ComponentType<infer P> }
    ? P extends { additionalProps?: infer A }
    ? A extends undefined
    ? Record<string, never>
    : A
    : Record<string, never>
    : never;

type InferDialogOnCloseReturnType<Dialogs, TId> = Extract<
    InferDialogType<Dialogs>,
    { id: TId }
> extends { component: React.ComponentType<infer P> }
    ? P extends { onClose?: (result: infer R) => void }
    ? R
    : void
    : void;

export const useDialogManager = <
    Dialogs extends readonly { id: string; component: React.ComponentType<any>; props?: any }[]
>(
    dialogDefinitions: Dialogs
) => {
    type DialogIdType = InferDialogIdType<Dialogs>;

    const setDialogs = useSetAtom(activeDialogs);
    const getNextKey = useSetAtom(getNextDialogKeyAtom);

    const openDialog = <T>(
        component: React.ComponentType<any>,
        props: any
    ): Promise<T> => {
        return new Promise((resolve) => {
            const key = getNextKey();

            const handleClose = (result: T) => {
                setDialogs((prevDialogs) =>
                    prevDialogs.filter((dialog) => dialog.key !== key)
                );
                resolve(result);
            };

            const newDialogInstance: ActiveDialogInstance = {
                key,
                component,
                props: {
                    ...props,
                    onClose: handleClose,
                    isOpen: true,
                },
            };

            setDialogs((prevDialogs) => [...prevDialogs, newDialogInstance]);
        });
    };

    const closeAllDialogs = () => {
        setDialogs([]);
    };

    const callDialog = async <T extends DialogIdType>(
        id: T,
        additionalProps?: InferDialogProps<Dialogs, T>
    ): Promise<InferDialogOnCloseReturnType<Dialogs, T>> => {
        const dialogDefinition = dialogDefinitions.find(
            (dialog): dialog is InferDialogType<Dialogs> => dialog.id === id
        );

        if (!dialogDefinition) {
            throw new Error(`Dialog with id "${id}" not found in definitions`);
        }

        const { component, props: definitionProps } = dialogDefinition;

        const finalProps = {
            ...(definitionProps || {}),
            additionalProps: additionalProps || {},
        };

        return openDialog<any>(component, finalProps);
    };

    return { callDialog, closeAllDialogs };
};