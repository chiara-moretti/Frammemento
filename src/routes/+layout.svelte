<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();
	let isMobileMenuOpen = $state(false);
	let isMobileThemesOpen = $state(false);
	let hasScrolledPastHomeTitle = $state(false);
	const homePath = `${base}/`;
	/** @param {string} value */
	const normalizePath = (value) => value.replace(/\/+$/, '') || '/';
	const isHomePage = $derived(normalizePath(page.url.pathname) === normalizePath(homePath));
	const isTemiPage = $derived(normalizePath(page.url.pathname).startsWith(normalizePath(`${base}/temi`)));
	const isAlbumPage = $derived(normalizePath(page.url.pathname) === normalizePath(`${base}/album`));
	const showHeaderBar = $derived(isMobileMenuOpen || hasScrolledPastHomeTitle);
	const mobileMainOffset = $derived(
		!isMobileMenuOpen ? '0rem' : isHomePage ? (isMobileThemesOpen ? '19rem' : '14.5rem') : '17.5rem'
	);

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
		if (!isMobileMenuOpen) {
			isMobileThemesOpen = false;
		}
	};

	const closeMobileMenu = () => {
		isMobileMenuOpen = false;
		isMobileThemesOpen = false;
	};

	$effect(() => {
		if (typeof window === 'undefined') return;

		let rafId = 0;
		const syncHeaderState = () => {
			const anchorBar = document.querySelector('.scroll-bar-anchor');
			const headerEl = document.querySelector('.site-header');
			if (!(anchorBar instanceof HTMLElement)) {
				hasScrolledPastHomeTitle = false;
				return;
			}
			const headerBottom = headerEl instanceof HTMLElement ? headerEl.getBoundingClientRect().bottom : 76;
			const isPastTitle = anchorBar.getBoundingClientRect().bottom <= headerBottom;
			hasScrolledPastHomeTitle = isPastTitle;
		};

		const scheduleSync = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(syncHeaderState);
		};

		document.addEventListener('scroll', scheduleSync, { passive: true, capture: true });
		window.addEventListener('resize', scheduleSync);
		window.addEventListener('orientationchange', scheduleSync);
		scheduleSync();

		return () => {
			cancelAnimationFrame(rafId);
			document.removeEventListener('scroll', scheduleSync, { capture: true });
			window.removeEventListener('resize', scheduleSync);
			window.removeEventListener('orientationchange', scheduleSync);
		};
	});

</script>

<header class="site-header" class:with-bar={showHeaderBar}>
	<button
		class="hamburger-btn"
		type="button"
		aria-expanded={isMobileMenuOpen}
		aria-controls="mobile-menu"
		onclick={toggleMobileMenu}
	>
		menù
	</button>

	<nav class="top-nav" aria-label="Navigazione principale" class:mobile-open={isMobileMenuOpen} id="mobile-menu">
		{#if !isHomePage}
			<a href={homePath} onclick={closeMobileMenu}>home</a>
		{/if}
		<div class="nav-dropdown">
			<a href={`${base}/temi`} class="temi-link temi-desktop" onclick={closeMobileMenu}>temi</a>
			<div class="temi-mobile-row">
				<a href={`${base}/temi`} class="temi-mobile-link" onclick={closeMobileMenu}>temi</a>
				<button
					class="temi-mobile-toggle"
					type="button"
					aria-expanded={isMobileThemesOpen}
					aria-label="Apri sotto menù temi"
					onclick={() => (isMobileThemesOpen = !isMobileThemesOpen)}
				>
					<span class="submenu-caret" class:open={isMobileThemesOpen}>▾</span>
				</button>
			</div>
			<div class="submenu" class:mobile-open={isMobileThemesOpen}>
				<a href={`${base}/temi/persone`} onclick={closeMobileMenu}>persone</a>
				<a href={`${base}/temi/ritratti`} onclick={closeMobileMenu}>ritratti</a>
				<a href={`${base}/temi/natura`} onclick={closeMobileMenu}>natura</a>
				<a href={`${base}/temi/citta`} onclick={closeMobileMenu}>città</a>
			</div>
		</div>
		<a href={`${base}/about`} onclick={closeMobileMenu}>about</a>
		<a href={`${base}/album`} onclick={closeMobileMenu}>album</a>
		<a href="https://instagram.com/frammemento" target="_blank" rel="noreferrer" onclick={closeMobileMenu}
			>@frammemento</a
		>
	</nav>
</header>

<main
	class:mobile-menu-open={isMobileMenuOpen}
	class:mobile-submenu-open={isMobileMenuOpen && isMobileThemesOpen}
	class:temi-page={isTemiPage}
	class:album-page={isAlbumPage}
	style={`--mobile-main-offset: ${mobileMainOffset};`}
>
	{@render children()}
</main>

{#if !isHomePage}
	<footer class="global-footer" class:temi-footer={isTemiPage} class:album-footer={isAlbumPage}>
		<a class="global-home-link" href={homePath} onclick={closeMobileMenu}>torna alla home</a>
	</footer>
{/if}

<style>
	.site-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 0.75rem 1rem;
		background: #fff;
		border-bottom: 0;
		transition: background-color 0.2s ease, border-color 0.2s ease;
		z-index: 200;
	}

	.site-header.with-bar {
		background: #fff;
		border-bottom: 6px solid #000;
	}

	.global-footer {
		position: fixed;
		left: 50%;
		bottom: max(1.4rem, env(safe-area-inset-bottom, 0px));
		transform: translateX(-50%);
		z-index: 95;
	}

	.global-home-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0.45rem 0.75rem;
		border: 3px solid #000;
		background: #fff;
		color: #000;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.72rem;
		font-weight: 700;
		box-shadow: 0 4px 0 #000;
	}

	.global-home-link:hover,
	.global-home-link:focus-visible {
		color: #ff5f1f;
		border-color: #ff5f1f;
	}

	@media (min-width: 741px) {
		main {
			padding-top: 1.8rem;
		}

		:global(html.route-home) main {
			padding-top: 0.25rem;
			padding-bottom: 0.9rem;
		}

		main.temi-page {
			padding-top: 0.9rem;
			padding-bottom: 7rem;
		}

		main.album-page {
			padding-top: 1.35rem;
			padding-bottom: 0.9rem;
		}

		.global-footer.temi-footer {
			bottom: max(2rem, env(safe-area-inset-bottom, 0px));
		}

		.global-footer.temi-footer .global-home-link {
			padding-top: 0.62rem;
			padding-bottom: 0.62rem;
		}
	}

	.hamburger-btn {
		display: none;
	}

	.temi-mobile-toggle {
		display: none;
	}

	.temi-mobile-row,
	.temi-mobile-link {
		display: none;
	}

	.top-nav {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 0.9rem;
		font-size: 0.86rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
	}

	main {
		padding-top: 1.8rem;
	}

	.top-nav a {
		color: #000;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		padding-bottom: 0.1rem;
		line-height: 1;
		display: inline-flex;
		align-items: center;
	}

	.top-nav a:hover,
	.top-nav a:focus-visible,
	.temi-link:hover,
	.temi-link:focus-visible {
		border-bottom-color: #ff5f1f;
		color: #ff5f1f;
	}

	.nav-dropdown {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.submenu {
		position: absolute;
		top: calc(100% + 0.18rem);
		left: 50%;
		transform: translateX(-50%);
		display: none;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.5rem 0.6rem;
		border: 2px solid #000;
		background: #fff;
		min-width: 8.5rem;
		z-index: 10;
	}

	.submenu a {
		padding: 0.1rem 0;
	}

	@media (min-width: 741px) {
		.submenu {
			display: flex;
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition: opacity 0.16s ease, visibility 0s linear 0.28s;
		}

		.nav-dropdown:hover .submenu,
		.nav-dropdown:focus-within .submenu {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
			transition-delay: 0s;
		}
	}

	@media (max-width: 740px) {
		main {
			padding-top: 4.6rem;
			transition: padding-top 0.2s ease;
		}

		main.temi-page {
			padding-bottom: 5.8rem;
		}

		main.album-page {
			padding-bottom: 6.8rem;
		}

		.global-footer.album-footer {
			bottom: max(1.75rem, env(safe-area-inset-bottom, 0px));
		}

		main.mobile-menu-open {
			padding-top: var(--mobile-main-offset);
		}

		main.mobile-submenu-open {
			padding-top: var(--mobile-main-offset);
		}

		.site-header {
			top: 0;
			left: 0;
			right: 0;
			padding: 0.75rem 1rem;
			background: #fff;
		}

		.hamburger-btn {
			display: block;
			margin-left: auto;
			padding: 0.75rem 0.9rem;
			border: 3px solid #000;
			background: #fff;
			color: #000;
			font: inherit;
			font-size: 0.86rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			cursor: pointer;
			box-shadow: 0 4px 0 #000;
		}

		.top-nav {
			position: absolute;
			top: calc(100% + 1rem);
			left: 1rem;
			right: 1rem;
			display: none;
			flex-direction: column;
			align-items: stretch;
			padding: 0.75rem 1rem;
			border: 3px solid #000;
			background: #fff;
			gap: 0.6rem;
			box-shadow: 0 4px 0 #000;
		}

		.nav-dropdown {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: stretch;
		}

		.top-nav a {
			display: block;
			width: 100%;
			text-align: right;
		}

		.top-nav a.temi-desktop {
			display: none;
		}

		.temi-mobile-row {
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: flex-end;
			gap: 0.5rem;
		}

		.temi-mobile-link {
			display: block;
			text-align: right;
			color: #000;
			text-decoration: none;
			border-bottom: 2px solid transparent;
			font-size: 0.86rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			transition: color 0.16s ease, border-color 0.16s ease;
		}

		.temi-mobile-link:hover,
		.temi-mobile-link:focus-visible {
			color: #ff5f1f;
			border-bottom-color: #ff5f1f;
		}

		.temi-mobile-toggle {
			display: block;
			width: auto;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 0;
			padding: 0.1rem 0 0.1rem 0.2rem;
			border: 0;
			background: transparent;
			color: #000;
			font: inherit;
			font-size: 0.8rem;
			font-weight: 700;
			cursor: pointer;
			transition: color 0.16s ease;
		}

		.temi-mobile-toggle:hover,
		.temi-mobile-toggle:focus-visible {
			color: #ff5f1f;
		}

		.submenu-caret {
			display: inline-block;
			font-size: 0.72rem;
			line-height: 1;
			color: #ff5f1f;
			transition: transform 0.2s ease, color 0.2s ease;
		}

		.submenu-caret.open {
			transform: rotate(180deg);
			color: #000;
		}

		.top-nav.mobile-open {
			display: flex;
		}

		.submenu {
			position: static;
			transform: none;
			display: none;
			margin-top: 0.45rem;
			padding: 0.45rem 0.7rem 0.3rem;
			border: 1px solid #000;
			border-right: 3px solid #000;
			background: #fff7f2;
			min-width: 0;
			width: 100%;
			align-items: stretch;
			gap: 0.22rem;
		}

		.submenu a {
			width: 100%;
			text-align: right;
			font-size: 0.78rem;
			letter-spacing: 0.04em;
			opacity: 0.9;
			padding: 0.15rem 0;
			border-bottom: 1px dotted rgba(0, 0, 0, 0.22);
			transition: color 0.16s ease, border-color 0.16s ease, opacity 0.16s ease;
		}

		.submenu a:last-child {
			border-bottom: 0;
		}

		.submenu a:hover,
		.submenu a:focus-visible {
			color: #ff5f1f;
			opacity: 1;
			border-bottom-color: rgba(255, 95, 31, 0.55);
		}

		.submenu.mobile-open {
			display: flex;
		}
	}
</style>