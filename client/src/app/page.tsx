import type { NextPage } from "next";
import Link from "next/link";

import { PROVIDERS_INFO } from "~/constants";
import { HydrateClient } from "~/trpc/server";

const HomePage: NextPage = () => {
	return (
		<HydrateClient>
			<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
				Home page
			</main>
		</HydrateClient>
	);
};

export default HomePage;
