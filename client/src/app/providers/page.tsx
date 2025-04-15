import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { PROVIDERS_INFO } from "~/constants";
import { cn } from "~/lib/utils";
import { HydrateClient } from "~/trpc/server";

const ProvidersPage: NextPage = () => {
	return (
		<HydrateClient>
			<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
				<div className="justify-end flex">
					<div
						id="grid-container"
						className="text-foreground grid w-full sm:grid-cols-2 gap-10 grid-cols-3"
					>
						{Object.entries(PROVIDERS_INFO).map(([key, provider]) => (
							<Link
								href={`/providers/${key}`}
								className="border-border shadow-shadow text-main-foreground rounded-base bg-main hover:translate-x-boxShadowX hover:translate-y-boxShadowY border-2 p-5 transition-all hover:shadow-none"
								key={key}
							>
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
									{provider.title}
								</h4>
								<p className="text-sm mt-2 text-muted-foreground max-w-[300px]">
									{provider.description}
								</p>
							</Link>
						))}
					</div>
				</div>
			</main>
		</HydrateClient>
	);
};

export default ProvidersPage;
