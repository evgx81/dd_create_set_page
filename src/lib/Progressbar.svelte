<script>
    import Images360ProgressBar from "./ProgressBars/Images360ProgressBar.svelte";
    import ImagesProgressBar from "./ProgressBars/ImagesProgressBar.svelte";
    import VideoProgressBar from "./ProgressBars/VideoProgressBar.svelte";
</script>

<div class="render-progressbar js--active" data-name="render-progressbar">
    <div class="render-progressbar__inner">
        <ImagesProgressBar />
        <VideoProgressBar />
        <Images360ProgressBar />
    </div>
</div>
