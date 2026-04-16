import Hex1 from '$lib/images/Hex 1.webp';
import Hex10 from '$lib/images/Hex 10.webp';
import Hex11 from '$lib/images/Hex 11.webp';
import Hex12 from '$lib/images/Hex 12.webp';
import Hex13 from '$lib/images/Hex 13.webp';
import Hex14 from '$lib/images/Hex 14.webp';
import Hex2 from '$lib/images/Hex 2.webp';
import Hex3 from '$lib/images/Hex 3.webp';
import Hex4 from '$lib/images/Hex 4.webp';
import Hex5 from '$lib/images/Hex 5.webp';
import Hex6 from '$lib/images/Hex 6.webp';
import Hex7 from '$lib/images/Hex 7.webp';
import Hex8 from '$lib/images/Hex 8.webp';
import Hex9 from '$lib/images/Hex 9.webp';

export const DASH = '─';
export const HEXES = [Hex1, Hex2, Hex3, Hex4, Hex5, Hex6, Hex7, Hex8, Hex9, Hex10, Hex11, Hex12, Hex13, Hex14];
export const APP_STATE = 'Hexotica V2';
export const HEX_DIMS = { X: 726, Y: 628 };
export const HEX_RATIO = HEX_DIMS.X / HEX_DIMS.Y;
export const HEX_WIDTH = 90;
export const N_TO_WIN = 6;
export const OPP_HUMAN = 'human';
export const OPP_ROBOT = 'robot';
export const MSG_ERROR = 'error';
export const MSG_INFO = 'info';
export const MSG_SUCCESS = 'success';
export const INFO_STATS = 'stats';
export const INFO_DECK = 'deck';
export const ERR_NO_TILE = 1;
export const ERR_COLOR = 2;
export const ERR_NEIGHBORS = 3;
export const ERR_ISLAND = 4;

export const DIR_NW = { dr: -1, dc: -1 };
export const DIR_N = { dr: -2, dc: 0 };
export const DIR_NE = { dr: -1, dc: +1 };
export const DECK_SIZE = 16;
export const BLUE = '2';
export const YELL = '1';

export const POOL = [
    '222222',
    '111111',
    '122222',
    '212222',
    '221222',
    '222122',
    '222212',
    '222221',

    '122221',
    '112222',
    '211222',
    '221122',
    '222112',
    '222211',

    '121222',
    '212122',
    '221212',
    '222121',
    '122212',
    '212221',

    '122122',
    '212212',
    '221221',

    '112212',
    '211221',
    '121122',
    '212112',
    '221211',
    '122121',

    '111222',
    '211122',
    '221112',
    '222111',
    '122211',
    '112221',

    '212121',
    '121212',

    '112122',
    '211212',
    '221121',
    '122112',
    '212211',
    '121221',

    '112112',
    '211211',
    '121121',

    '111212',
    '211121',
    '121112',
    '212111',
    '121211',
    '112121',

    '122111',
    '112211',
    '111221',
    '111122',
    '211112',
    '221111',

    '111112',
    '211111',
    '121111',
    '112111',
    '111211',
    '111121',
];
