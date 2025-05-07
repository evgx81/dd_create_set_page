<script>
    import { afterUpdate, onMount } from "svelte";
    import CreateSetSlider from "./CreateSetSlider.svelte";
    import SetTotalInfo from "./SetTotalInfo.svelte";
    import {
        chosen_set_type_id,
        slots,
        chosen_slots,
        is_admin_user,
        is_set_card_page,
        set_data,
        render_task_result_data,
        total_amount_of_products,
        total_price,
        product_set_data_for_rendering,
        curr_chosen_sku,
        show_render_results_sliders,
        swiper_images,
        update_swiper,
        is_not_optional_slot_filled,
    } from "./stores";
    import Scrollbar from "./Scrollbar.svelte";
    import EmptySetSlot from "./EmptySetSlot.svelte";
    import FilledSetSlot from "./FilledSetSlot.svelte";
    import StylumButton from "./StylumButton.svelte";
    import SceneInput from "./SceneInput.svelte";
    import ApproveSetButton from "./ApproveSetButton.svelte";
    import DeleteSetButton from "./DeleteSetButton.svelte";

    const createSetScrollbar = (parent) => {
        const track = parent.querySelector('[data-name-scrollbar="track"]');
        if (track) {
            const inner = parent.querySelector('[data-name="list-wrapper"]');
            const buttonUp = parent.querySelector(
                '[data-name-scrollbar="button-up"]',
            );
            const buttonDown = parent.querySelector(
                '[data-name-scrollbar="button-down"]',
            );
            const thumb = parent.querySelector('[data-name-scrollbar="thumb"]');

            let isDragging = false;
            let startY;
            let startScrollTop;
            let scrollInterval;
            let scrollSpeed = 5; // Начальная скорость прокрутки
            let acceleration = 1; // Фактор ускорения
            let scrollDirection = 0; // 1 для вниз, -1 для вверх

            function scrollBy(amount) {
                inner.scrollBy({ top: amount });
                updateScrollbar();
            }

            function updateScrollbar() {
                const innerHeight = inner.scrollHeight;
                const visibleHeight = inner.clientHeight;
                const scrollRatio = visibleHeight / innerHeight;
                thumb.style.height = `${scrollRatio * 100}%`;

                const thumbHeight = thumb.clientHeight;
                const trackHeight = track.clientHeight;
                thumb.style.transform = `translateY(${(inner.scrollTop / (innerHeight - visibleHeight)) * (trackHeight - thumbHeight)}px)`;
            }

            function onThumbMouseDown(e) {
                isDragging = true;
                startY = e.clientY;
                startScrollTop = inner.scrollTop;
                document.addEventListener("mousemove", onThumbMouseMove);
                document.addEventListener("mouseup", onThumbMouseUp);
            }

            function onThumbMouseMove(e) {
                if (!isDragging) return;
                const deltaY = e.clientY - startY;
                const trackHeight = track.clientHeight;
                const thumbHeight = thumb.clientHeight;
                const scrollableHeight =
                    inner.scrollHeight - inner.clientHeight;
                const thumbPosition =
                    (deltaY / (trackHeight - thumbHeight)) * scrollableHeight;
                inner.scrollTop = startScrollTop + thumbPosition;
                updateScrollbar();
            }

            function onThumbMouseUp() {
                isDragging = false;
                document.removeEventListener("mousemove", onThumbMouseMove);
                document.removeEventListener("mouseup", onThumbMouseUp);
            }

            function startScroll(direction) {
                scrollDirection = direction;
                scrollInterval = setInterval(() => {
                    scrollBy(scrollDirection * scrollSpeed);
                    scrollSpeed += acceleration; // Увеличиваем скорость
                }, 20); // Интервал в миллисекундах
            }

            function stopScroll() {
                clearInterval(scrollInterval);
                scrollSpeed = 10; // Сброс скорости после остановки
                scrollDirection = 0;
            }

            buttonUp?.addEventListener("mousedown", () => startScroll(-1));
            buttonDown?.addEventListener("mousedown", () => startScroll(1));
            buttonUp?.addEventListener("mouseup", stopScroll);
            buttonDown?.addEventListener("mouseup", stopScroll);
            buttonUp?.addEventListener("mouseleave", stopScroll);
            buttonDown?.addEventListener("mouseleave", stopScroll);

            inner.addEventListener("scroll", updateScrollbar);
            updateScrollbar();
            thumb.addEventListener("mousedown", onThumbMouseDown);
        }
    };

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

    onMount(async () => {
        // Запрашиваем из БД все, что касается укрупненных категорий типа сета
        const resp = await fetch(
            "/products/products/set_type_categories?" +
                new URLSearchParams({
                    set_type_id: $chosen_set_type_id,
                }).toString(),
        );

        if (!resp.ok) {
            slots.set([]);
            throw new Error(`Error: ${resp.status}`);
        }

        const data = await resp.json();

        // Сохраняем в стор состояние элементов укрупненных категорий
        slots.set(data);

        if ($is_set_card_page) {
            // Инициализируем массив выбранных элементов сета
            $slots.forEach((element) => {
                // Для каждого слота ищем товар, который имеет ту же самую укрупненную категорию, но не добавлен в сет (такой механизм позволит избежать дублирования товара на слотах)
                let curr_product = $set_data.products
                    .filter(
                        (product) => product.is_added_to_chosen_slots === false,
                    )
                    .find(
                        (product) =>
                            product.general_category_ids[0] ===
                            element.general_category_id,
                    );

                let curr_chosen_slot =
                    curr_product !== undefined
                        ? {
                              order_num: element.order_num,
                              is_chosen: true,
                              is_optional: element.is_optional,
                              show_modify_button: false,
                              show_delete_button: false,
                              clicked_modify_button: false,
                              clicked_delete_button: false,
                              images: curr_product.images,
                              sku: curr_product.sku,
                              brand: curr_product.brand,
                              name: curr_product.name,
                              length: curr_product.length,
                              width: curr_product.width,
                              height: curr_product.height,
                              color: curr_product.color,
                              price: curr_product.price,
                          }
                        : {
                              order_num: element.order_num,
                              is_chosen: false,
                              is_optional: element.is_optional,
                              show_modify_button: false,
                              show_delete_button: false,
                              clicked_modify_button: false,
                              clicked_delete_button: false,
                              images: [],
                              sku: "",
                              brand: "",
                              name: "",
                              length: 0,
                              width: 0,
                              height: 0,
                              color: "",
                              price: 0,
                          };
                $chosen_slots.push(curr_chosen_slot);

                // Помечаем товар в сете добавленным в заполненнные слоты
                if (curr_product !== undefined) {
                    curr_product.is_added_to_chosen_slots = true;
                }
            });

            // Пересчитываем общее количество товаров в сете и его общую стоимость
            total_amount_of_products.set(countTotalSetAmountOfProducts());
            total_price.set(countTotalSetPrice());

            // Запоминаем в стор артикулы выбранных товаров
            curr_chosen_sku.set(
                Array.from(
                    $chosen_slots
                        .filter((slot) => slot.is_chosen)
                        .map((filled_slot) => filled_slot.sku),
                ),
            );

            // Заполняем данные, необходимые для создания задачи на рендеринг данного сета для правильного отображения кнопки "Stylum"
            $product_set_data_for_rendering = {
                chosen_set_type_id: $chosen_set_type_id,
                sku: $curr_chosen_sku,
                scene: $set_data.scene,
            };

            // После заполнения слотов запоминаем данные результата рендеринга задачи
            $render_task_result_data.id = $set_data.task_id;
            $render_task_result_data.product_set_id = $set_data.id;
            $render_task_result_data.is_product_set_active =
                $set_data.is_active;
            $render_task_result_data.is_product_set_liked = $set_data.is_liked;
            $render_task_result_data.scene = $set_data.scene;
            $render_task_result_data.images.push(...$set_data.images);
            $render_task_result_data.videos.push(...$set_data.videos);
            $render_task_result_data.sequences.push(...$set_data.sequences);

            // Отмечаем, что на свайпере нужно выводить изображения сета товаров
            swiper_images.set($render_task_result_data.images);
            update_swiper.set(true);

            // Отмечаем, что заполнен обязательный слот
            is_not_optional_slot_filled.set(true);
            
        } else {
            // Запрашиваем из БД все, что касается укрупненных категорий типа сета
            // await fetch(
            //     "/products/products/set_type_categories?" +
            //         new URLSearchParams({
            //             set_type_id: $chosen_set_type_id,
            //         }).toString(),
            // )
            //     .then((resp) => resp.json())
            //     .then((data) => {
            //         // Сохраняем в стор состояние элементов сета
            //         slots.set(data);
            //         console.log($slots);
            //         // Инициализируем массив выбранных элементов сета
            //         $slots.forEach((element) => {
            //             $chosen_slots.push({
            //                 order_num: element.order_num,
            //                 is_chosen: false,
            //                 is_optional: element.is_optional,
            //                 show_delete_button: false,
            //                 show_modify_button: false,
            //                 clicked_modify_button: false,
            //                 clicked_delete_button: false,
            //                 images: [],
            //                 sku: "",
            //                 brand: "",
            //                 name: "",
            //                 length: 0,
            //                 width: 0,
            //                 height: 0,
            //                 color: "",
            //                 price: 0,
            //             });
            //         });
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         slots.set([]);
            //     });

            // Инициализируем массив выбранных элементов сета
            $slots.forEach((element) => {
                $chosen_slots.push({
                    order_num: element.order_num,
                    is_chosen: false,
                    is_optional: element.is_optional,
                    show_delete_button: false,
                    show_modify_button: false,
                    clicked_modify_button: false,
                    clicked_delete_button: false,
                    images: [],
                    sku: "",
                    brand: "",
                    name: "",
                    length: 0,
                    width: 0,
                    height: 0,
                    color: "",
                    price: 0,
                });
            });
        }
    });

    afterUpdate(() => {
        // Создаем или обновляем scrollbar. Нужно, чтобы scrollbar не разъезжался при нажатии на него.
        const blockSettings = document.querySelector(
            '[data-name="custom-scrollbar-parent"]',
        );

        if (blockSettings) {
            createSetScrollbar(blockSettings);
        }
    });
</script>

<section
    class={`set-card-hero ${$show_render_results_sliders ? "section-pad-bot" : "section-pad-bot-without-after-line"} section-index-3`}
>
    <div class="container">
        <div
            class="catalog-sliders catalog-slider--settings catalog-slider--settings-create-set"
            data-name="slider-parent"
        >
            <CreateSetSlider />

            <div class="catalog-list" data-name="custom-scrollbar-parent">
                <div class="catalog-list__wrapper" data-name="list-wrapper">
                    <ul class="catalog-list__inner">
                        <!-- Выводим обязательные слоты -->

                        {#each $chosen_slots.filter((curr_slot) => !curr_slot.is_optional) as curr_slot (curr_slot.order_num)}
                            {#if curr_slot.is_chosen}
                                <FilledSetSlot
                                    filled_slot={curr_slot}
                                    general_category_id={$slots.find(
                                        (slot) =>
                                            slot.order_num ===
                                            curr_slot.order_num,
                                    ).general_category_id}
                                    general_category_name={$slots.find(
                                        (slot) =>
                                            slot.order_num ===
                                            curr_slot.order_num,
                                    ).general_category_name}
                                    on:message
                                />
                            {:else}
                                <EmptySetSlot
                                    order_num={curr_slot.order_num}
                                    slot={$slots.find(
                                        (slot) =>
                                            slot.order_num ===
                                            curr_slot.order_num,
                                    )}
                                    on:message
                                />
                            {/if}
                        {/each}

                        <!-- Выводим заполненные выбранные необязательные слоты -->
                        {#each $chosen_slots.filter((curr_slot) => curr_slot.is_chosen === true && curr_slot.is_optional) as curr_slot (curr_slot.order_num)}
                            <FilledSetSlot
                                filled_slot={curr_slot}
                                general_category_id={$slots.find(
                                    (slot) =>
                                        slot.order_num === curr_slot.order_num,
                                ).general_category_id}
                                general_category_name={$slots.find(
                                    (slot) =>
                                        slot.order_num === curr_slot.order_num,
                                ).general_category_name}
                                on:message
                            />
                        {/each}

                        <!-- Выводим незаполненные необязательные слоты -->
                        {#each $chosen_slots.filter((curr_slot) => curr_slot.is_chosen === false && curr_slot.is_optional) as curr_slot (curr_slot.order_num)}
                            <EmptySetSlot
                                order_num={curr_slot.order_num}
                                slot={$slots.find(
                                    (slot) =>
                                        slot.order_num === curr_slot.order_num,
                                )}
                                on:message
                            />
                        {/each}
                    </ul>
                </div>
                <Scrollbar />
            </div>
        </div>
        <div class="catalog-price-total-wrapper">
            {#if $is_admin_user}
                <div class="catalog-price__box__admin">
                    <StylumButton />
                    <DeleteSetButton />
                    <ApproveSetButton />
                </div>
            {:else}
                <div class="catalog-price__box">
                    <StylumButton />
                    <SetTotalInfo />
                </div>
            {/if}
        </div>

        {#if $is_admin_user}
            <SceneInput />
        {/if}
    </div>
</section>
