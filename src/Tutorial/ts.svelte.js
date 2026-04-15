import { validateMove } from '../ai';
import { DECK } from '../const';
import { ss } from '../shared.svelte';
import { _sound } from '../sound.svelte';
import { post, rectCenter } from '../utils';

export const ts = $state({
    tiles: [],
    dims: { rows: 9, cols: 5 },
    step: 1,
    hand1: {},
    hand2: {},

    init: () => {
        const keys = Object.getOwnPropertyNames(ts);

        for (const key of keys) {
            if (key !== 'init') {
                delete ts[key];
            }
        }

        ts.tiles = [];
        ts.dims = { rows: 9, cols: 5 };
        ts.step = 1;
        ts.hand1 = {};
        ts.hand2 = {};
    }
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

    if (ts.tiles.some(t => t.place)) {
        _sound.play('link1', { rate: 0.5 });
    }

    tiles[0].place = 'tray';
};

const onStep = (step) => {
    ts.step = step;
    // _sound.play('draw', { rate: 4 });
};

const step2 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(2);

    const hand = ts.hand1;
    hand.show = true;

    post(() => {
        if (!ss.tutorial) {
            return;
        }

        hand.off = { x: 57, y: 39 };

        post(() => {
            if (!ss.tutorial) {
                return;
            }

            hand.scale = 0.8;

            _sound.play('click');
            ts.from = { row: -1, col: -1, sector: 5 };

            post(() => {
                if (!ss.tutorial) {
                    return;
                }

                hand.scale = 1;
                post(step3, 1000);
            }, 200);
        }, 3500);
    });
};

const step3 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(3);
    const hand = ts.hand1;

    post(() => {
        if (!ss.tutorial) {
            return;
        }

        hand.off = { x: 103, y: 277 };

        post(() => {
            if (!ss.tutorial) {
                return;
            }

            hand.scale = 0.8;
            _sound.play('click');

            post(() => {
                if (!ss.tutorial) {
                    return;
                }

                hand.scale = 1;

                post(() => {
                    if (!ss.tutorial) {
                        return;
                    }

                    const placement = { row: 5, col: 3, sector: 3 };
                    const bits = validateMove(ts.from, placement, ts.tiles);

                    doPlacement(placement, bits);

                    step4();
                    post(step5, 3000);
                });
            }, 200);
        }, 3500);
    });
};

const step4 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(4);
};

const step5 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(5);
    post(step6, 3000);
};

const step6 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(6);

    const hand = ts.hand2;
    hand.show = true;

    post(() => {
        if (!ss.tutorial) {
            return;
        }

        hand.off = { x: -78, y: 45 };

        post(() => {
            if (!ss.tutorial) {
                return;
            }

            hand.scale = 0.8;

            _sound.play('click');
            ts.from = { row: -1, col: -1, sector: 4 };

            post(() => {
                if (!ss.tutorial) {
                    return;
                }

                hand.scale = 1;

                post(() => {
                    if (!ss.tutorial) {
                        return;
                    }

                    hand.off = { x: -27, y: 240 };

                    post(() => {
                        if (!ss.tutorial) {
                            return;
                        }

                        hand.scale = 0.8;
                        _sound.play('click');

                        post(() => {
                            if (!ss.tutorial) {
                                return;
                            }

                            hand.scale = 1;

                            post(() => {
                                if (!ss.tutorial) {
                                    return;
                                }

                                const placement = { row: 4, col: 4, sector: 5 };
                                const bits = validateMove(ts.from, placement, ts.tiles);

                                doPlacement(placement, bits);
                                post(step7, 3000);
                            });
                        }, 200);
                    }, 3500);
                });
            }, 200);
        }, 3500);
    });
};

const step7 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(7);

    post(step8, 3000);
};

const step8 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(8);

    const hand = ts.hand1;
    hand.show = true;

    post(() => {
        if (!ss.tutorial) {
            return;
        }

        hand.off = { x: 80, y: 300 };

        post(() => {
            if (!ss.tutorial) {
                return;
            }

            hand.scale = 0.8;

            _sound.play('click');
            ts.from = { row: 5, col: 3, sector: 4 };

            post(() => {
                if (!ss.tutorial) {
                    return;
                }

                hand.scale = 1;
                hand.off = { x: 104, y: 257 };

                post(() => {
                    if (!ss.tutorial) {
                        return;
                    }

                    hand.scale = 0.8;
                    _sound.play('click');

                    post(() => {
                        if (!ss.tutorial) {
                            return;
                        }

                        hand.scale = 1;

                        post(() => {
                            if (!ss.tutorial) {
                                return;
                            }

                            const placement = { row: 5, col: 3, sector: 2 };
                            const bits = validateMove(ts.from, placement, ts.tiles);

                            doPlacement(placement, bits);

                            // step4();
                            // post(step5, 3000);
                        });
                    }, 200);
                }, 3500);
            }, 200);
        }, 3500);
    });
};

const step9 = () => {
    if (!ss.tutorial) {
        return;
    }

    onStep(9);
};

export const makeTutorialGame = (restart = false) => {
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
        ts.ms = 1000;
    } else {
        const id = spotId(ts.to.row, ts.to.col);
        const { x: x2, y: y2 } = rectCenter(id);

        const { x: x1, y: y1 } = rectCenter(tileFrom.id);
        tileFrom.off = { x: x2 - x1, y: y2 - y1 };

        ts.ms = 1500;
    }

    post(() => {
        if (!ss.tutorial) {
            return;
        }

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
                if (!ss.tutorial) {
                    return;
                }

                ts.actor = 3 - ts.actor;

                post(() => {
                    if (!ss.tutorial) {
                        return;
                    }

                    drawTile();
                }, 2000);
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
