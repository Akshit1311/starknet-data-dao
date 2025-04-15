import type React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { api } from "~/trpc/react";
import { useState } from "react";

type Props = {
	isNickOpen: boolean;
	onClose: () => void;
	address: `0x${string}`;
};

const NickInput = ({ isNickOpen, address, onClose }: Props) => {
	const { mutate } = api.auth.login.useMutation({
		onSuccess: () => {
			onClose();
		},
		onError: (error) => {
			alert(`${error.message} ${address}`);
		},
	});
	const [nickname, setNickname] = useState("Pedro Duarte");

	const [error, setError] = useState("");

	return (
		<Dialog open={isNickOpen}>
			{/* <DialogTrigger asChild>{children}</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Pick a nickname</DialogTitle>
					<DialogDescription>
						Enter a nickname that you'd like. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label htmlFor="name-1">Nickname</Label>
						<Input
							id="name-1"
							onChange={(e) => {
								setError("");
								setNickname(e.target.value);
							}}
							name="name"
						/>
						<div className="text-red-500 text-xs">{error}</div>
					</div>
				</div>
				<DialogFooter>
					<form
						onSubmit={(e) => {
							e.preventDefault();

							if (!nickname) {
								setError("Nickname is mandatory! Pick a fun one");
							}

							mutate({
								address,
								nickname,
							});
						}}
					>
						<Button type="submit" className="cursor-pointer">
							Save changes
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default NickInput;
