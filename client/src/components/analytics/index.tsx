import type React from "react";

import type { TProviderInfoKeys } from "~/constants";

import LinkedInAnalytics from "./linkedin";
import NykkaAnalytics from "./nykka";
import UberAnalytics from "./uber";
import ZomatoAnalytics from "./zomato";

export interface AnalyticsProps {
	analyticSlug: TProviderInfoKeys;
}

const Analytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
	switch (analyticSlug) {
		case "linkedin-connections":
			return <LinkedInAnalytics analyticSlug={analyticSlug} />;
		case "nykaa-orders":
			return <NykkaAnalytics analyticSlug={analyticSlug} />;
		case "zomato-orders":
			return <ZomatoAnalytics analyticSlug={analyticSlug} />;
		case "uber-past-trips":
			return <UberAnalytics analyticSlug={analyticSlug} />;
		default:
			return <div>Analytics not found</div>;
	}
};

export default Analytics;
