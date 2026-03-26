<script>
	import { scrollClass } from './utils';
</script>

<div id="board" class='board {scrollClass()}'></div>

<style>
	.board {
		grid-area: 2/1;
        box-sizing: border-box;
        border: dotted var(--text);
        border-width: 1px 0 1px;
	}
</style>
