import React from 'react';
import { activeDialog } from './atoms';
import { useAtom } from 'jotai';

export const Dialog: React.FC = () => {
    const [modal] = useAtom(activeDialog);

    if (!modal) return null;

    const { component: DialogComponent, props } = modal;

    return <DialogComponent {...props} />;
};
