<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { set_types_popup } from "./stores";
    // import range from "svelte-range";

    const dispatch = createEventDispatcher();

    /**
     * Обрабатывает выбор типа сета пользователем
     * @param {string} set_type_id - идентификатор типа сета, выбранного пользователем
     */
    function handleClick(set_type_id) {
        dispatch("message", {
            set_type_id: set_type_id,
        });
    }

    async function getSetTypesPopupInfo() {
        const resp = await fetch("/products/product_sets/set_types_popup/");
        if (!resp.ok) {
            throw new Error(`Error: ${resp.status}`);
        }

        if (resp.status == 200) {
            // Сохраняем в стор данные типов сетов для popup-элемента
            const data = await resp.json();
            set_types_popup.set(data);
        }
    }

    onMount(async () => {
        await getSetTypesPopupInfo();
    });

</script>

<!-- <div class="popup" data-name="popup">
    <div class="popup__inner">
        <div class="popup__title">
            Please choose the type of set you would like to create
        </div>
        <div class="popup__content">
            {#each [...set_type_images] as [set_type, images]}
                <div class="popup__set-wrapper">
                    <div
                        class="popup__set"
                        data-name="popup-set-close"
                        on:click={() => handleClick(set_type)}
                    >
                        <img
                            src={`/static/images/menu/menu-${set_type}.jpg`}
                            alt="furniture"
                            class="popup__set-img"
                        />
                    </div>
                    <ul class="popup-set__list">
                        {#each images as image}
                            <li class="popup-set__item">
                                <img
                                    src={`/static/images/create_set/choose_set_type/type${set_type}/${image}.png`}
                                    alt="furniture"
                                    class="popup-set__img"
                                />
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </div>
</div> -->

<div class="popup" data-name="popup">
    <div class="popup__inner">
        <div class="popup__title">
            Please choose the type of set you would like to create
        </div>
        <div class="popup__content">
            {#each $set_types_popup as set_type}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="popup__set-wrapper">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        class="popup__set"
                        data-name="popup-set-close"
                        on:click={() => handleClick(set_type.id)}
                    >
                        <img
                            src={set_type.set_type_image}
                            alt="furniture"
                            class="popup__set-img"
                        />
                    </div>
                    <ul class="popup-set__list">
                        <!-- {#each range(set_type.amount_of_images) as image_num}
                            <li class="popup-set__item">
                                <img
                                    src={`/static/images/create_set/choose_set_type/type${set_type.site_order_num}/${image_num+1}.png`}
                                    alt="furniture"
                                    class="popup-set__img"
                                />
                            </li>
                        {/each} -->
                        {#each set_type.general_categories_popup_images as popup_image}
                            <li class="popup-set__item">
                                <img
                                    src={popup_image}
                                    width="65px"
                                    height="65px"
                                    alt="furniture"
                                    class="popup-set__img"
                                />
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </div>
</div>
