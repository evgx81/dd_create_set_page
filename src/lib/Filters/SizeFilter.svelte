<script>
    import { sizes, filters } from "../stores";
</script>

<div class="dropdown--js">
    <div class="dropdown__header--js">
        <button class="button button--light">Size</button>
    </div>
    <div
        class="dropdown__content dropdown__content--js"
        data-name="dropdown-scrollbar-parent"
    >
        <div class="dropdown__body-wrapper">
            <ul class="dropdown__body" data-name="list-wrapper">
                {#each $sizes as size}
                    <li class="dropdown__list-item">
                        <label for="size-0{size.priority}">
                            <span class="dropdown__link-text">{size.name}</span>
                            <input
                                id="size-0{size.priority}"
                                type="checkbox"
                                name="size"
                                bind:group={$filters.sizes}
                                value={size.priority}
                            />
                            <div class="dropdown-checkbox">
                                <div class="dropdown-checkbox__mark"></div>
                            </div>
                        </label>
                    </li>
                {/each}
            </ul>
            <div class="catalog-scrollbar">
                <div class="catalog-scrollbar__track">
                    <div
                        class="catalog-scrollbar__track-inner"
                        data-name-scrollbar="track"
                    >
                        <div
                            class="catalog-scrollbar__thumb"
                            data-name-scrollbar="thumb"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
