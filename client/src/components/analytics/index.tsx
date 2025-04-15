import type React from "react";

import type { TProviderInfoKeys } from "~/constants";

import ZomatoAnalytics from "./zomato";

export interface AnalyticsProps {
	analyticSlug: TProviderInfoKeys;
}

const Analytics: React.FC<AnalyticsProps> = ({ analyticSlug }) => {
	switch (analyticSlug) {
		case "linkedin-connections":
			return <div>Coming soon...</div>;
		case "nykaa-orders":
			return <div>Coming soon...</div>;
		case "zomato-orders":
			return <ZomatoAnalytics analyticSlug={analyticSlug} />;
		case "uber-past-trips":
			return <div>Coming soon...</div>;
		default:
			return <div>Analytics not found</div>;
	}
};

export default Analytics;
