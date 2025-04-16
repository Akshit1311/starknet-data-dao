"use client";

import exportFromJSON, { type ExportType } from "export-from-json";
import { Download } from "lucide-react";
import React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

import { Button, buttonVariants } from "./ui/button";

type DownloadDataProps = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	fileName?: string;
};

const DownloadData: React.FC<DownloadDataProps> = ({
	data,
	fileName = "bankai_download",
}) => {
	const [extension, setExtension] = React.useState<ExportType>("csv");

	const handleDownload = () => {
		if (data && data.length > 0) {
			exportFromJSON({ data, fileName, exportType: extension });
		}
	};

	return (
		<div className="mt-7 mx-auto flex items-center gap-5">
			<Button onClick={handleDownload}>
				Download your data
				<Download className="size-4" />
			</Button>

			<Select
				defaultValue="csv"
				value={extension}
				onValueChange={(val) => setExtension(val as ExportType)}
			>
				<SelectTrigger className={cn(buttonVariants(), "w-fit")}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="bg-white">
					<SelectGroup>
						<SelectItem value="csv">.csv</SelectItem>
						<SelectItem value="json">.json</SelectItem>
						<SelectItem value="xml">.xml</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default DownloadData;
