"use client";

import { useAccount } from "@starknet-react/core";
import { Loader } from "lucide-react";
import type React from "react";

import DownloadData from "~/components/download";
import { buttonVariants } from "~/components/ui/button";
import { cn, formatNumberWithCommas } from "~/lib/utils";
import { api } from "~/trpc/react";

import type { AnalyticsProps } from "..";
import Chart from "./chart";

export type NykaaChartData = {
	month: string;
	spending: number;
	items: number;
};

const nykaaSampleData = [
	{
		id: 1,
		brandIds: "45,67,89",
		brandNames: ["Maybelline", "L'Oreal", "Lakme"],
		categoryId: "makeup",
		createdAt: "2025-01-15T10:25:30+05:30",
		imageUrl: "https://images.nykaa.com/product/8904245701000.jpg",
		itemName: "Maybelline New York Fit Me Matte+Poreless Liquid Foundation",
		itemQuantity: 2,
		itemSku: "NYKAABEAUTY1001",
		itemStatus: "Delivered",
		orderNo: "NKO10045678",
		parentId: "NKP10000123",
		productId: "PRD1001",
		productUrl: "https://www.nykaa.com/maybelline-foundation",
		unitPrice: 599,
		updatedAt: "2025-01-15T10:25:30+05:30",
		userId: 2,
	},
	{
		id: 2,
		brandIds: "45,77",
		brandNames: ["Maybelline", "Sugar"],
		categoryId: "makeup",
		createdAt: "2025-01-22T14:12:45+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323701234.jpg",
		itemName: "Sugar Cosmetics Matte Attack Liquid Lipstick",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1002",
		itemStatus: "Delivered",
		orderNo: "NKO10045679",
		parentId: "NKP10000124",
		productId: "PRD1002",
		productUrl: "https://www.nykaa.com/sugar-lipstick",
		unitPrice: 499,
		updatedAt: "2025-01-22T14:12:45+05:30",
		userId: 2,
	},
	{
		id: 3,
		brandIds: "91",
		brandNames: ["The Face Shop"],
		categoryId: "skincare",
		createdAt: "2025-02-05T09:33:20+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323709876.jpg",
		itemName: "The Face Shop Rice Water Bright Cleansing Foam",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1003",
		itemStatus: "Delivered",
		orderNo: "NKO10045680",
		parentId: "NKP10000125",
		productId: "PRD1003",
		productUrl: "https://www.nykaa.com/faceshop-cleanser",
		unitPrice: 349,
		updatedAt: "2025-02-05T09:33:20+05:30",
		userId: 2,
	},
	{
		id: 4,
		brandIds: "105",
		brandNames: ["Neutrogena"],
		categoryId: "skincare",
		createdAt: "2025-02-05T09:34:15+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323708765.jpg",
		itemName: "Neutrogena Hydro Boost Water Gel",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1004",
		itemStatus: "Delivered",
		orderNo: "NKO10045680",
		parentId: "NKP10000125",
		productId: "PRD1004",
		productUrl: "https://www.nykaa.com/neutrogena-gel",
		unitPrice: 850,
		updatedAt: "2025-02-05T09:34:15+05:30",
		userId: 2,
	},
	{
		id: 5,
		brandIds: "77",
		brandNames: ["Sugar"],
		categoryId: "makeup",
		createdAt: "2025-02-18T16:50:10+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323707654.jpg",
		itemName: "Sugar Cosmetics Kohl Of Honour Intense Kajal",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1005",
		itemStatus: "Delivered",
		orderNo: "NKO10045681",
		parentId: "NKP10000126",
		productId: "PRD1005",
		productUrl: "https://www.nykaa.com/sugar-kajal",
		unitPrice: 249,
		updatedAt: "2025-02-18T16:50:10+05:30",
		userId: 2,
	},
	{
		id: 6,
		brandIds: "67",
		brandNames: ["L'Oreal"],
		categoryId: "haircare",
		createdAt: "2025-03-02T12:15:30+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323706543.jpg",
		itemName: "L'Oreal Paris Extraordinary Oil Serum",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1006",
		itemStatus: "Shipped",
		orderNo: "NKO10045682",
		parentId: "NKP10000127",
		productId: "PRD1006",
		productUrl: "https://www.nykaa.com/loreal-serum",
		unitPrice: 449,
		updatedAt: "2025-03-02T12:15:30+05:30",
		userId: 2,
	},
	{
		id: 7,
		brandIds: "45",
		brandNames: ["Maybelline"],
		categoryId: "makeup",
		createdAt: "2025-03-12T18:22:05+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323705432.jpg",
		itemName: "Maybelline New York Colossal Mascara",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1007",
		itemStatus: "Delivered",
		orderNo: "NKO10045683",
		parentId: "NKP10000128",
		productId: "PRD1007",
		productUrl: "https://www.nykaa.com/maybelline-mascara",
		unitPrice: 399,
		updatedAt: "2025-03-12T18:22:05+05:30",
		userId: 2,
	},
	{
		id: 8,
		brandIds: "120",
		brandNames: ["Cetaphil"],
		categoryId: "skincare",
		createdAt: "2025-03-20T10:05:45+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323704321.jpg",
		itemName: "Cetaphil Gentle Skin Cleanser",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1008",
		itemStatus: "Delivered",
		orderNo: "NKO10045684",
		parentId: "NKP10000129",
		productId: "PRD1008",
		productUrl: "https://www.nykaa.com/cetaphil-cleanser",
		unitPrice: 699,
		updatedAt: "2025-03-20T10:05:45+05:30",
		userId: 2,
	},
	{
		id: 9,
		brandIds: "89",
		brandNames: ["Lakme"],
		categoryId: "makeup",
		createdAt: "2025-03-28T15:40:25+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323703210.jpg",
		itemName: "Lakme 9 to 5 Primer + Matte Perfect Cover Foundation",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1009",
		itemStatus: "Delivered",
		orderNo: "NKO10045685",
		parentId: "NKP10000130",
		productId: "PRD1009",
		productUrl: "https://www.nykaa.com/lakme-foundation",
		unitPrice: 475,
		updatedAt: "2025-03-28T15:40:25+05:30",
		userId: 2,
	},
	{
		id: 10,
		brandIds: "45",
		brandNames: ["Maybelline"],
		categoryId: "makeup",
		createdAt: "2025-04-05T11:25:15+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323702109.jpg",
		itemName: "Maybelline New York SuperStay Matte Ink Liquid Lipstick",
		itemQuantity: 2,
		itemSku: "NYKAABEAUTY1010",
		itemStatus: "Processing",
		orderNo: "NKO10045686",
		parentId: "NKP10000131",
		productId: "PRD1010",
		productUrl: "https://www.nykaa.com/maybelline-lipstick",
		unitPrice: 699,
		updatedAt: "2025-04-05T11:25:15+05:30",
		userId: 2,
	},
	{
		id: 11,
		brandIds: "130",
		brandNames: ["Huda Beauty"],
		categoryId: "makeup",
		createdAt: "2025-04-10T14:15:00+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323701098.jpg",
		itemName: "Huda Beauty Desert Dusk Eyeshadow Palette",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1011",
		itemStatus: "Processing",
		orderNo: "NKO10045687",
		parentId: "NKP10000132",
		productId: "PRD1011",
		productUrl: "https://www.nykaa.com/huda-palette",
		unitPrice: 4500,
		updatedAt: "2025-04-10T14:15:00+05:30",
		userId: 2,
	},
	{
		id: 12,
		brandIds: "45",
		brandNames: ["Maybelline"],
		categoryId: "makeup",
		createdAt: "2025-01-05T09:20:30+05:30",
		imageUrl: "https://images.nykaa.com/product/8904323700987.jpg",
		itemName: "Maybelline New York Color Sensational Creamy Matte Lipstick",
		itemQuantity: 1,
		itemSku: "NYKAABEAUTY1012",
		itemStatus: "Delivered",
		orderNo: "NKO10045670",
		parentId: "NKP10000120",
		productId: "PRD1012",
		productUrl: "https://www.nykaa.com/maybelline-creamy-lipstick",
		unitPrice: 299,
		updatedAt: "2025-01-05T09:20:30+05:30",
		userId: 2,
	},
];

const NykaaAnalytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
	const { address } = useAccount();

	const { data, isPending } = api.auth.providerInfo.useQuery(
		{
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			address: address!,
			analyticSlug,
		},
		{
			enabled: !!address,
		},
	);

	// const data = {
	// 	providerResult: nykaaSampleData,
	// };

	const totalOrders = data?.providerResult
		? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
			new Set(data.providerResult.map((order: any) => order.orderNo)).size
		: 0;

	const totalItems = data?.providerResult
		? data.providerResult.reduce(
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(acc: any, order: any) => acc + (order.itemQuantity || 0),
				0,
			)
		: 0;

	const totalSpent = data?.providerResult
		? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
			data.providerResult.reduce((acc: any, order: any) => {
				const price = order.unitPrice || 0;
				const quantity = order.itemQuantity || 0;
				return acc + price * quantity;
			}, 0)
		: 0;

	const getBrandCounts = () => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return null;
		}

		const brandCounts: Record<string, number> = {};

		// biome-ignore lint/complexity/noForEach: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.brandNames && Array.isArray(order.brandNames)) {
				// biome-ignore lint/complexity/noForEach: <explanation>
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				order.brandNames.forEach((brand: any) => {
					if (brand) {
						brandCounts[brand] =
							(brandCounts[brand] || 0) + (order.itemQuantity || 1);
					}
				});
			}
		});

		const sortedBrands = Object.entries(brandCounts).sort(
			(a, b) => b[1] - a[1],
		);
		return sortedBrands.length > 0 ? (sortedBrands[0]?.[0] ?? null) : null;
	};

	const mostPurchasedBrand = getBrandCounts();

	const getMonthlyChartData = (): NykaaChartData[] => {
		if (!data?.providerResult || data.providerResult.length === 0) {
			return [];
		}

		const monthlyData: Record<string, { spending: number; items: number }> = {};

		// biome-ignore lint/complexity/noForEach: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data.providerResult.forEach((order: any) => {
			if (order.createdAt) {
				const orderDate = new Date(order.createdAt);
				const month = orderDate.toLocaleString("default", { month: "long" });
				const year = orderDate.getFullYear();
				const monthYear = `${month} ${year}`;

				const price = order.unitPrice || 0;
				const quantity = order.itemQuantity || 0;
				const orderTotal = price * quantity;

				if (!monthlyData[monthYear]) {
					monthlyData[monthYear] = { spending: 0, items: 0 };
				}

				monthlyData[monthYear].spending += orderTotal;
				monthlyData[monthYear].items += quantity;
			}
		});

		return Object.entries(monthlyData)
			.map(([month, data]) => ({
				month,
				spending: data.spending,
				items: data.items,
			}))
			.sort((a, b) => {
				const monthA = new Date(a.month);
				const monthB = new Date(b.month);
				return monthA.getTime() - monthB.getTime();
			});
	};

	const chartData = getMonthlyChartData();

	if (!address) {
		return <div>Connect your wallet</div>;
	}

	if (data?.providerResult.length <= 0) {
		return (
			<div className="w-full flex items-center justify-center flex-col">
				<p className="text-black">No data available :(</p>
			</div>
		);
	}

	if (isPending) {
		return (
			<div className="w-full flex items-center justify-center flex-col gap-4">
				<Loader className="animate-spin" />
				<p className="text-black">Crunching the latest stats for you...</p>
			</div>
		);
	}

	return (
		<div className="w-full flex items-center justify-center flex-col">
			<div
				className={cn(
					"!h-full !bg-white flex flex-col items-center backdrop-blur-3xl shadow-sm !py-4 !px-6",
					buttonVariants({ variant: "noShadow" }),
				)}
			>
				<div className="flex justify-between w-full items-start">
					<p className="text-black/60">
						Total orders:{" "}
						<span className="text-black font-semibold">{totalOrders}</span>
					</p>
					<p className="text-black/60">
						Total items:{" "}
						<span className="text-black font-semibold">{totalItems}</span>
					</p>
					<p className="text-black/60">
						Total spent:{" "}
						<span className="text-black font-semibold">
							₹{formatNumberWithCommas(totalSpent.toFixed(2))}
						</span>
					</p>
				</div>

				{mostPurchasedBrand && (
					<div className="mt-2 w-full">
						<p className="text-black/60">
							Most purchased brand:{" "}
							<span className="text-black font-semibold">
								{mostPurchasedBrand}
							</span>
						</p>
					</div>
				)}

				<div className="mt-6 h-full w-full -ml-4">
					<Chart chartData={chartData} />
				</div>
			</div>

			<DownloadData
				data={data?.providerResult}
				fileName={analyticSlug.replace(/-/g, "_")}
			/>
		</div>
	);
};

export default NykaaAnalytics;
