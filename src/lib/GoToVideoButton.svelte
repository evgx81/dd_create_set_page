<script>
    import { show_go_to_video_button, go_to_video_button_is_scrolled } from "./stores";
</script>

<a
    id="go_to_video_button"
    href="#video"
    class="link-anchor js--show"
    on:click={() => {
        $go_to_video_button_is_scrolled = true;
        $show_go_to_video_button = false;
    }}
    data-name="link-anchor"
>
    <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.38719 12.8007L1.334 3.18273C0.365227 1.86167 1.30861 -1.28442e-07 2.94681 -2.19586e-07L17.0532 -1.00441e-06C18.6914 -1.09556e-06 19.6348 1.86167 18.666 3.18273L11.6128 12.8007C10.8137 13.8904 9.1863 13.8904 8.38719 12.8007Z"
            fill="#1F2933"
        />
    </svg>
    <span class="link-anchor__text">Video</span>
    <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.38719 12.8007L1.334 3.18273C0.365227 1.86167 1.30861 -1.28442e-07 2.94681 -2.19586e-07L17.0532 -1.00441e-06C18.6914 -1.09556e-06 19.6348 1.86167 18.666 3.18273L11.6128 12.8007C10.8137 13.8904 9.1863 13.8904 8.38719 12.8007Z"
            fill="#1F2933"
        />
    </svg>
</a>
