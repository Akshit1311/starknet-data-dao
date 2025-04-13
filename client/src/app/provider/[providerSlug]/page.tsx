import React from "react";

import Provider from "~/components/provider";
import { ProviderSchema } from "~/types";

const ProviderPage = async ({
	params,
}: {
	params: Promise<{ providerSlug: string }>;
}) => {
	const { providerSlug } = await params;

	const parsedData = ProviderSchema.safeParse(providerSlug);

	if (!parsedData.success) return <div>Provider not found</div>;

	return (
		<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
			<Provider providerSlug={parsedData.data} />
		</main>
	);
};

export default ProviderPage;
