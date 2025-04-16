import Image from "next/image";
import React from "react";
import Analytics from "~/components/analytics";

import { PROVIDERS_INFO, type TProviderInfoKeys } from "~/constants";
import { cn } from "~/lib/utils";
import { ProviderSchema } from "~/types";

const ProviderPage = async ({
	params,
}: {
	params: Promise<{ analyticSlug: TProviderInfoKeys }>;
}) => {
	const { analyticSlug } = await params;

	const parsedData = ProviderSchema.safeParse(analyticSlug);

	if (!parsedData.success) return <div>Provider not found</div>;

	const provider = PROVIDERS_INFO[parsedData.data];

	return (
		<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
			<div className="border-border text-main-foreground rounded-base bg-main hover:translate-x-0 hover:translate-y-0 border-2 p-5 transition-all hover:shadow-none my-10">
				<Image
					src={provider.icon}
					alt={provider.title}
					width={52}
					height={52}
					className={cn("rounded-md", {
						"size-9":
							provider.title.toLowerCase().includes("nykka") ||
							provider.title.toLowerCase().includes("uber"),
					})}
				/>
				<h4
					className={cn("font-heading mt-3 text-lg sm:text-xl", {
						"mt-6": provider.title.toLowerCase().includes("nykka"),
					})}
				>
					{provider.title} Analytics
				</h4>
			</div>

			<Analytics analyticSlug={analyticSlug} />
		</main>
	);
};

export default ProviderPage;
