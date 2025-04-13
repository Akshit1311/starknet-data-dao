import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { Button } from "~/components/ui/button";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center ">
				<Button>hi</Button>
			</main>
		</HydrateClient>
	);
}
