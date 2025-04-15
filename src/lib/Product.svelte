<script>
    import {
        total_amount_of_products,
        curr_chosen_slot_num,
        chosen_slots,
        total_price,
        products,
        swiper_images,
        update_swiper,
        is_not_optional_slot_filled,
    } from "./stores";

    /**
     * Данные о текущем товаре
     * @type {{sku: string, general_category_ids: Array.<string>, name: string, brand: string, country_of_origin: string, length: number, width: number, height: number, colors: Array.<string>, price: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number}}
     */
    export let product;

    /**
     * Возвращает наименование товара для отображения на странице
     * @returns {string}
     */
    function getProductDisplayName() {
        let curr_display_name = product.name;

        // Если наименование состоит из одной строки, то добавляем перенос строки сначала
        // (цена будет на той же строке, что и наименование)
        if (curr_display_name.length < 38) {
            return "<br />" + curr_display_name;
        }

        let first_row = product.name.substring(0, 38).trim();

        let last_space_idx = first_row.lastIndexOf(" ");

        if (last_space_idx !== -1) {
            curr_display_name =
                curr_display_name.substring(0, last_space_idx) +
                "<br />" +
                curr_display_name.slice(last_space_idx).trim();
        } else {
            // Если наименование состоит из одного слова
            curr_display_name = "<br />" + curr_display_name;
        }

        if (product.name.length > 76) {
            curr_display_name = curr_display_name.slice(0, 50) + "...";
        }

        return curr_display_name;
    }

    /**
     * Возвращает общее количество товаров в сете
     */
    function countTotalSetAmountOfProducts() {
        return $chosen_slots.filter((slot) => slot.is_chosen === true).length;
    }

    /**
     * Возвращает общую цену товаров в сете
     */
    function countTotalSetPrice() {
        let total_price = 0;
        $chosen_slots
            .filter((slot) => slot.is_chosen === true)
            .forEach((element) => {
                total_price += element.price;
            });
        return total_price;
    }

    /**
     * При нажатии на кнопку AddToSet нужно менять данные в chosen_slots по выбранному номеру слота
     */
    function handleAddToSetClick() {
        // Выводим изображения товара на слайдер изображений
        swiper_images.set(product.images);
        update_swiper.set(true);

        // Находим слот, который выбрал пользователь
        let chosen_slot = $chosen_slots.find(
            (slot) => slot.order_num === $curr_chosen_slot_num,
        );

        // Заполняем данные слота данными товара
        chosen_slot.is_chosen = true;
        chosen_slot.show_modify_button = true; // Всегда показываем кнопку "Modify"
        chosen_slot.show_delete_button = chosen_slot.is_optional; // Выводим кнопку "Delete", если выбран необязательный слот
        chosen_slot.clicked_modify_button = false; // Отщелкиваем кнопку "Modify"
        chosen_slot.clicked_delete_button = false; // Отщелкиваем кнопку "Delete"
        chosen_slot.images = product.images;
        chosen_slot.sku = product.sku;
        chosen_slot.brand = product.brand;
        chosen_slot.name = product.name;
        chosen_slot.length = product.length;
        chosen_slot.height = product.height;
        chosen_slot.width = product.width;
        chosen_slot.color = product.colors.join(", ");
        chosen_slot.price = product.price;

        // Обновляем слоты, чтобы значения слотов обновились
        chosen_slots.set($chosen_slots);

        // Проверяем, заполнен ли обязательный слот после добавления товара
        is_not_optional_slot_filled.set(
            $chosen_slots.find((slot) => !slot.is_optional).is_chosen,
        );

        // Пересчитываем общее количество товаров в сете и его общую стоимость
        total_amount_of_products.set(countTotalSetAmountOfProducts());
        total_price.set(countTotalSetPrice());

        // Находим товар, который уже добавлен в текущей общей категории
        let before_added_product = $products.data.find(
            (product) => product.is_added_to_set === true,
        );

        // Если ранее никакой товар не был добавлен, то пропускаем его, иначе -
        // помечаем его как недобавленный в сет
        if (before_added_product !== undefined) {
            before_added_product.is_added_to_set = false;
        }

        // Помечаем текущий товар, как выбранный
        product.is_added_to_set = true;

        // Обновляем список товаров
        products.set($products);
    }
</script>

<div class="catalogs__set-free-img-wrapper">
    <div class="catalogs__set-free-img swiper">
        <div class="swiper-wrapper">
            {#each product.images as image}
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img class="swiper-slide" src={image} alt="image" />
            {/each}
        </div>
        <div
            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
        >
            <span
                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                aria-current="true"
            ></span><span class="swiper-pagination-bullet"></span><span
                class="swiper-pagination-bullet"
            ></span><span class="swiper-pagination-bullet"></span><span
                class="swiper-pagination-bullet"
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
            <div class="set-options__info">
                <div class="set-options__info-subtitle">{product.brand}</div>
                <div class="set-options__info-row">
                    <div class="set-options__info-title">
                        {@html getProductDisplayName()}
                    </div>
                    <div class="set-options__info-price">$ {product.price}</div>
                </div>
                <div class="set-options__info-list">
                    <div class="set-options__info-text">
                        Overall dimensions:
                        <span class="set-options__info-span"
                            >{product.length}x{product.height}x{product.width} cm</span
                        >
                    </div>
                    <div class="set-options__info-text">
                        Color:
                        <span class="set-options__info-span"
                            >{product.colors.join(", ")}</span
                        >
                    </div>
                    <div class="set-options__info-text">
                        Made in:
                        <span class="set-options__info-span"
                            >{product.country_of_origin}</span
                        >
                    </div>
                </div>
            </div>
            <button
                class="button button--dark {product.is_added_to_set
                    ? 'js--active'
                    : ''}"
                data-name="button-adding-set"
                disabled={product.is_added_to_set}
                on:click={() => handleAddToSetClick()}
                >{#if product.is_added_to_set}
                    Added
                {:else}
                    Add to set
                {/if}
            </button>
        </div>
    </div>
</div>
