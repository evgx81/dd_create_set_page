<script>
    import { is_set_deleted, render_task_result_data } from "./stores";

    /**
     * Определяет, были ли получены все результаты рендеринга
     * @type{boolean}
     */
    $: got_all_render_task_result_data =
        $render_task_result_data.images.length > 0 &&
        $render_task_result_data.videos.length > 0 &&
        $render_task_result_data.sequences.length > 0;

    /**
     * Активирует или дизактивирует показ сета на главной странице и в каталогах сетов
     */
    async function handleApproveSetClick() {
        if ($render_task_result_data.is_product_set_active) {
            const resp = await fetch(
                "/products/product_sets/unset_active?" +
                    new URLSearchParams({
                        set_id: $render_task_result_data.product_set_id,
                    }).toString(),
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            $render_task_result_data.is_product_set_active = false;

        } else {
            const resp = await fetch(
                "/products/product_sets/set_active?" +
                    new URLSearchParams({
                        set_id: $render_task_result_data.product_set_id,
                    }).toString(),
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            $render_task_result_data.is_product_set_active = true;
            
        }
    }
    
</script>

<!-- Если получены все результаты рендеринга пока не получены, то кнопка "Approve the set" недоступна и помечена серым цветом-->
<button
    style={`${!got_all_render_task_result_data || $is_set_deleted ? "background: #808080" : ""}`}
    class={`${$render_task_result_data.is_product_set_active ? "approve_set__button__approved" : "approve_set__button__approve_the_set"}`}
    disabled={!got_all_render_task_result_data || $is_set_deleted}
    on:click={() => handleApproveSetClick()}
>
    {#if $render_task_result_data.is_product_set_active}
        Approved
    {:else}
        Approve the set
    {/if}
</button>
