import { validateMove } from '../ai';
import { DECK } from '../const';
import { _sound } from '../sound.svelte';
import { post, rectCenter } from '../utils';

export const ts = $state({
    tiles: [],
    dims: { rows: 9, cols: 5 },
    step: 1,
    hand1: {},
    hand2: {},
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

        const player = i === 4 ? 2 : 1;
        const id = 'tutorial tile ' + player + ` ${bits}`.replaceAll(',', '');
        tiles.push({ id, player, bits, idBits: bits, imgTurns: 0 });
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

    tiles[0].place = 'tray';
};

const step2 = () => {
    ts.step = 2;
    const hand = ts.hand1;
    hand.show = true;

    post(() => {
        hand.off = { x: 57, y: 30 };

        post(() => {
            hand.scale = 0.8;

            _sound.play('click');
            ts.from = { row: -1, col: -1, sector: 5 };

            post(() => {
                hand.scale = 1;
                post(step3, 1000);
            }, 200);
        }, 3500);
    });
};

const step3 = () => {
    ts.step = 3;
    const hand = ts.hand1;

    post(() => {
        hand.off = { x: 107, y: 270 };

        post(() => {
            hand.scale = 0.8;
            _sound.play('click');

            post(() => {
                hand.scale = 1;

                post(() => {
                    const placement = { row: 5, col: 3, sector: 3 };
                    const bits = validateMove(ts.from, placement, ts.tiles);

                    doPlacement(placement, bits);
                    post(step4, 3000);
                });
            }, 200);
        }, 3500);
    });
};

const step4 = () => {
    ts.step = 4;
    post(step5, 2000);
};

const step5 = () => {
    ts.step = 5;

    const hand = ts.hand2;
    hand.show = true;

    post(() => {
        hand.off = { x: -78, y: 45 };

        post(() => {
            hand.scale = 0.8;

            _sound.play('click');
            ts.from = { row: -1, col: -1, sector: 4 };

            post(() => {
                hand.scale = 1;

                post(() => {
                    hand.off = { x: -27, y: 240 };

                    post(() => {
                        hand.scale = 0.8;
                        _sound.play('click');

                        post(() => {
                            hand.scale = 1;

                            const placement = { row: 4, col: 4, sector: 5 };
                            const bits = validateMove(ts.from, placement, ts.tiles);

                            doPlacement(placement, bits);
                            post(step6, 3000);
                        }, 200);
                    }, 3500);
                });
            }, 200);
        }, 3500);
    });
};

const step6 = () => {
    ts.step = 6;
};

const step7 = () => {
    ts.step = 7;
};

const step8 = () => {
    ts.step = 8;
};

export const makeGame = (restart = false) => {
    const doMakeGame = () => {
        _sound.play('dice');

        delete ts.from;
        delete ts.to;
        delete ts.ms;

        ts.tiles = initDecks();
        ts.actor = 1;
        ts.step = 1;
        ts.hand1 = {};
        ts.hand2 = {};

        post(() => {
            drawTile();
            remesh();

            post(step2, 3000);
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

    delete ts.hand1.show;
    delete ts.hand2.show;

    const tileFrom = fromTile();

    if (tileFrom === findTile(ts.to.row, ts.to.col)) {
        ts.ms = 500;
    } else {
        const id = spotId(ts.to.row, ts.to.col);
        const { x: x2, y: y2 } = rectCenter(id);

        const { x: x1, y: y1 } = rectCenter(tileFrom.id);
        tileFrom.off = { x: x2 - x1, y: y2 - y1 };

        ts.ms = 1500;
    }

    post(() => completePlacement(bits), ts.ms);
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
                post(drawTile, 2000);
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
