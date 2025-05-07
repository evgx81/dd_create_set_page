<script>

    import { getUserNumberFavouriteSets, render_task_result_data, getCookie, is_set_deleted } from "./stores";

    /**
     * Определяет, были ли получены все результаты рендеринга
     * @type{boolean}
     */
    $: got_all_render_task_result_data =
        $render_task_result_data.images.length > 0 &&
        $render_task_result_data.videos.length > 0 &&
        $render_task_result_data.sequences.length > 0;

    /**
     * Удаляет сет из базы данных 
     */
    async function handleDeleteSetClick() {
        const resp = await fetch(
            "/products/product_sets/delete_set?" +
                new URLSearchParams({
                    set_id: $render_task_result_data.product_set_id,
                }).toString(),
        );

        if (!resp.ok) {
            throw new Error(`Error: ${resp.status}`);
        }

        // Устанавливаем флаг, что кнопка "Delete the set" была нажата
        $is_set_deleted = true;

        
        // Получаем значение токена пользователя из куки
        let token = getCookie("token");

        if (!token) {
            return;
        }

        await getUserNumberFavouriteSets(token);
    }
    
</script>

<!-- Если получены все результаты рендеринга пока не получены, то кнопка "Approve the set" недоступна и помечена серым цветом-->
<button
    style={`${!got_all_render_task_result_data ? "background: #808080" : ""}`}
    class="delete_set__button__delete_the_set"
    disabled={!got_all_render_task_result_data || $is_set_deleted}
    on:click={() => handleDeleteSetClick()}
>
    {#if $is_set_deleted}
        Deleted
    {:else}
        Delete
    {/if}
</button>
