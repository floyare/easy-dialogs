import React from 'react';
import { defineDialogs, useDialogManager } from '../src/useDialogManager';
import { describe, it, expectTypeOf, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

// * Defining dialogs
type ConfirmDialogType = {
    onClose: (v: boolean) => void;
    additionalProps: {
        id: string
    }
}

const ConfirmDialog: React.FC<ConfirmDialogType> = ({ onClose }) => null;

const dialogsList = defineDialogs([
    { id: "confirm-dialog", component: ConfirmDialog }
] as const)

// * Test dialogs
describe('Type safety', () => {
    it('should know what dialogs are defined in the list', async () => {
        const { result } = renderHook(() => useDialogManager(dialogsList))
        expectTypeOf(result.current.callDialog("confirm-dialog")).resolves.toBeBoolean()

        // @ts-expect-error
        await expect(result.current.callDialog("fake-dialog")).rejects.toThrow('Dialog with id "fake-dialog" not found in definitions')
    })

    it('should know what additionalProps are defined in dialog', async () => {
        const { result } = renderHook(() => useDialogManager(dialogsList))

        type ConfirmDialogDefinition =
            Extract<typeof dialogsList[number], { id: "confirm-dialog" }>

        type ConfirmDialogProps =
            React.ComponentProps<ConfirmDialogDefinition["component"]>

        expectTypeOf<ConfirmDialogProps["additionalProps"]>().toEqualTypeOf<{ id: string }>()

        //@ts-expect-error
        result.current.callDialog("confirm-dialog", { id: 999 })
    })
})