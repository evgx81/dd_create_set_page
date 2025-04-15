<script>
    import { onMount } from "svelte";
    import { page_header_data } from "./stores";

    async function getPageHeaderData() {
        const resp = await fetch("/products/product_sets/header_set_types/");

        if (!resp.ok) {
            throw new Error(`Error: ${resp.status}`);
        }

        const data = await resp.json();
        page_header_data.set(data);
    }
    
    document.addEventListener("click", clickOutside, false);
    function clickOutside(e) {

        let clicked_on_catalogs_menu = document
            .getElementById("menu-intro")
            .contains(e.target);

        // Если кликнули на меню с каталогом товаров, но было ранее не открыто, то открываем его. Иначе - закрываем его
        if (clicked_on_catalogs_menu && show_catalogs_menu === false) {
            show_catalogs_menu = true;
        }
        else {
            show_catalogs_menu = false;
        }
    }

    let show_catalogs_menu = false;

    onMount(async () => {
        await getPageHeaderData();
    });
</script>

<div class="menu">
    <div
        class={`menu__header${show_catalogs_menu ? " js--active" : ""}`}
        id="menu-intro"
    >
        <div class="menu-burger">
            <div class="menu-burger__item"></div>
            <div class="menu-burger__item"></div>
            <div class="menu-burger__item"></div>
        </div>
        <div class="menu__text">Menu</div>
        <div class="menu__icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="8"
                viewBox="0 0 11 8"
                fill="none"
            >
                <path
                    d="M6.32404 1.19861L9.92301 6.43347C10.3792 7.09697 9.90415 8 9.09897 8L1.90103 8C1.09585 8 0.620831 7.09697 1.07699 6.43347L4.67596 1.19861C5.07331 0.620644 5.92669 0.620644 6.32404 1.19861Z"
                    fill="#1F2933"
                />
            </svg>
        </div>
    </div>
    <div
        class={`menu-content${show_catalogs_menu ? " js--active" : ""}`}
        data-name="menu-content"
    >
        <div class="container">
            <div class="menu-content__inner">
                {#each $page_header_data as set_data}
                    <a
                        href={`/set_catalog/${set_data.id}`}
                        class="menu-content__set"
                    >
                        <div class="menu-content__set-inner">
                            <img
                                src={set_data.image}
                                alt=""
                                class="menu-content__set-img"
                            />
                        </div>
                    </a>
                {/each}
                <a href="/create_set/" class="menu-content__set">
                    <div class="menu-content__set-inner">
                        <span class="menu-content__text">Create your set</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
