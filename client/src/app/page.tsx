import Link from "next/link";

import { PROVIDERS_INFO } from "~/constants";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
	return (
		<HydrateClient>
			<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
				{/* <ReclaimDemo />*/}

				<div className="justify-end flex">
					<div
						id="grid-container"
						className="text-foreground grid w-full sm:grid-cols-2 gap-10 grid-cols-3"
					>
						{Object.values(PROVIDERS_INFO).map((provider) => (
							<Link
								href={`/provider/${provider.slug}`}
								className="border-border shadow-shadow text-main-foreground rounded-base bg-main hover:translate-x-boxShadowX hover:translate-y-boxShadowY border-2 p-5 transition-all hover:shadow-none"
								key={provider.title}
							>
								<provider.icon />
								<p className="font-heading mt-3 text-lg sm:text-xl">
									{provider.title}
								</p>
							</Link>
						))}
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
