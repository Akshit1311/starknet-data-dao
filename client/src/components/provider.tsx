"use client";

import { ReclaimProofRequest, type Proof } from "@reclaimprotocol/js-sdk";
import { Loader } from "lucide-react";
import type React from "react";
import { useState } from "react";
import QRCode from "react-qr-code";

import { logger } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { TProofs, TProviders, TPublicData } from "~/types";

import { Button } from "./ui/button";

interface ProviderProps {
	providerSlug: TProviders;
}

const Provider: React.FC<ProviderProps> = ({ providerSlug }) => {
	const [requestUrl, setRequestUrl] = useState<string>("");
	const [publicData, setPublicData] = useState<TPublicData | undefined>(
		undefined,
	);
	const [proofs, setProofs] = useState<TProofs>(undefined);
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const { mutateAsync } = api.reclaim.generateConfig.useMutation();

	const handleProofSuccess = (receivedProofs: TProofs) => {
		logger.info("RECEIVED PROOFS:", { receivedProofs });

		if (!receivedProofs) {
			setProofs(undefined);
			return;
		}

		setProofs(receivedProofs);

		// Handle single Proof object case
		if (!Array.isArray(receivedProofs) && typeof receivedProofs !== "string") {
			const singleProof = receivedProofs as Proof;
			if (singleProof.publicData) {
				setPublicData(singleProof.publicData);
			}
			logger.info("Verification success", singleProof?.claimData?.context);
		}
		// Handle Proof[] array case
		else if (
			Array.isArray(receivedProofs) &&
			receivedProofs.length > 0 &&
			typeof receivedProofs[0] !== "string"
		) {
			const proofArray = receivedProofs as Proof[];
			logger.info(
				"Verification success",
				JSON.stringify(proofArray.map((p) => p.claimData?.context)),
			);
		}
		// Handle string or string[] case
		else {
			logger.info("SDK Message:", receivedProofs);
		}

		setStatus("success");
	};

	const getVerificationReq = async () => {
		try {
			// Reset state
			setStatus("loading");
			setProofs(undefined);
			setRequestUrl("");

			// Initialize the Reclaim SDK
			const { reclaimProofRequestConfig } = await mutateAsync({ providerSlug });
			const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
				reclaimProofRequestConfig,
			);

			// Generate verification request URL
			const url = await reclaimProofRequest.getRequestUrl();
			logger.info("Request URL:", url);
			setRequestUrl(url);
			setStatus("idle"); // Reset status after URL is generated

			// Start listening for proof submissions
			await reclaimProofRequest.startSession({
				onSuccess: (receivedProofs) =>
					handleProofSuccess(receivedProofs as TProofs),
				onError: (error: Error) => {
					logger.error("Verification failed", error);
					setStatus("error");
				},
			});
		} catch (err) {
			logger.error("Failed to generate verification request:", err);
			setStatus("error");
		}
	};

	const hasProofs = (): boolean => {
		if (!proofs) return false;
		if (Array.isArray(proofs)) return proofs.length > 0;
		return true;
	};

	const renderContent = () => {
		if (status === "loading") {
			return (
				<div className="mt-4 flex items-center gap-3">
					Generating QR code...
					<Loader className="animate-spin size-4" />
				</div>
			);
		}

		if (status === "error") {
			return (
				<div className="break-words mx-auto text-red-500 mt-5 font-semibold">
					Verification failed. Please try again!
				</div>
			);
		}

		if (status === "success" || hasProofs()) {
			return (
				<div className="break-words mx-auto text-green-500 mt-5 font-semibold">
					Verification success!
				</div>
			);
		}

		if (requestUrl) {
			return (
				<div className="flex flex-col items-center">
					<div className="border-4 border-black p-2 bg-white  rounded-lg my-5">
						<QRCode value={requestUrl} />
					</div>
					<p>
						Scan the QR code with the Reclaim verifier app to login into your
						provider.
					</p>
				</div>
			);
		}

		return null;
	};

	return (
		<>
			<Button onClick={getVerificationReq} disabled={status === "loading"}>
				Get scanner for your data.
			</Button>
			{renderContent()}
		</>
	);
};

export default Provider;
