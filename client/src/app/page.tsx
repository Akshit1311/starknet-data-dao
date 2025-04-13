import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { Button } from "~/components/ui/button";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });

	return (
		<HydrateClient>
			<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
				<Button>hi</Button>
			</main>
		</HydrateClient>
	);
}
