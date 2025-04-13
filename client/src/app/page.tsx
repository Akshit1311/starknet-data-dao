import ReclaimDemo from "~/components/Reclaim/ReclaimDemo";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center ">
				<ReclaimDemo />
			</main>
		</HydrateClient>
	);
}
