import type { CSSAttribute } from 'goober';
import { css } from 'goober';
import { prefix } from 'inline-style-prefixer';

export { clsx } from 'clsx';

export { css, prefix };

export type { CSSAttribute };

export const createCss = (attrs: CSSAttribute): string => css(attrs);

export default createCss;
