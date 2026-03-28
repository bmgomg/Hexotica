import { DECK, HEX_WIDTH } from './const';
import { clientRect } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const ss = $state({
    zoom: 1,
    dims: { rows: 1, cols: 1 },
    boardParams: {},
    tiles: [],
});

export const _stats = $state({
    plays: 0,
});

export const placedTiles = (tiles) => tiles.filter(tile => tile.place?.row);

export const neighbors = (tiles, row, col) => {
    const adjs = [
        { row: row - 2, col },
        { row: row - 1, col: col + 1 },
        { row: row + 1, col: col + 1 },
        { row: row + 2, col },
        { row: row + 1, col: col - 1 },
        { row: row - 1, col: col - 1 }
    ];

    const tobs = placedTiles(tiles);
    const obs = [];

    adjs.forEach(a => {
        const tile = tobs.find(tile => tile.place.row === a.row && tile.place.col === a.col);
        obs.push(tile);
    });

    return obs;
};

export const deckEmpty = (tiles, player) => {
    const tobs = tiles.filter(tile => tile.player === player && !tile.place);
    return tobs.length === 0;
};

export const calcSpans = (tiles) => {
    let min_row = Number.MAX_VALUE;
    let min_col = Number.MAX_VALUE;
    let max_row = 0;
    let max_col = 0;

    if (tiles.length) {
        tiles.forEach(tile => {
            const { row, col } = tile.place;

            min_row = Math.min(min_row, row);
            min_col = Math.min(min_col, col);
            max_row = Math.max(max_row, row);
            max_col = Math.max(max_col, col);
        });
    }
    else {
        min_row = min_col = 0;
    }

    min_row = Math.max(0, min_row);
    min_col = Math.max(0, min_col);

    return { min_row, max_row, min_col, max_col };
};

export const calcDims = (boardParams) => {
    const { rowHeight, colWidth, gap, padding: pad } = boardParams;
    const r = clientRect('#board');

    if (!r) {
        return { rows: 1, cols: 1 };
    }

    let rows = Math.floor((r.height - pad.bottom + gap.y) / (rowHeight + gap.y));
    let cols = Math.floor((r.width - pad.right + gap.x) / (colWidth + gap.x));

    if (rows % 2 === 0) {
        rows -= 1;
    }

    if (cols % 2 === 0) {
        cols -= 1;
    }

    return { rows, cols };
};

export const boardParams = () => {
    const m = HEX_WIDTH * ss.zoom / 100;
    const rowHeight = 43.25 * m;
    const colWidth = 75 * m;
    const gap = { y: 2 * m, x: 4.75 * m };
    const pad = { top: 0, right: 25 * m, bottom: rowHeight, left: 0 };

    return { rowHeight, colWidth, gap, padding: pad };
};

const initDecks = () => {
    const tiles = [];

    for (let i = 0; i < 2; i++) {
        const player = i + 1;
        const deck = [...DECK];

        deck.forEach(deck, bits => {
            const id = `tile ${player} ${bits}`.replaceAll(',', '');
            tiles.push({ id, player, bits });
        });
    }

    return tiles;
};

export const remesh = () => {
    const ptiles = placedTiles(ss.tiles);
    const { min_row, max_row, min_col, max_col } = calcSpans(ptiles);
    const span_rows = max_row - min_row + 1;
    const span_cols = max_col - min_col + 1;

    const params = boardParams();
    const { rows: dim_rows, cols: dim_cols } = calcDims(params);

    const rows = Math.max(span_rows + 4, dim_rows);
    const cols = Math.max(span_cols + 2, dim_cols);

    ptiles.forEach(t => {
        t.place.row = Math.floor((rows - span_rows) / 2) + t.place.row - min_row + 1;
        t.place.col = Math.floor((cols - span_cols) / 2) + t.place.col - min_col + 1;
    });

    ss.dims = { rows, cols };
};
