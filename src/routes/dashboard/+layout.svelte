<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';

	let { children } = $props();

	function signout() {
		// if (browser) {
		// 	localStorage.removeItem('accessToken');
		// 	goto('/auth/signin');
		// }
	}

	let expanded = $state(false);
</script>

<div class="dashboard">
	<div class="dashboard__top">
		<div class="flex items-center p-4">
			<button
				class="dashboard__nav-icon mr-2 w-[30px] px-2 py-2"
				onclick={() => {
					expanded = !expanded;
				}}
			>
				<MenuIcon></MenuIcon>
			</button>

			<a href="/">
				<div class="flex items-center">
					<img src="/favicon.svg" class="max-h-[33px]" alt="" />
					<div class="dashboard__logo-text ml-2 hidden md:inline-block">Person Manager</div>
				</div>
			</a>
		</div>

		<div class="px-2">
			<div class="flex items-center space-x-2">
				<div class="ml-2">
					<a class="cursor-pointer" href="/auth/signout"> Sign out </a>
				</div>
			</div>
		</div>
	</div>
	<div class="dashboard__bottom">
		<div class="dashboard__left" class:dashboard__left--expanded={expanded}>
			<ul class="dashboard__nav">
				<li
					class="dashboard__nav-item"
					aria-current={page.url.pathname === '/dashboard/persons' ? 'page' : undefined}
				>
					<a
						onclick={() => {
							expanded = !expanded;
						}}
						href="/dashboard/persons"
					>
						Persons
					</a>
				</li>

				<li
					class="dashboard__nav-item"
					aria-current={page.url.pathname === '/dashboard/religion-caste' ? 'page' : undefined}
				>
					<a
						onclick={() => {
							expanded = !expanded;
						}}
						href="/dashboard/religion-caste"
					>
						Religion Caste
					</a>
				</li>
			</ul>
		</div>
		<div class="dashboard__middle">
			{@render children()}
		</div>
		<div class="dashboard__right"></div>
	</div>
</div>

<style>
	.dashboard {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
	}

	.dashboard__top {
		height: 55px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* border-bottom: 1px solid gray; */
	}

	.dashboard__bottom {
		background-color: #f8f8f8;
		height: 0;
		flex: 1;
		display: flex;
		border-radius: 11px;
		justify-content: space-between;
	}

	.dashboard__left {
		background-color: #eee;
		width: 250px;
		border-radius: 11px 0 0 0;
		border-top: 1px solid rgb(212, 212, 212);
		z-index: 99;
		transition: left 0.25s;
	}

	.dashboard__middle {
		width: 0;
		flex: 1;
		border-top: 1px solid rgb(212, 212, 212);
		/* background-color: red; */
		overflow-y: auto;
	}

	.dashboard__right {
		border-top: 1px solid rgb(212, 212, 212);
		border-radius: 0 11px 0 0;
		min-width: 11px;
		/* background-color: blue; */
	}

	.dashboard__nav-icon {
		display: none;
		font-size: 25px;
		cursor: pointer;
	}

	.dashboard__nav-icon:hover {
		background-color: #f8f8f8;
	}

	.dashboard__logo-text {
		font-weight: bold;
		font-size: 25px;
		color: #1c85c2;
	}

	@media only screen and (max-width: 700px) {
		.dashboard__nav-icon {
			display: inline-block;
		}

		.dashboard__left {
			position: fixed;
			left: -250px;
			top: 55px;
			bottom: 0;
		}

		.dashboard__left--expanded {
			left: 0;
		}

		.dashboard__right {
			min-width: 3px;
			/* background-color: blue; */
		}
	}

	.dashboard__nav {
		flex: 1;
		padding: 11px 0;
	}

	.dashboard__nav-item {
		border-left: 4px solid transparent;
		font-size: 15px;
	}

	.dashboard__nav-item a {
		font-size: 14px;
		padding-left: 33px;
		color: #094466;

		display: block;
		padding: 5px 15px;
		cursor: pointer;
		margin: 0 15px 0 10px;
		border-radius: 5px;
	}

	.dashboard__nav-item a:hover {
		text-decoration: none;
	}

	.dashboard__nav-item[aria-current='page'] {
		border-left: 4px solid #35a4ff;
	}

	.dashboard__nav-item[aria-current='page'] a {
		background-color: rgba(255, 255, 255, 0.8);
		color: #005fad;
	}
</style>
