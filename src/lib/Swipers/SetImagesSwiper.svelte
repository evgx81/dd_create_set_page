<script>
    import { afterUpdate, onMount } from "svelte";
    import { swiper_set_images } from "../stores";

    // let images_is_not_loaded = false;

    // afterUpdate(() => {
    //     // // Инициализируем swiper для перелистывания текущих изображений
    //     // if (images_is_not_loaded) {
    //     //     buildSwiperSlider();
    //     //     images_is_not_loaded = false;
    //     // }
    //     // // // Инициализуем превью галерии изображений в зависимости от текущего стиля окна, лежащего поверх слайдера
    //     // initPreviewImagesGallery();
    // });

    // function buildSwiperSlider() {
    //     const swiperSlider = document.querySelector('[data-name="slider-set"]');
    //     swiper = new Swiper(swiperSlider, {
    //         effect: "fade",
    //         observer: true,
    //         observeParents: true,
    //         initialSlide: 0,
    //         freeMode: true,
    //         watchSlidesVisibility: true,
    //         updateOnImagesReady: true,
    //         fadeEffect: {
    //             crossFade: true,
    //         },
    //         pagination: {
    //             el: swiperSlider.querySelector(".swiper-pagination"),
    //             clickable: true,
    //         },
    //         navigation: {
    //             nextEl: swiperSlider.querySelector(".arrow--next"),
    //             prevEl: swiperSlider.querySelector(".arrow--prev"),
    //         },
    //         on: {
    //             afterInit: function () {
    //                 swiper.update();
    //             },
    //         },
    //     });
    // }

    // function initPreviewImagesGallery() {
    //     const swiperSlider = document.querySelector('[data-name="slider-set"]');
    //     const pagination = swiperSlider.querySelector(".swiper-pagination");
    //     let paginationItems = pagination.querySelectorAll(
    //         ".swiper-pagination-bullet",
    //     );

    //     // Заполняем превью галерии текущими изображениями, которые отображаются на слайдере
    //     const slides = swiperSlider.querySelectorAll(".swiper-slide");

    //     // if (slides.length === 0) {
    //     //     return;
    //     // }

    //     paginationItems.forEach((item, index) => {
    //         const image = document.createElement("img");
    //         image.classList.add("pagination-preview__image");
    //         image.src = $swiper_set_images[index];
    //         item.insertAdjacentElement("beforeend", image);
    //     });
    // }

    // onMount(() => {
    //     // Инициализируем swiper для перелистывания текущих изображений
    //     buildSwiperSlider();
    //     // Инициализуем превью галерии изображений в зависимости от текущего стиля окна, лежащего поверх слайдера
    //     initPreviewImagesGallery();
    // });
</script>

<!-- Иницилизируем два свайпера - для изображений товаров и сетов. Данный механизм нужен для корректной обработки изображений из разных сторов.  -->

<div class="catalogs__set-free-img swiper" data-name="slider-set">
    <div class="swiper-wrapper">

        {#if $swiper_set_images[0] !== undefined}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src={$swiper_set_images[0]} alt="image" />
        {:else}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src="/static/images/support.webp" alt="image" />
        {/if}

        {#if $swiper_set_images[1] !== undefined}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src={$swiper_set_images[1]} alt="image" />
        {:else}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src="/static/images/support.webp" alt="image" />
        {/if}

        {#if $swiper_set_images[2] !== undefined}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src={$swiper_set_images[2]} alt="image" />
        {:else}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src="/static/images/support.webp" alt="image" />
        {/if}

        {#if $swiper_set_images[3] !== undefined}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src={$swiper_set_images[3]} alt="image" />
        {:else}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src="/static/images/support.webp" alt="image" />
        {/if}

        {#if $swiper_set_images[4] !== undefined}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src={$swiper_set_images[4]} alt="image" />
        {:else}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src="/static/images/support.webp" alt="image" />
        {/if}

    </div>

    <div
        class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
    >
        <span
            class="swiper-pagination-bullet swiper-pagination-bullet-active"
            aria-current="true"
        ></span>
    </div>
    <span class="swiper-notification" aria-live="assertive" aria-atomic="true"
    ></span>

    <div class="swiper-navigation__arrow arrow--prev">
        <svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.19929 8.38719L10.8173 1.334C12.1383 0.365227 14 1.30861 14 2.94681L14 17.0532C14 18.6914 12.1383 19.6348 10.8173 18.666L1.19929 11.6128C0.10959 10.8137 0.10959 9.1863 1.19929 8.38719Z"
                fill="currentColor"
            />
        </svg>
    </div>
    <div class="swiper-navigation__arrow arrow--next">
        <svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.8007 11.6128L3.18273 18.666C1.86167 19.6348 1.74295e-07 18.6914 2.97976e-07 17.0532L1.36298e-06 2.94681C1.48666e-06 1.30861 1.86167 0.365227 3.18273 1.334L12.8007 8.38719C13.8904 9.1863 13.8904 10.8137 12.8007 11.6128Z"
                fill="currentColor"
            />
        </svg>
    </div>
</div>
