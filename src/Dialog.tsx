import React, { memo } from 'react';
import { activeDialogs, ActiveDialogInstance } from './atoms';
import { useAtomValue } from 'jotai';

const DialogItem = memo(({ dialogInstance }: { dialogInstance: ActiveDialogInstance }) => {
    const { component: DialogComponent, visualState, props } = dialogInstance;
    const isClosing = visualState === 'closed';

    return (
        <DialogComponent
            {...props}
            data-state={isClosing ? 'closed' : undefined}
        />
    );
});

const Dialog: React.FC = () => {
    const dialogs = useAtomValue(activeDialogs);

    if (!dialogs || dialogs.length === 0) {
        return null;
    }

    return (
        <>
            {dialogs.map((dialogInstance) => (
                <DialogItem key={dialogInstance.key} dialogInstance={dialogInstance} />
            ))}
        </>
    );
};

export default Dialog;