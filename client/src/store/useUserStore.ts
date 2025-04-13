import type { RpcProvider } from "starknet";
import { create } from "zustand";

interface useUserStoreType {
	address: string;
	setAddress: (address: string) => void;
	provider: RpcProvider | null;
	setProvider: (provider: RpcProvider | null) => void;
	lastWallet: string;
	setLastWallet: (lastWallet: string) => void;
}

export const useUserStore = create<useUserStoreType>((set) => ({
	address: "",
	setAddress: (address) => set({ address }),
	provider: null,
	setProvider: (provider) => set({ provider }),
	lastWallet: "",
	setLastWallet: (lastWallet) => set({ lastWallet }),
}));
