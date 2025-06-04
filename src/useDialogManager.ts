import { useSetAtom } from 'jotai';
import { activeDialogs, getNextDialogKeyAtom, ActiveDialogInstance, getActiveDialogs } from './atoms';
import React from 'react';

type DialogElementType = { id: string; component: React.ComponentType<any>; props?: any, useExitAnimation?: boolean }

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
    Dialogs extends readonly DialogElementType[]
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
                const useExitAnimation = getActiveDialogs().find(d => d.key === key)?.useExitAnimation ?? false;
                setDialogs(ds =>
                    ds.map(d =>
                        d.key === key
                            ? {
                                ...d,
                                visualState: "closed",
                                props: { ...d.props }
                            }
                            : d
                    )
                );

                if (!useExitAnimation) {
                    setDialogs((prevDialogs) =>
                        prevDialogs.filter((dialog) => dialog.key !== key)
                    );
                }

                resolve(result as T);
            };

            const handleAnimationEnd = () => {
                setDialogs((prevDialogs) =>
                    prevDialogs.filter((dialog) =>
                        dialog.key !== key ||
                        dialog.visualState !== "closed"
                    )
                );
            }

            const { dialogKeyId, ...restProps } = props || {};
            const newDialogInstance: ActiveDialogInstance = {
                key,
                component,
                visualState: "open",
                useExitAnimation: props?.useExitAnimation ?? false,
                dialogKeyId: props.dialogKeyId,
                props: {
                    ...restProps,
                    onClose: handleClose,
                    onAnimationEnd: handleAnimationEnd,
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
            useExitAnimation: dialogDefinition.useExitAnimation,
            additionalProps: additionalProps || {},
            dialogKeyId: id
        };

        return openDialog<any>(component, finalProps);
    };

    return { callDialog, closeAllDialogs };
};