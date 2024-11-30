import { atom } from "jotai";
import { DialogType } from "./types/DialogTypes";

export const activeDialog = atom<DialogType | null>(null)