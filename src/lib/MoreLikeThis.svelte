<script>
    import { afterUpdate } from "svelte";
    import {
        is_authenticated,
        similar_product_sets,
        getUserNumberFavouriteSets,
        getCookie,
        initProductAndSimilarProductSetSliders,
    } from "./stores";

    afterUpdate(() => {
        // После подгрузки данных похожих сетов инициализируем перелистывание изображений сетов
        initProductAndSimilarProductSetSliders();
    });

    /**
     * Обработка события, когда пользователь нажимает на лайк у сета с изображением
     * @param {string} set_id - идентификатор сета
     * @param {boolean} is_set_liked - показывает лайкнут ли сет или нет
     */
    async function handleSimilarProductsSetLikeClick(set_id, is_set_liked) {
        // Получаем значение токена пользователя из куки
        let token = getCookie("token");

        if (is_set_liked === false) {
            const resp = await fetch(
                "/products/product_sets/preference/set_like?" +
                    new URLSearchParams({ set_id: set_id }).toString(),
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            // Если удалось поставить лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
            if (resp.status == 201) {
                let curr_chosen_set = $similar_product_sets.find(
                    (set) => set.id === set_id,
                );
                curr_chosen_set.is_liked = true;
                similar_product_sets.set($similar_product_sets);
            }
        } else {
            const resp = await fetch(
                "/products/product_sets/preference/unset_like?" +
                    new URLSearchParams({ set_id: set_id }).toString(),
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            // Если удалось убрать лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
            if (resp.status == 204) {
                let curr_chosen_set = $similar_product_sets.find(
                    (set) => set.id === set_id,
                );
                curr_chosen_set.is_liked = false;
                similar_product_sets.set($similar_product_sets);
            }
        }

        // Получаем обновленное количество лайкнутых сетов
        await getUserNumberFavouriteSets(token);
    }

</script>

<section class="section section-quote">
    <div class="section-quote__text">More like this</div>
</section>
<section class="section section-pad-bot">
    <div class="container">
        <div
            class="catalog-sliders catalog-sliders--six-set"
            data-name="slider-parent-product-or-similar_set"
        >
            <!-- 6 шт -->
            {#each $similar_product_sets.slice(0, 6) as product_set}
                <div id={product_set.id} class="catalogs__set-free-img-wrapper">
                    <div class="catalogs__set-free-img swiper">
                        <div class="swiper-wrapper">
                            {#each product_set.images as image}
                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                <img
                                    class="swiper-slide"
                                    src={image}
                                    alt="image"
                                />
                            {/each}
                        </div>
                        <div
                            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
                        >
                            <span
                                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                                aria-current="true"
                            ></span>
                        </div>
                        <span
                            class="swiper-notification"
                            aria-live="assertive"
                            aria-atomic="true"
                        ></span>
                    </div>
                    <div class="set-options" data-name="set-options">
                        <div class="set-options__wrapper">
                            <div
                                class="set-options__inner set-options__inner--three"
                            >
                                {#each product_set.products as product}
                                    <div class="set-options__item">
                                        <!-- svelte-ignore a11y-img-redundant-alt -->
                                        <img
                                            src={product.image}
                                            alt="image"
                                            class="set-options__img"
                                        />
                                    </div>
                                {/each}
                            </div>
                            <div class="set-options__footer">
                                <div
                                    class="catalog-price-total catalog-price-total--height"
                                >
                                    Total <span class="bold">
                                        <span data-name="item-count">
                                            {product_set.products.length}
                                        </span> items</span
                                    >
                                    for :
                                    <span
                                        class="bold size"
                                        data-name="total-price"
                                        >$ {product_set.total_price}</span
                                    >
                                </div>
                                <a
                                    href={`/set_card/${product_set.id}`}
                                    class="set-options__button button--dark"
                                >
                                    See more
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    {#if $is_authenticated}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class={`like${product_set.is_liked ? " js--active" : ""}`}
                            data-name="like"
                            on:click={() =>
                                handleSimilarProductsSetLikeClick(
                                    product_set.id,
                                    product_set.is_liked,
                                )}
                        >
                            <div class="like__inner">
                                {#if product_set.is_liked}
                                    <img
                                        src="/static/images/like-active.svg"
                                        alt="like"
                                        class="like__img like__img--active"
                                    />
                                {:else}
                                    <img
                                        src="/static/images/like.svg"
                                        alt="like"
                                        class="like__img"
                                    />
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
<section class="section section-pad-top section-index-1">
    <div class="container">
        <div
            class="catalog-sliders catalog-sliders--three-set-reverse"
            data-name="slider-parent-product-or-similar_set"
        >
            {#each $similar_product_sets.slice(6, 9) as product_set, idx}
                <div id={product_set.id} class="catalogs__set-free-img-wrapper">
                    <div class="catalogs__set-free-img swiper">
                        <div class="swiper-wrapper">
                            {#each product_set.images as product_set_image}
                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                <img
                                    class="swiper-slide"
                                    src={product_set_image}
                                    alt="image"
                                />
                            {/each}
                        </div>
                        <div
                            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
                        >
                            <span
                                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                                aria-current="true"
                            ></span>
                        </div>
                        <span
                            class="swiper-notification"
                            aria-live="assertive"
                            aria-atomic="true"
                        ></span>
                    </div>
                    <div class="set-options" data-name="set-options">
                        <div
                            class={`${idx === 0 ? "set-options__wrapper set-options__wrapper--height-min" : "set-options__wrapper"}`}
                        >
                            <div
                                class={`${idx === 0 ? "set-options__inner set-options__inner--six" : "set-options__inner set-options__inner--three"}`}
                            >
                                {#each product_set.products as product}
                                    <div class="set-options__item">
                                        <!-- svelte-ignore a11y-img-redundant-alt -->
                                        <img
                                            src={product.image}
                                            alt="image"
                                            class="set-options__img"
                                        />
                                    </div>
                                {/each}

                                {#if idx === 0}
                                    <div class="set-options__box">
                                        <div
                                            class="catalog-price-total catalog-price-total--height"
                                        >
                                            Total <span class="bold">
                                                <span data-name="item-count">
                                                    {product_set.products
                                                        .length}
                                                </span> items</span
                                            >
                                            for :
                                            <span
                                                class="bold size"
                                                data-name="total-price"
                                                >$ {product_set.total_price}</span
                                            >
                                        </div>
                                        <a
                                            href={`/set_card/${product_set.id}`}
                                            class="set-options__button button--dark"
                                        >
                                            See more
                                        </a>
                                    </div>
                                {/if}
                            </div>

                            {#if idx !== 0}
                                <div class="set-options__footer">
                                    <div
                                        class="catalog-price-total catalog-price-total--height"
                                    >
                                        Total <span class="bold">
                                            <span data-name="item-count">
                                                {product_set.products.length}
                                            </span> items</span
                                        >
                                        for :
                                        <span
                                            class="bold size"
                                            data-name="total-price"
                                            >$ {product_set.total_price}</span
                                        >
                                    </div>
                                    <a
                                        href={`/set_card/${product_set.id}`}
                                        class="set-options__button button--dark"
                                    >
                                        See more
                                    </a>
                                </div>
                            {/if}
                        </div>
                    </div>
                    {#if $is_authenticated}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            class={`like ${product_set.is_liked ? "js--active" : ""}`}
                            data-name="like"
                            on:click={() =>
                                handleSimilarProductsSetLikeClick(
                                    product_set.id,
                                    product_set.is_liked,
                                )}
                        >
                            <div class="like__inner">
                                {#if product_set.is_liked}
                                    <img
                                        src="/static/images/like-active.svg"
                                        alt="like"
                                        class="like__img like__img--active"
                                    />
                                {:else}
                                    <img
                                        src="/static/images/like.svg"
                                        alt="like"
                                        class="like__img"
                                    />
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
