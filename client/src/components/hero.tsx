"use client";

import { animate, stagger, useInView } from "motion/react";
import { Manrope } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

import { cn } from "~/lib/utils";

import { Icons } from "./Icons";
import { Button } from "./ui/button";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "700"] });

const SVGDataURI =
	"data:image/svg+xml;base64,IDxzdmcKICAgICAgd2lkdGg9IjQyMSIKICAgICAgaGVpZ2h0PSI4NTIiCiAgICAgIHZpZXdCb3g9IjAgMCA0MjEgODUyIgogICAgICBmaWxsPSJub25lIgogICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICA+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICAgICBkPSJNNzMgMEgzNDhDMzg2LjY2IDAgNDE4IDMxLjM0MDEgNDE4IDcwVjc4MkM0MTggODIwLjY2IDM4Ni42NiA4NTIgMzQ4IDg1Mkg3M0MzNC4zNDAxIDg1MiAzIDgyMC42NiAzIDc4MlY3MEMzIDMxLjM0MDEgMzQuMzQwMSAwIDczIDBaTTM0OCA2SDczQzM3LjY1MzggNiA5IDM0LjY1MzggOSA3MFY3ODJDOSA4MTcuMzQ2IDM3LjY1MzggODQ2IDczIDg0NkgzNDhDMzgzLjM0NiA4NDYgNDEyIDgxNy4zNDYgNDEyIDc4MlY3MEM0MTIgMzQuNjUzOCAzODMuMzQ2IDYgMzQ4IDZaIgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjMxOCIKICAgICAgICB3aWR0aD0iMTAiCiAgICAgICAgaGVpZ2h0PSI2IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4yIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjkzIgogICAgICAgIHk9Ijg0NiIKICAgICAgICB3aWR0aD0iMTAiCiAgICAgICAgaGVpZ2h0PSI2IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4yIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjMiCiAgICAgICAgeT0iOTAiCiAgICAgICAgd2lkdGg9IjYiCiAgICAgICAgaGVpZ2h0PSIxMCIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgICBmaWxsLW9wYWNpdHk9IjAuMiIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICB4PSI0MTIiCiAgICAgICAgeT0iOTAiCiAgICAgICAgd2lkdGg9IjYiCiAgICAgICAgaGVpZ2h0PSIxMCIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgICBmaWxsLW9wYWNpdHk9IjAuMiIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICB4PSIzIgogICAgICAgIHk9Ijc1MiIKICAgICAgICB3aWR0aD0iNiIKICAgICAgICBoZWlnaHQ9IjEwIgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4yIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjQxMiIKICAgICAgICB5PSI3NTIiCiAgICAgICAgd2lkdGg9IjYiCiAgICAgICAgaGVpZ2h0PSIxMCIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgICBmaWxsLW9wYWNpdHk9IjAuMiIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik00MTcuOTcxIDI2Nkg0MTguOTgxQzQyMC4wOTYgMjY2IDQyMSAyNjYuODk1IDQyMSAyNjhWMzY0QzQyMSAzNjUuMTA1IDQyMC4wOTYgMzY2IDQxOC45ODEgMzY2SDQxNy45NzFWMjY2WiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0wIDMwMkMwIDMwMC44OTUgMC45MDQwMiAzMDAgMi4wMTkxOCAzMDBIMy4wMjg3OFYzNjNIMi4wMTkxOEMwLjkwNDAyIDM2MyAwIDM2Mi4xMDUgMCAzNjFWMzAyWiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0wIDIyM0MwIDIyMS44OTUgMC45MDQwMiAyMjEgMi4wMTkxOCAyMjFIMy4wMjg3OFYyODRIMi4wMTkxOEMwLjkwNDAyIDI4NCAwIDI4My4xMDUgMCAyODJWMjIzWiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0wIDE2MkMwIDE2MC44OTUgMC45MDQwMiAxNjAgMi4wMTkxOCAxNjBIMy4wMjg3OFYxOTNIMi4wMTkxOEMwLjkwNDAyIDE5MyAwIDE5Mi4xMDUgMCAxOTFWMTYyWiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICB4PSIxNTAiCiAgICAgICAgeT0iMzAiCiAgICAgICAgd2lkdGg9IjEyMCIKICAgICAgICBoZWlnaHQ9IjM1IgogICAgICAgIHJ4PSIxNy41IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjI0NCIKICAgICAgICB5PSI0MSIKICAgICAgICB3aWR0aD0iMTMiCiAgICAgICAgaGVpZ2h0PSIxMyIKICAgICAgICByeD0iNi41IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4xIgogICAgICAvPgogICAgPC9zdmc+";

export function HeroSection() {
	const ref = useRef(null);
	const isInView = useInView(ref);

	return (
		<div
			ref={ref}
			className="w-full bg-linear-to-t flex items-center justify-center from-gray-50/75 to-gray-50/50 dark:bg-neutral-800 min-h-[100dvh]"
		>
			<div className="mx-auto max-w-7xl pt-16 lg:pt-0 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden">
				<div className="px-4 py-10 md:px-12 md:py-10">
					<RoughNotationGroup show={isInView}>
						<h2
							className={cn(
								"text-center text-2xl font-bold tracking-tight text-neutral-900 sm:text-left sm:text-4xl lg:text-7xl dark:text-neutral-50",
								manrope.className,
							)}
						>
							Your trusted data{" "}
							<RoughNotation
								type="highlight"
								animationDuration={2000}
								iterations={3}
								color="#00C8EF30"
								multiline
							>
								<span className="text-currentColor">sovereignty tool</span>
							</RoughNotation>{" "}
							for DAOs{" "}
						</h2>
						<p className="mt-4 max-w-2xl text-center text-sm text-neutral-500 sm:text-left md:mt-10 md:text-lg dark:text-neutral-400">
							Transform how your DAO manages data with{" "}
							<RoughNotation
								type="underline"
								animationDuration={2000}
								iterations={3}
								color="#00C8EF"
							>
								Reclaim Protocol.
							</RoughNotation>{" "}
							Securely verify, share, and monetize information—no
							intermediaries, no exploitation. <br />
							Take your data governance to the next level. and take your
							productivity to the next level.
						</p>
					</RoughNotationGroup>

					<div className="mt-10 flex flex-col items-center justify-center lg:justify-start gap-4 [perspective:800px] sm:flex-row">
						<Link href={"/providers"}>
							<Button className="w-full cursor-pointer origin-left rounded-lg bg-main px-4 py-2 text-base font-bold text-black transition duration-200 hover:shadow-lg hover:[transform:rotateX(10deg)] sm:w-auto">
								Get started
							</Button>
						</Link>
					</div>
				</div>

				<div className="relative flex h-full flex-shrink-0 justify-end">
					<Skeleton />

					<div className="absolute -bottom-[0rem] left-[-7.5rem] flex gap-2 text-lg font-semibold">
						<span className="mt-11">Demo</span>
						<Icons.arrow className="order-1 arrow size-20 text-brand-400 transition-transform duration-300 z-50 rotate-[221deg] text-main" />
					</div>
				</div>
			</div>
		</div>
	);
}

export const Skeleton = () => {
	const ref = useRef(null);
	const isInView = useInView(ref);

	React.useEffect(() => {
		const sequence = [
			[".first", { opacity: [0, 1] }, { duration: 1, ease: "easeOut" }],
			[".second", { opacity: [0, 1] }, { duration: 1, ease: "easeOut" }],
			[
				".images .image",
				{
					opacity: [0, 1],
					rotate: [0, Math.floor(Math.random() * 10), 0],
					scale: [1, 1.1, 1],
				},
				{ duration: 1, ease: "easeOut", delay: stagger(0.4) },
			],
		];

		//@ts-ignore
		if (isInView) animate(sequence);
	}, [isInView]);

	return (
		<div ref={ref} className="realtive m-auto h-[600px] w-[360px] pt-20">
			<div
				style={{
					backgroundImage: `url('${SVGDataURI}')`,
					backgroundSize: "contain",
					backgroundPosition: "top",
					backgroundRepeat: "no-repeat",
				}}
				className="absolute inset-0 mx-auto dark:invert dark:filter"
			/>
			<div className="absolute left-[38px] top-[4px] overflow-hidden rounded-[45px] w-[284px] h-[592px] z-20 flex flex-col gap-4">
				<video
					src="/video.mp4"
					autoPlay
					loop
					muted
					className="rounded-[45px]"
				/>
			</div>
		</div>
	);
};

export const MobileMockup = ({ className }: { className?: string }) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			width="421"
			height="852"
			viewBox="0 0 421 852"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cn(
				"absolute inset-0 mx-auto h-full w-full flex-shrink-0 object-cover object-top text-neutral-900 dark:text-neutral-50",
				className,
			)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M73 0H348C386.66 0 418 31.3401 418 70V782C418 820.66 386.66 852 348 852H73C34.3401 852 3 820.66 3 782V70C3 31.3401 34.3401 0 73 0ZM348 6H73C37.6538 6 9 34.6538 9 70V782C9 817.346 37.6538 846 73 846H348C383.346 846 412 817.346 412 782V70C412 34.6538 383.346 6 348 6Z"
				fill="currentColor"
			/>
			<rect
				x="318"
				width="10"
				height="6"
				fill="currentColor"
				fillOpacity="0.2"
			/>
			<rect
				x="93"
				y="846"
				width="10"
				height="6"
				fill="currentColor"
				fillOpacity="0.2"
			/>
			<rect
				x="3"
				y="90"
				width="6"
				height="10"
				fill="currentColor"
				fillOpacity="0.2"
			/>
			<rect
				x="412"
				y="90"
				width="6"
				height="10"
				fill="currentColor"
				fillOpacity="0.2"
			/>
			<rect
				x="3"
				y="752"
				width="6"
				height="10"
				fill="currentColor"
				fillOpacity="0.2"
			/>
			<rect
				x="412"
				y="752"
				width="6"
				height="10"
				fill="currentColor"
				fillOpacity="0.2"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M417.971 266H418.981C420.096 266 421 266.895 421 268V364C421 365.105 420.096 366 418.981 366H417.971V266Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 302C0 300.895 0.90402 300 2.01918 300H3.02878V363H2.01918C0.90402 363 0 362.105 0 361V302Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 223C0 221.895 0.90402 221 2.01918 221H3.02878V284H2.01918C0.90402 284 0 283.105 0 282V223Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 162C0 160.895 0.90402 160 2.01918 160H3.02878V193H2.01918C0.90402 193 0 192.105 0 191V162Z"
				fill="currentColor"
			/>
			<rect
				x="150"
				y="30"
				width="120"
				height="35"
				rx="17.5"
				fill="currentColor"
			/>
			<rect
				x="244"
				y="41"
				width="13"
				height="13"
				rx="6.5"
				fill="currentColor"
				fillOpacity="0.1"
			/>
		</svg>
	);
};
