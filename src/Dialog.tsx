import React from 'react';
import { activeDialogs } from './atoms';
import { useAtom } from 'jotai';

const Dialog: React.FC = () => {
    const [dialogs] = useAtom(activeDialogs);

    if (!dialogs || dialogs.length === 0) {
        return null;
    }

    return (
        <>
            {dialogs.map((dialogInstance) => {
                const { key, component: DialogComponent, props } = dialogInstance;
                return <DialogComponent key={key} {...props} />;
            })}
        </>
    );
};

export default Dialog;