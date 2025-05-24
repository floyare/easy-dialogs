import { atom } from "jotai";
import { getDefaultStore } from "jotai";

export type ActiveDialogInstance = {
    key: number,
    component: React.ComponentType<any>,
    props: any,
    visualState?: "open" | "closed",
    useExitAnimation?: boolean
}

const nextDialogKeyAtom = atom<number>(0);

export const getNextDialogKeyAtom = atom(
    (get) => get(nextDialogKeyAtom),
    (get, set) => {
        const nextKey = get(nextDialogKeyAtom);
        set(nextDialogKeyAtom, nextKey + 1);
        return nextKey;
    }
);

export const activeDialogs = atom<ActiveDialogInstance[]>([]);

export const getActiveDialogs = () => getDefaultStore().get(activeDialogs);