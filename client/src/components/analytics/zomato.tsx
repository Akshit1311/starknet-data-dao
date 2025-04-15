"use client";

import { useAccount } from "@starknet-react/core";
import type React from "react";

import { api } from "~/trpc/react";

import type { AnalyticsProps } from ".";

const ZomatoAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
	const { address } = useAccount();

	const { data } = api.auth.providerInfo.useQuery(
		{
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			address: address!,
			analyticSlug,
		},
		{
			enabled: !!address,
		},
	);

	if (!address) {
		return <div>Connect your wallet</div>;
	}

	console.log(data, "data---");

	return (
		<div>
			<h1>{JSON.stringify(data)}</h1>
		</div>
	);
};

export default ZomatoAnalytics;
