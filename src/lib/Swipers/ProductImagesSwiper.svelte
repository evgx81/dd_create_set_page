<script>
    import { swiper_product_images } from "../stores";
</script>

<!-- Иницилизируем два свайпера - для изображений товаров и сетов. Данный механизм нужен для корректной обработки изображений из разных сторов.  -->

<div class="catalogs__set-free-img swiper" data-name="slider-set">
    <div class="swiper-wrapper">
        {#each $swiper_product_images as image}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="swiper-slide" src={image} alt="image" />
        {/each}
    </div>
    <!--  class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal js--preview js--active js--position" -->
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
