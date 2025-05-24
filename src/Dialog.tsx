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
                const { key, component: DialogComponent, visualState, props } = dialogInstance;
                const isClosing = visualState === 'closed';

                return (
                    <DialogComponent
                        key={key}
                        {...props}
                        {...{ ["data-state"]: isClosing ? 'closed' : undefined }}
                    />
                );
            })}
        </>
    );
};

export default Dialog;