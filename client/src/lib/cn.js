import {clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'


/**
 * Merge conditional class names and dedupe conflicting tailwind
 * it works like this for eg "px-2 px-4" -> "px-4"
 */
export function cn(...inputs){
    return twMerge(clsx(inputs));
}