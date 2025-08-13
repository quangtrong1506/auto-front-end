export const clsx = (...classes: string[]) => classes.filter(Boolean).join(' ').replaceAll('  ', ' ');
