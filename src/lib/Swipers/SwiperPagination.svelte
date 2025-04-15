<script>
    import { afterUpdate } from "svelte";
    import { curr_slider_images_style, swiper_images } from "../stores";


    // export let current_swiper_images;
    // export let curr_slider_images_style;


    // afterUpdate(() => {

    //     // console.log(current_swiper_images);

    //     const swiperSlider = document.querySelector('[data-name="slider-set"]');
    //     const pagination = swiperSlider.querySelector(".swiper-pagination");
    //     const paginationItems = pagination.querySelectorAll(
    //         ".swiper-pagination-bullet",
    //     );
    //     console.log(paginationItems);

    //     if ($curr_slider_images_style === "js--none") {
    //         pagination.classList.remove("js--hidden");
    //         pagination.classList.add("js--preview");
    //         pagination.classList.add("js--active");
    //         pagination.classList.add("js--position");
    //     } else {
    //         pagination.classList.remove("js--preview");
    //         pagination.classList.remove("js--active");
    //         pagination.classList.remove("js--position");
    //         pagination.classList.add("js--hidden");
    //     }

    //     console.log($swiper_images);

    //     paginationItems.forEach((item, index) => {
    //         const image = document.createElement("img");
    //         image.classList.add("pagination-preview__image");
    //         image.src = $swiper_images[index];
    //         item.insertAdjacentElement("beforeend", image);
    //     });
    // })

</script>

<div
class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
>
</div>