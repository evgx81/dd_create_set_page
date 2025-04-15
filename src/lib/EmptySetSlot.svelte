<script>
    import { createEventDispatcher } from "svelte";
    import {
        curr_chosen_slot_num,
        chosen_slots,
        filters,
        render_in_progress,
        show_products_catalog,
        show_render_results_sliders,
        is_authenticated,
        swiper_images,

        update_swiper

    } from "./stores";

    /**
     * Хранит данные о компоненте сета
     * @type {{general_category_name: string, general_category_display_name: string, general_category_id: string, image_url: string, is_optional: boolean, order_num: number}}
     */
    export let slot;

    /**
     * Хранит номер слота, выбранный пользователем
     * @type {number}
     */
    export let order_num;

    const dispatch = createEventDispatcher();

    /**
     * Обрабатывает нажатие на пустой слот сета
     */
    function handleSlotClick() {
        
        // Если идет рендеринг, то при нажатии на незаполненный слот ничего не происходит
        if ($render_in_progress) {
            return;
        }

        // Запоминаем номер строки таблицы, на которую кликнули
        curr_chosen_slot_num.set(order_num);

        dispatch("message", {
            general_category_id: slot.general_category_id,
            general_category_name: slot.general_category_name,
        });

        // Убираем показ кнопок "Modify" или "Delete" у других слотов при нажатии на пустой слот
        $chosen_slots.forEach((slot) => {
            slot.show_delete_button = false;
            slot.show_modify_button = false;
            slot.clicked_modify_button = false;
            slot.clicked_delete_button = false;
        });

        chosen_slots.set($chosen_slots);

        $filters = {
            brands: [],
            colors: [],
            materials: [],
            sizes: [],
            decor_categories: [],
            price_asc: false,
            price_desc: false,
            most_popular: false,
            size_asc: false,
            size_desc: false,
        };

        // При нажатии на пустой слот, показываем каталог товаров, но не показываем слайдеры с результатами рендеринга
        show_products_catalog.set(true);
        show_render_results_sliders.set(false);

        // Помечаем, что клике на пустой слот нет изображений на выводе на свайпере        
        swiper_images.set([]);
        update_swiper.set(true);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

{#if $is_authenticated}
    <li
        data-name="catalog-set-item"
        class="catalog-list-item"
        on:click={() => handleSlotClick()}
    >
        <img
            src={slot.image_url}
            alt="furniture"
            class="catalog-list-item__img"
        />

        <div class="catalog-list-item__info">
            <h4 class="catalog-list-item__title">
                Please choose {slot.general_category_display_name}
                {#if slot.is_optional}
                    {@html `<span>(optional)</span>`}{/if}
            </h4>
        </div>
    </li>
{:else}
    <a
        href={`/login/?next=${window.location.pathname}`}
        class="catalog-list-item"
    >
        <img
            src={slot.image_url}
            alt="furniture"
            class="catalog-list-item__img"
        />

        <div class="catalog-list-item__info">
            <h4 class="catalog-list-item__title">
                Please choose {slot.general_category_display_name}
                {#if slot.is_optional}
                    {@html `<span>(optional)</span>`}{/if}
            </h4>
        </div>
    </a>
{/if}

<!---        // curr_swiper_images.set([]);
        //show_product_images.set(false);
        // swiper_product_images.set([]);-->
