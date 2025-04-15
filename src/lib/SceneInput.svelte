<script>

    import { render_task_result_data } from "./stores";

</script>

<div class="catalog-price-total-wrapper">
    <div class="catalog-price__box__admin__second">
        <div class="catalog-price-total-wrapper__admin">
            <div class="create-set__search__admin">
                <input
                    type="text"
                    class="create-search__input__admin__first"
                    placeholder="Enter scene name"
                    data-name="search-input"
                    bind:value={$render_task_result_data.scene}
                />
            </div>
        </div>
        <div class="catalog-price-total-wrapper__admin">
            <div class="create-set__search__admin">
                <input
                    type="text"
                    class="create-search__input__admin__second"
                    data-name="search-input"
                    readonly
                    bind:value={$render_task_result_data.scene}
                />
            </div>
        </div>
    </div>
</div>