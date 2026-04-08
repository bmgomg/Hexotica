import { sample } from 'lodash-es';
import { APP_STATE, DECK, HEX_WIDTH, MSG_ERROR, MSG_SUCCESS, OPP_ROBOT } from './const';
import { _sound } from './sound.svelte';
import { clientRect, post } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const ss = $state({
    menu: true,
    seenPage: {},
    zoom: 1,
    dims: { rows: 1, cols: 1 },
    boardParams: {},
    tiles: [],
    actor: 1,
});

export const stats = $state({
    plays: 0,
    wins1: 0,
    wins2: 0,
});

export const persist = (commonOnly = false) => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    if (commonOnly) {
        return;
    }

    json = JSON.stringify({ ...stats, tiles: ss.tiles, actor: ss.actor, over: ss.over });
    localStorage.setItem(ss.appKey, json);
};

export const loadCommon = () => {
    const json = localStorage.getItem(APP_STATE);
    const job = JSON.parse(json);

    if (job) {
        _sound.sfx = job.sfx;
        _sound.music = job.music;
    }
};

export const loadGame = () => {
    const json = localStorage.getItem(ss.appKey);
    const job = JSON.parse(json);

    if (job) {
        stats.plays = job.plays;
        stats.wins1 = job.wins1;
        stats.wins2 = job.wins2;

        if (ss.seenPage[ss.appSubKey] || !job.over) {
            ss.tiles = job.tiles;
            ss.actor = job.actor;
            ss.over = job.over;

            return true;
        }
    }

    return false;
};

export const placedTiles = (tiles = ss.tiles) => tiles.filter(tile => tile.place?.row);

export const trayTile = () => ss.tiles.find(tile => tile.place === 'tray');

export const findTile = (row, col) => {
    if (row < 0) {
        return trayTile();
    }

    return ss.tiles.find(tile => tile.place?.row === row && tile.place?.col === col);
};

export const goTile = () => ss.from ? findTile(ss.from.row, ss.from.col) : null;

export const neighbors = (row, col, tiles = ss.tiles) => {
    const nbs = [
        { row: row - 2, col },
        { row: row - 1, col: col + 1 },
        { row: row + 1, col: col + 1 },
        { row: row + 2, col },
        { row: row + 1, col: col - 1 },
        { row: row - 1, col: col - 1 }
    ];

    const tobs = placedTiles(tiles);
    const obs = [];

    nbs.forEach(a => {
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

const calcDims = (boardParams) => {
    const { rowHeight, colWidth, gap, pad } = boardParams;
    const r = clientRect('board');

    if (!r) {
        return { rows: 1, cols: 1 };
    }

    let rows = Math.floor((r.height - pad.y + gap.y) / (rowHeight + gap.y));
    let cols = Math.floor((r.width - pad.x + gap.x) / (colWidth + gap.x));

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
    const pad = { x: 25 * m, y: rowHeight };

    return { rowHeight, colWidth, gap, pad };
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

export const isMoving = () => ss.from && ss.to;

export const currentTurns = () => {
    if (!isMoving()) {
        return 0;
    }

    let d = ss.to.sector - ss.from.sector;

    if (d > 3) {
        d -= 6;
    } else if (d < -3) {
        d += 6;
    }

    return d;
};

const initDecks = () => {
    const tiles = [];

    DECK.forEach(bits => {
        for (const player of [1, 2]) {
            const id = 'tile ' + player + ` ${bits}`.replaceAll(',', '');
            tiles.push({ id, player, bits, idBits: bits, imgTurns: 0 });
        }
    });

    return tiles;
};

export const playerTiles = (player, filter) => {
    let tiles = ss.tiles.filter(tile => tile.player === player);

    if (filter === 'placed') {
        tiles = tiles.filter(tile => tile.place?.row);
    } else if (filter === 'deck') {
        tiles = tiles.filter(tile => !tile.place);
    }

    return tiles;
};

export const drawTile = () => {
    let tiles = playerTiles(ss.actor, 'deck');

    if (tiles.length === 0) {
        ss.actor = 3 - ss.actor;
        tiles = playerTiles(ss.actor, 'deck');
    }

    if (tiles.length === 0) {
        stats.plays++;
        ss.over = { tileIds: [] };

        showMessage('It\'s a draw!', MSG_SUCCESS);
        return;
    }

    if (ss.tiles.some(t => t.place)) {
        _sound.play('link1', { rate: 0.5 });
    }

    const first = tiles.length === DECK.length;

    const solid = (tile) => tile.bits.every(t => t === 1) || tile.bits.every(t => t === 2);

    let tile; do { tile = sample(tiles); } while (first && solid(tile));
    tile.place = 'tray';
};

export const makeGame = () => {
    _sound.play('dice');

    delete ss.over;
    delete ss.from;
    delete ss.to;

    ss.tiles = initDecks();

    post(() => {
        drawTile();
        remesh();
        persist();
    });
};

export const showMessage = (text, type = MSG_ERROR) => {
    _sound.play(type === MSG_ERROR ? 'lost' : type === MSG_SUCCESS ? 'won' : 'draw');

    ss.message = { text, type };
    post(() => delete ss.message, 2500);
};

export const roboTurn = () => !ss.over && ss.opp === OPP_ROBOT && ss.actor === 2;