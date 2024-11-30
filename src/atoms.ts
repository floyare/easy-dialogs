import { atom } from "jotai";
import { ModalType } from "./types/ModalTypes";

export const activeModal = atom<ModalType | null>(null)