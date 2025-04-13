"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import type { TProofs, TPublicData } from "~/types";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";

function ReclaimDemo() {
	// State to store the verification request URL
	const [requestUrl, setRequestUrl] = useState("");
	const [publicData, setPublicData] = useState<TPublicData | undefined>(
		undefined,
	);
	const [proofs, setProofs] = useState<TProofs>([]);

	const { mutateAsync } = api.reclaim.generateConfig.useMutation();

	const getVerificationReq = async () => {
		// Your credentials from the Reclaim Developer Portal
		// Replace these with your actual credentials

		// Initialize the Reclaim SDK with your credentials
		const { reclaimProofRequestConfig } = await mutateAsync({
			provider: "NYKAA_ORDER_HISTORY",
		});

		const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
			reclaimProofRequestConfig,
		);

		// Generate the verification request URL
		const requestUrl = await reclaimProofRequest.getRequestUrl();

		console.log("Request URL:", requestUrl);

		setRequestUrl(requestUrl);

		// Start listening for proof submissions
		await reclaimProofRequest.startSession({
			// Called when the user successfully completes the verification
			onSuccess: (proofs) => {
				console.log({ proofs });

				if (proofs) {
					if (typeof proofs === "string") {
						// When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
						console.log("SDK Message:", proofs);
						setProofs([proofs]);
					} else if (typeof proofs !== "string") {
						// When using the default callback url, we get a proof object in the response
						if (Array.isArray(proofs)) {
							// when using provider with multiple proofs, we get an array of proofs
							console.log(
								"Verification success",
								JSON.stringify(proofs.map((p) => p.claimData.context)),
							);
							setProofs(proofs);
						} else {
							// when using provider with a single proof, we get a single proof object
							console.log("Verification success", proofs?.claimData.context);
							console.log({ proofs });

							setProofs(proofs);

							setPublicData(proofs.publicData);
						}
					}
				}

				// Add your success logic here, such as:
				// - Updating UI to show verification success
				// - Storing verification status
				// - Redirecting to another page
			},
			// Called if there's an error during verification
			onError: (error) => {
				console.error("Verification failed", error);

				// Add your error handling logic here, such as:
				// - Showing error message to user
				// - Resetting verification state
				// - Offering retry options
			},
		});
	};

	return (
		<>
			<Button onClick={getVerificationReq}>Get Verification Request</Button>

			{/* Display QR code when URL is available */}

			{requestUrl && (
				<div style={{ margin: "20px 0" }}>
					<QRCode value={requestUrl} />
				</div>
			)}

			{proofs && (
				<div>
					<h2>Verification Successful!</h2>
					<div className="w-1/2 break-words mx-auto">
						{JSON.stringify(proofs, null, 2)}
					</div>
				</div>
			)}
		</>
	);
}

export default ReclaimDemo;
