"use client";

import {
	type Connector,
	InjectedConnector,
	useAccount,
	useConnect,
	useDisconnect,
	useSwitchChain,
} from "@starknet-react/core";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { constants, num } from "starknet";
import {
	type ConnectOptionsWithConnectors,
	type StarknetkitConnector,
	connect,
	disconnect,
} from "starknetkit";
import {
	ArgentMobileConnector,
	isInArgentMobileAppBrowser,
} from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";

import { NETWORK, getProvider } from "~/constants";
import { useIsMobile } from "~/hooks/useIsMobile";
import { cn, copyAddressToClipboard, shortAddress } from "~/lib/utils";
import { type TokenPayload, auth } from "~/server/utils";
import { useUserStore } from "~/store/useUserStore";

import NickInput from "./NickInput";
import { Button, buttonVariants } from "./ui/button";

export const getConnectors = (isMobile: boolean) => {
	const mobileConnector = ArgentMobileConnector.init({
		options: {
			dappName: "Bankai",
			url: window.location.hostname,
			chainId: constants.NetworkName.SN_MAIN,
		},
		inAppBrowserOptions: {},
	}) as StarknetkitConnector;

	const argentXConnector = new InjectedConnector({
		options: {
			id: "argentX",
			name: "Argent X",
		},
	});

	const braavosConnector = new InjectedConnector({
		options: {
			id: "braavos",
			name: "Braavos",
		},
	});

	const webWalletConnector = new WebWalletConnector({
		url: "https://web.argent.xyz",
	}) as StarknetkitConnector;

	const isMainnet = NETWORK === constants.NetworkName.SN_MAIN;

	if (!isMainnet) return [argentXConnector, braavosConnector];
	if (isInArgentMobileAppBrowser()) return [mobileConnector];

	return isMobile
		? [mobileConnector, braavosConnector, webWalletConnector]
		: [argentXConnector, braavosConnector, mobileConnector, webWalletConnector];
};

const Navbar = ({ nickname }: { nickname?: string | null }) => {
	const [isNickOpen, setIsNickOpen] = useState(true);
	const [authData, setAuthData] = React.useState<TokenPayload | null>(null);

	const { address, connector, chainId } = useAccount();
	const { connect: connectSnReact } = useConnect();
	const { disconnectAsync } = useDisconnect();

	const { setAddress, setProvider, setLastWallet } = useUserStore();
	const isMobile = useIsMobile();

	const pathname = usePathname();

	const requiredChainId = React.useMemo(
		() =>
			NETWORK === constants.NetworkName.SN_MAIN
				? constants.StarknetChainId.SN_MAIN
				: constants.StarknetChainId.SN_SEPOLIA,
		[],
	);

	const connectorConfig = React.useMemo<ConnectOptionsWithConnectors>(
		() => ({
			modalMode: "canAsk",
			modalTheme: "light",
			webWalletUrl: "https://web.argent.xyz",
			argentMobileOptions: {
				dappName: "Bankai",
				chainId: NETWORK,
				url: window.location.hostname,
			},
			dappName: "Bankai",
			connectors: getConnectors(isMobile) as StarknetkitConnector[],
		}),
		[isMobile],
	);

	const { switchChain, error } = useSwitchChain({
		params: { chainId: requiredChainId },
	});

	const connectWallet = React.useCallback(
		async (config = connectorConfig) => {
			try {
				const { connector } = await connect(config);
				if (connector) {
					connectSnReact({ connector: connector as unknown as Connector });
				}
			} catch (error) {
				console.error("connectWallet error", error);
			}
		},
		[connectSnReact, connectorConfig],
	);

	const handleDisconnect = React.useCallback(() => {
		disconnect();
		disconnectAsync();
	}, [disconnectAsync]);

	// use effects
	React.useEffect(() => {
		if (
			chainId &&
			chainId.toString() !== num.getDecimalString(requiredChainId)
		) {
			switchChain();
		}
	}, [chainId, requiredChainId, switchChain]);

	React.useEffect(() => {
		if (error) console.error("switchChain error", error);
	}, [error]);

	React.useEffect(() => {
		connectWallet({
			...connectorConfig,
			modalMode: "neverAsk",
		});
	}, [connectWallet, connectorConfig]);

	React.useEffect(() => {
		if (connector) setLastWallet(connector.name);
	}, [connector, setLastWallet]);

	React.useEffect(() => {
		if (address) {
			setAddress(address);
			setProvider(getProvider());
		}
	}, [address, setAddress, setProvider]);

	const NAV_LINKS = [
		{ href: "/", text: "Home", isActive: pathname === "/" },
		{
			href: "/providers",
			text: "Providers",

			isActive: pathname.includes("/provider"),
		},
		{
			href: "/leaderboard",
			text: "Leaderboard",
			isActive: pathname.includes("/leaderboard"),
		},
		{
			href: "/buyer",
			text: "Buyer",
			isActive: pathname.includes("/buyer"),
		},
		{
			href: "/analytics",
			text: "Analytics",
			isActive: pathname.includes("/analytics"),
		},
	];

	return (
		<nav className="fixed top-0 left-0 z-20 mx-auto flex h-[70px] w-full items-center border-b-4 border-border bg-secondary-background px-5">
			<div className="mx-auto flex w-[1300px] max-w-full items-center justify-between text-foreground">
				<div className="flex w-full items-center justify-between gap-10 xl:gap-10">
					<Link
						className="flex size-8 items-center justify-center rounded-base border-2 border-black bg-main font-heading text-[22px] text-main-foreground"
						href="/"
						aria-label="Home"
					>
						B
					</Link>

					<div className="flex items-center font-base text-base gap-10">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(link.isActive && "text-main")}
							>
								{link.text}
							</Link>
						))}
					</div>

					{!address ? (
						<Button
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									connectWallet();
								}
							}}
							onClick={() => connectWallet()}
							type="button"
							variant="noShadow"
							className="w-[11rem]"
						>
							Connect Wallet
						</Button>
					) : (
						<div
							className={cn(
								buttonVariants(),
								"flex w-[11rem] items-center justify-center gap-2 !shadow-none hover:!translate-x-0 hover:!translate-y-0",
							)}
						>
							<button
								onClick={() => copyAddressToClipboard(address)}
								className="offset_ring flex h-9 items-center justify-center gap-2 rounded-md"
								type="button"
								aria-label="Copy address"
							>
								<span className="size-5 rounded-full bg-gradient-to-b from-[#6767e6] to-[#02bbf3]" />
								<span className="flex items-center gap-1 text-sm">
									{shortAddress(address, 4, 4)}
								</span>
							</button>

							<button
								className="offset_ring rounded-full"
								onClick={handleDisconnect}
								type="button"
								aria-label="Disconnect wallet"
							>
								<X className="size-4 text-black/70" />
							</button>
						</div>
					)}
				</div>

				{address && !nickname && (
					<NickInput
						isNickOpen={isNickOpen}
						onClose={() => setIsNickOpen(false)}
						address={address}
					/>
				)}
			</div>
		</nav>
	);
};

export default React.memo(Navbar);
