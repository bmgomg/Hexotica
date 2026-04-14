import { DECK } from '../const';
import { _sound } from '../sound.svelte';
import { post, rectCenter } from '../utils';

export const ts = $state({
    tiles: [],
    dims: { rows: 9, cols: 5 }
});

export const spotId = (row, col) => 'tutorial spot ' + (row < 0 ? 'tray' : row + ':' + col);

export const isMoving = () => ts.from && ts.to;

export const remesh = () => {
    ts.dims = { rows: 9, cols: 5 };
};

const initDecks = () => {
    const tiles = [];

    DECK.forEach((bits, i) => {
        if (i < 3 || i > 5) {
            return;
        }

        for (const player of [1, 2]) {
            const id = 'tutorial tile ' + player + ` ${bits}`.replaceAll(',', '');
            tiles.push({ id, player, bits, idBits: bits, imgTurns: 0 });
        }
    });

    return tiles;
};

export const trayTile = () => ts.tiles.find((tile) => tile.place === 'tray');

export const playerTiles = (player, filter) => {
    let tiles = ts.tiles.filter((tile) => tile.player === player);

    if (filter === 'placed') {
        tiles = tiles.filter((tile) => tile.place?.row);
    } else if (filter === 'deck') {
        tiles = tiles.filter((tile) => !tile.place);
    }

    return tiles;
};

export const drawTile = () => {
    let tiles = playerTiles(ts.actor, 'deck');

    if (tiles.length === 0) {
        ts.actor = 3 - ts.actor;
        tiles = playerTiles(ts.actor, 'deck');
    }

    const tile = ts.tiles[0];
    tile.place = 'tray';
};

export const makeGame = (restart = false) => {
    const doMakeGame = () => {
        _sound.play('dice');

        delete ts.from;
        delete ts.to;

        ts.tiles = initDecks();
        ts.actor = 1;

        post(() => {
            drawTile();
            remesh();
        });
    };

    if (restart) {
        ts.restart = true;
    }

    post(
        () => {
            delete ts.restart;
            doMakeGame();
        },
        restart ? 500 : 0
    );
};

export const doPlacement = (placement, bits) => {
    ts.to = placement;
    const tileFrom = fromTile();

    if (tileFrom === findTile(ts.to.row, ts.to.col)) {
        ts.ms = 500;
    } else {
        const id = spotId(ts.to.row, ts.to.col);
        const { x: x2, y: y2 } = rectCenter(id);

        const { x: x1, y: y1 } = rectCenter(tileFrom.id);
        tileFrom.off = { x: x2 - x1, y: y2 - y1 };

        ts.ms = 750;
    }

    post(() => {
        completePlacement(bits);
    }, ts.ms);
};

const completePlacement = (bits) => {
    _sound.play('cluck');

    const tileFrom = fromTile();
    tileFrom.bits = bits;
    tileFrom.imgTurns = (tileFrom.imgTurns + currentTurns()) % 6;

    if (tileFrom.off) {
        delete tileFrom.off;

        if (tileFrom.place === 'tray') {
            post(() => {
                ts.actor = 3 - ts.actor;
                drawTile();
            });
        }

        tileFrom.place = { row: ts.to.row, col: ts.to.col };
    }

    delete ts.from;
    delete ts.to;
    delete ts.ms;
};

export const fromTile = () => ts.from ? findTile(ts.from.row, ts.from.col) : null;

export const findTile = (row, col) => {
    if (row < 0) {
        return trayTile();
    }

    return ts.tiles.find(tile => tile.place?.row === row && tile.place?.col === col);
};

export const currentTurns = () => {
    if (!isMoving()) {
        return 0;
    }

    let d = ts.to.sector - ts.from.sector;

    if (d > 3) {
        d -= 6;
    } else if (d < -3) {
        d += 6;
    }

    return d;
};
