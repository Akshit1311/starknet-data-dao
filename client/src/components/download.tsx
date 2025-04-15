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
};

const DownloadData: React.FC<DownloadDataProps> = ({ data }) => {
	const [extension, setExtension] = React.useState<ExportType>("csv");

	const handleDownload = () => {
		const fileName = "bankai_data_download";
		const exportType = extension;

		exportFromJSON({ data, fileName, exportType });
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
				<SelectContent>
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
