<script>
/**
* Floating button bar for actions on a form
*
* @slot default Inner btn-group area, expected to be a series of `<a class="btn"/>` items
*
* @example Floating save button
* <btn-floating-bar>
*   <a class="btn btn-lg btn-success rounded-circle">
*     <i class="fas fa-lg fa-check m-0"/>
*   </a>
* </btn-floating-bar>
*/
export default {
	slots: ['default'],
}
</script>

<template>
	<div class="btn-floating-bar">
		<slot name="default"/>
	</div>
</template>

<style lang="scss">
.btn-floating-bar {
	position: fixed;
	right: 20px;
	z-index: 10;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	transition: opacity .2s ease-out, bottom .2s ease-out;

	& .btn {
		font-size: 12pt;
		padding: 15px;
		width: 55px;
		height: 55px;

		display: flex;
		justify-content: center;
		align-items: center;

		/* Shadowing (mainly fixes with .waves-circle) */
		box-shadow: 4px 4px 5px 0px rgba(50, 50, 50, 0.5) !important;

		/* Extra small 'cancel' like button which hides behind a larger button if its the last in the list */
		&.btn-xs {
			position: absolute;
			bottom: -7px;
			right: -7px;
			padding: 2px;
			height: 30px;
			width: 30px;
			z-index: -1;
			margin-right: 0;

			&:hover {
				z-index: 1;
			}
		}

		&.btn-sm {
			font-size: 12pt;
			padding: 10px;
			height: 40px;
			width: 40px;

			/* Nudge large 'Save' buttons into the shoulder of smaller delete buttons */
			&.btn-danger + .btn.btn-lg.btn-success,
			&.btn-secondary + .btn.btn-lg.btn-success {
				margin-left: -10px;
			}

			/* Nudge smaller buttons slightly behind larger ones {{{ */
			margin-right: -10px;
			transition: margin-right 0.4s ease-out, padding 0.4s ease-out;

			&:hover {
				margin-right: -5px;
				margin-left: 5px;
				padding: 25px;
			}
			/* }}} */
		}

		&.btn-lg {
			font-size: 16pt;
			padding: 16px;
			width: 70px;
			height: 70px;
		}

	}
}

/* Hide when routing or animating {{{ */
.btn-floating-bar {
	opacity: 1;
	bottom: 20px;
}

body.loading .btn-floating-bar,
body.bootstrapping .btn-floating-bar {
	opacity: 0;
	bottom: -80px;
}
/* }}} */

.btn-floating-bar .btn {
}

.btn-group-float .btn.waves-circle {
	-webkit-mask-image: none !important;
}
/* }}} */

/* Hide when printing {{{ */
@media print {
	.btn-floating-bar {
		display: none;
	}
}
/* }}} */
</style>
