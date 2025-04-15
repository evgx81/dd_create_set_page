<script>
    import { filters } from "../stores";
</script>

<div class="dropdown--js">
    <div class="dropdown__header--js">
        <button class="button button--light">Sort</button>
    </div>
    <div class="dropdown__content dropdown__content--js">
        <div class="dropdown__body-wrapper">
            <ul class="dropdown__body">
                <li class="dropdown__list-item">
                    <label for="sort-01">
                        <span class="dropdown__link-text"
                            >Price: low to high</span
                        >
                        <input
                            id="sort-01"
                            type="checkbox"
                            name="sort-01"
                            on:click={() => {
                                $filters.price_desc = false;
                                $filters.most_popular = false;
                                $filters.size_asc = false;
                                $filters.size_desc = false;
                            }}
                            bind:value={$filters.price_asc}
                            checked={$filters.price_asc}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-02">
                        <span class="dropdown__link-text"
                            >Price: high to low</span
                        >
                        <input
                            id="sort-02"
                            type="checkbox"
                            name="sort-02"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.most_popular = false;
                                $filters.size_asc = false;
                                $filters.size_desc = false;
                            }}
                            bind:value={$filters.price_desc}
                            checked={$filters.price_desc}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-04">
                        <span class="dropdown__link-text">Most popular</span>
                        <input
                            id="sort-04"
                            type="checkbox"
                            name="sort-04"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.price_desc = false;
                                $filters.size_asc = false;
                                $filters.size_desc = false;
                            }}
                            bind:value={$filters.most_popular}
                            checked={$filters.most_popular}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-05">
                        <span class="dropdown__link-text"
                            >Size: small to large</span
                        >
                        <input
                            id="sort-05"
                            type="checkbox"
                            name="sort-05"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.price_desc = false;
                                $filters.most_popular = false;
                                $filters.size_desc = false;
                            }}
                            bind:value={$filters.size_asc}
                            checked={$filters.size_asc}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-06">
                        <span class="dropdown__link-text"
                            >Size: large to small</span
                        >
                        <input
                            id="sort-06"
                            type="checkbox"
                            name="sort-06"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.price_desc = false;
                                $filters.most_popular = false;
                                $filters.size_asc = false;
                            }}
                            bind:value={$filters.size_desc}
                            checked={$filters.size_desc}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</div>
