"use client";

import { useSendTransaction } from "@starknet-react/core";
import type { NextPage } from "next";
import React from "react";

import { Contract, uint256 } from "starknet";
import abi from "~/abi/dao.abi.json";
import DownloadData from "~/components/download";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { getProvider, type TProviderInfoKeys } from "~/constants";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const BuyersPage: NextPage = () => {
	const [budgetAmount, setBudgetAmount] = React.useState("");
	const [provider, setProvider] =
		React.useState<TProviderInfoKeys>("zomato-orders");

	const { sendAsync, data, isPending, error } = useSendTransaction({});

	const handleSubmit = async () => {
		if (!budgetAmount) {
			alert("Please enter a budget amount");
			return;
		}

		// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
		if (isNaN(Number(budgetAmount))) {
			alert("Please enter a valid number");
			return;
		}

		if (Number(budgetAmount) <= 0) {
			alert("Please enter a budget amount greater than 0");
			return;
		}

		const rpcProvider = getProvider();

		if (!rpcProvider) {
			alert("Please connect your wallet");
			return;
		}

		const contract = new Contract(
			abi,
			"0x033c5fc7316f76f032047c175c0e61f58f59ca60933b9319577008cd937aa75e",
			rpcProvider,
		);

		const companyIdx =
			provider === "zomato-orders"
				? 1
				: provider === "nykaa-orders"
					? 2
					: provider === "linkedin-connections"
						? 3
						: 4;

		const call = contract.populate("create_data_req", [
			uint256.bnToUint256(budgetAmount.toString()),
			companyIdx,
		]);

		await sendAsync([call]);
	};

	const { data: providerData } = api.auth.providerInfoBySlug.useQuery(
		{
			analyticSlug: provider,
		},
		{
			enabled: !!data?.transaction_hash,
		},
	);

	const renderDownloadButton = () => {
		if (data?.transaction_hash) {
			return (
				<DownloadData
					data={providerData}
					fileName={provider.replace(/-/g, "_")}
				/>
			);
		}
	};

	return (
		<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
			<div className="max-w-6xl mx-auto w-full flex items-center justify-center flex-col gap-6">
				<div className="flex items-center justify-center w-full gap-5 py-4">
					<Input
						placeholder="Enter your budget"
						value={budgetAmount}
						onChange={(val) => setBudgetAmount(val.target.value)}
						className="max-w-sm"
					/>

					<Select
						defaultValue="csv"
						value={provider}
						onValueChange={(val) => setProvider(val as TProviderInfoKeys)}
					>
						<SelectTrigger
							className={cn(buttonVariants({ variant: "noShadow" }), "w-fit")}
						>
							<SelectValue />
						</SelectTrigger>

						<SelectContent className="bg-white">
							<SelectGroup>
								<SelectItem value="zomato-orders">Zomato</SelectItem>
								<SelectItem value="nykaa-orders">Nykaa</SelectItem>
								<SelectItem value="linkedin-connections">LinkedIn</SelectItem>
								<SelectItem value="uber-past-trips">Uber</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<Button className="" onClick={handleSubmit}>
					Get data
				</Button>

				{renderDownloadButton()}
			</div>
		</main>
	);
};

export default BuyersPage;
