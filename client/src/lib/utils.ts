import { BigNumber } from "bignumber.js";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { num } from "starknet";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(_address: string, startChars = 4, endChars = 4) {
  const x = num.toHex(num.getDecimalString(_address));
  return truncate(x, startChars, endChars);
}

export function formatNumber(num: number | string, decimals?: number): string {
  const numberValue = typeof num === "string" ? Number(num) : num;

  if (numberValue >= 1_000_000) {
    return `${(numberValue / 1_000_000).toFixed(decimals ?? 2)}m`;
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else if (numberValue >= 1_000) {
    return `${(numberValue / 1_000).toFixed(decimals ?? 2)}k`;
  }
  return `${numberValue.toFixed(decimals ?? 2)}`;
}

export function formatNumberWithCommas(
  value: number | string,
  decimals?: number
): string {
  const numberValue = typeof value === "string" ? Number(value) : value;

  // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
  if (isNaN(numberValue)) {
    return "0";
  }

  return numberValue
    .toFixed(decimals ?? 2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function truncate(str: string, startChars: number, endChars: number) {
  if (str.length <= startChars + endChars) {
    return str;
  }

  return `${str.slice(0, startChars)}...${str.slice(
    str.length - endChars,
    str.length
  )}`;
}

export const etherToWeiBN = (amount: bigint) => {
  if (!amount) {
    return 0;
  }
  const decimals =
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  if (!decimals) {
    return 0;
  }
  try {
    const factor = new BigNumber(10).exponentiatedBy(18); // Wei in 1 Ether
    const amountBN = new BigNumber(amount)
      .times(factor)
      .times(new BigNumber(10).exponentiatedBy(decimals))
      .dividedBy(factor)
      .integerValue(BigNumber.ROUND_DOWN);

    // Formatting the result to avoid exponential notation
    const formattedAmount = amountBN.toFixed();
    return formattedAmount;
  } catch (e) {
    console.warn("etherToWeiBN fails with error: ", e);
    return amount;
  }
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function standariseAddress(address: string | bigint) {
  let _a = address;
  if (!address) {
    _a = "0";
  }
  const a = num.getHexString(num.getDecimalString(_a.toString()));
  return a;
}

export const copyAddressToClipboard = (address: string) => {
  navigator.clipboard.writeText(address);
  toast("Address copied to clipboard");
};

export const logger = {
  debug<Args extends unknown[]>(message: string, ...args: Args): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info<Args extends unknown[]>(message: string, ...args: Args): void {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn<Args extends unknown[]>(message: string, ...args: Args): void {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error<Args extends unknown[]>(message: string, ...args: Args): void {
    console.error(`[ERROR] ${message}`, ...args);
  },
};
