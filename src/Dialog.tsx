import type React from 'react';
import { activeDialog } from './atoms';
import { useAtom } from 'jotai';

const Dialog: React.FC = () => {
    const [modal] = useAtom(activeDialog);
    if (!modal) return null;

    const { component: DialogComponent, props } = modal;
    return <DialogComponent {...props} />;
};

export default Dialog;