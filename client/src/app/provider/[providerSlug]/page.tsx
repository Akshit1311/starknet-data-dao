import React from "react";

import Provider from "~/components/provider";

const ProviderPage = async ({
	params,
}: {
	params: { providerSlug: string };
}) => {
	const { providerSlug } = await params;

	if (!providerSlug) {
		return <div>Provider not found</div>;
	}

	return (
		<main className="flex flex-col items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-[100dvh] bg-background">
			{/* <ReclaimDemo />*/}

			<Provider providerSlug={providerSlug} orderName="NYKAA_ORDER_HISTORY" />
		</main>
	);
};

export default ProviderPage;
