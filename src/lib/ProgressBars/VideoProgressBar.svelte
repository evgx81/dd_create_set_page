<script>
    import { afterUpdate } from "svelte";
    import { progress_render_task_result } from "../stores";

    let curr_video_progress = "js--active-0";
    afterUpdate(() => {
        // if ($progress_render_task_result.progress_video !== undefined) {
            curr_video_progress = getVideoProgress();
        // }
    });

    function getVideoProgress() {
        if ($progress_render_task_result.progress_video === 1) {
            return "js--active-20";
        } else if ($progress_render_task_result.progress_video === 2) {
            return "js--active-40";
        } else if ($progress_render_task_result.progress_video === 3) {
            return "js--active-60";
        } else if ($progress_render_task_result.progress_video === 4) {
            return "js--active-80";
        } else if ($progress_render_task_result.progress_video === 5) {
            return "js--active";
        } else {
            return "js--active-0";
        }
    }
</script>

<div class="render-progressbar__col">
    <div
        data-name="render-item"
        class={`render-progressbar__item ${curr_video_progress}`}
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
        <div class="render-progressbar__text">Video</div>
    </div>
    <div class="render-progressbar__line-all"></div>
</div>
