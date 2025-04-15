import { constants, RpcProvider } from "starknet";

export const CONNECTOR_NAMES = [
	"Braavos",
	"Argent X",
	"Argent (mobile)",
] as const;

export const STRK_DECIMALS = 18;
export const STRK_TOKEN_SEPOLIA =
	"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" as const;

export const ARGENT_MOBILE_BASE64_ICON =
	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE4LjQwMTggNy41NTU1NkgxMy41OTgyQzEzLjQzNzcgNy41NTU1NiAxMy4zMDkxIDcuNjg3NDcgMTMuMzA1NiA3Ljg1MTQzQzEzLjIwODUgMTIuNDYwMyAxMC44NDg0IDE2LjgzNDcgNi43ODYwOCAxOS45MzMxQzYuNjU3MTEgMjAuMDMxNCA2LjYyNzczIDIwLjIxNjIgNi43MjIwMiAyMC4zNDkzTDkuNTMyNTMgMjQuMzE5NkM5LjYyODE1IDI0LjQ1NDggOS44MTQ0NCAyNC40ODUzIDkuOTQ1NTggMjQuMzg2QzEyLjQ4NTYgMjIuNDYxMyAxNC41Mjg3IDIwLjEzOTUgMTYgMTcuNTY2QzE3LjQ3MTMgMjAuMTM5NSAxOS41MTQ1IDIyLjQ2MTMgMjIuMDU0NSAyNC4zODZDMjIuMTg1NiAyNC40ODUzIDIyLjM3MTkgMjQuNDU0OCAyMi40Njc2IDI0LjMxOTZMMjUuMjc4MSAyMC4zNDkzQzI1LjM3MjMgMjAuMjE2MiAyNS4zNDI5IDIwLjAzMTQgMjUuMjE0IDE5LjkzMzFDMjEuMTUxNiAxNi44MzQ3IDE4Ljc5MTUgMTIuNDYwMyAxOC42OTQ2IDcuODUxNDNDMTguNjkxMSA3LjY4NzQ3IDE4LjU2MjMgNy41NTU1NiAxOC40MDE4IDcuNTU1NTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuNzIzNiAxMC40OTJMMjQuMjIzMSA4LjkyNDM5QzI0LjEyMTMgOC42MDYxNCAyMy44NzM0IDguMzU4MjQgMjMuNTU3NyA4LjI2MDIzTDIyLjAwMzkgNy43NzU5NUMyMS43ODk1IDcuNzA5MDYgMjEuNzg3MyA3LjQwMTc3IDIyLjAwMTEgNy4zMzIwMUwyMy41NDY5IDYuODI0NjZDMjMuODYwOSA2LjcyMTQ2IDI0LjEwNiA2LjQ2OTUyIDI0LjIwMjcgNi4xNTAxMUwyNC42Nzk4IDQuNTc1MDJDMjQuNzQ1OCA0LjM1NzA5IDI1LjA0ODkgNC4zNTQ3NyAyNS4xMTgzIDQuNTcxNTZMMjUuNjE4OCA2LjEzOTE1QzI1LjcyMDYgNi40NTc0IDI1Ljk2ODYgNi43MDUzMSAyNi4yODQyIDYuODAzOUwyNy44MzggNy4yODc2MUMyOC4wNTI0IDcuMzU0NSAyOC4wNTQ3IDcuNjYxNzkgMjcuODQwOCA3LjczMjEzTDI2LjI5NSA4LjIzOTQ4QzI1Ljk4MTEgOC4zNDIxIDI1LjczNiA4LjU5NDA0IDI1LjYzOTMgOC45MTQwMkwyNS4xNjIxIDEwLjQ4ODVDMjUuMDk2MSAxMC43MDY1IDI0Ljc5MyAxMC43MDg4IDI0LjcyMzYgMTAuNDkyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";

export const NETWORK =
	process.env.NEXT_PUBLIC_CHAIN_ID === "SN_SEPOLIA"
		? constants.NetworkName.SN_SEPOLIA
		: constants.NetworkName.SN_MAIN;

export const isMainnet = () => {
	return NETWORK === constants.NetworkName.SN_MAIN;
};

export function getProvider() {
	return new RpcProvider({
		nodeUrl:
			process.env.NEXT_PUBLIC_RPC_URL ||
			"https://starknet-sepolia.public.blastapi.io",
		blockIdentifier: "pending",
	});
}

export function getExplorerEndpoint() {
	if (isMainnet()) {
		return "https://starkscan.co";
	}

	return "https://sepolia.starkscan.co";
}

export const PROVIDERS_INFO = {
	"linkedin-connections": {
		title: "LinkedIn Connections",
		icon: "/icons/linkedin.svg",
		categoryId: "3551e533-f12a-4580-828a-3bfabd964e20",
		description:
			"Connect your professional network data to earn rewards. Share your connection history, engagement metrics, and professional interactions while maintaining privacy.",
	},
	"nykaa-orders": {
		title: "Nykka Orders",
		icon: "/icons/nykka.svg",
		categoryId: "43a0b71f-bd25-4f10-bbad-9541961df72e",
		description:
			"Monetize your beauty and personal care shopping patterns. Share your purchase history, product preferences, and shopping behavior from India's leading beauty retailer.",
	},
	"zomato-orders": {
		title: "Zomato Orders",
		icon: "/icons/zomato.svg",
		categoryId: "61fea293-73bc-495c-9354-c2f61294fc30",
		description:
			"Turn your food ordering habits into income. Share your restaurant preferences, ordering frequency, and culinary tastes from your Zomato history.",
	},
	"uber-past-trips": {
		title: "Uber Past Trips",
		icon: "/icons/uber.png",
		categoryId: "3ec71eb9-fd68-48b1-8e1e-c0ff54acbb9d",
		description:
			"Profit from your travel data. Share your ride history, frequent destinations, and travel patterns while keeping personal details secure.",
	},
} as const;

export type TProvider = keyof typeof PROVIDERS_INFO;
export type TProviderInfo = {
	[K in TProvider]: {
		title: string;
		icon: string;
		categoryId: string;
		description: string;
	};
};
export type TProviderInfoKeys = keyof TProviderInfo;
export type TProviderInfoValues = TProviderInfo[TProviderInfoKeys];
