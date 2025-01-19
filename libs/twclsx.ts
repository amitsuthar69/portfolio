import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from 'clsx'

export const twclsx = (...args: ClassValue[]) => twMerge(clsx(...args))