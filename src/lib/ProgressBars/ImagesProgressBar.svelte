<script>
    import { afterUpdate } from "svelte";
    import { progress_render_task_result } from "../stores";

    let curr_progress_bar_type = "render-progressbar__col-five";

    /**
     * Текущее количество заполненных чек-поинтов изображений сета
     * @type {number}
     */
    let number_of_active_checkpoints = 0;

    afterUpdate(() => {
        curr_progress_bar_type = getImagesProgressBarType();
        number_of_active_checkpoints =
            $progress_render_task_result.progress_images;
    });

    function getImagesProgressBarType() {
        if ($progress_render_task_result.progressbar_images_type === 3) {
            return "render-progressbar__col-three";
        } else if ($progress_render_task_result.progressbar_images_type === 4) {
            return "render-progressbar__col-four";
        } else {
            return "render-progressbar__col-five";
        }
    }
</script>

<div class={`render-progressbar__col ${curr_progress_bar_type}`}>
    {#each Array($progress_render_task_result.progressbar_images_type).keys() as image_number, _}
        <div
            data-name="render-item"
            class={`render-progressbar__item${image_number + 1 <= number_of_active_checkpoints ? " js--active" : ""}`}
        >
            <div class="render-progressbar__line"></div>
            <div class="render-progressbar__circle-wrp">
                <div class="render-progressbar__circle-inner">
                    <div class="render-progressbar__circle"></div>
                    <div class="render-progressbar__circle-active">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 6.5L6.1346 13.1154C6.53047 13.7488 7.45579 13.7403 7.84009 13.0999L14.5 2"
                                stroke="white"
                                stroke-width="3"
                                stroke-linecap="round"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="render-progressbar__text">Image {image_number + 1}</div>
        </div>
    {/each}
    <div class="render-progressbar__line-all"></div>
</div>
