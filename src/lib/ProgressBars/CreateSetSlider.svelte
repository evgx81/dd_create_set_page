<!-- <script>
    import { afterUpdate, onMount } from "svelte";
    import {
        chosen_slots,
        curr_chosen_slot_num,
        getCookie,
        getUserNumberFavouriteSets,
        is_authenticated,
        product_images,
        render_in_progress,
        render_task_result_data,
        show_product_images,
        is_set_card_page,
        progress_render_task_result,
    } from "./stores";

    /**
     * Cтиль, который нужно выводить на окне, которое лежит поверх слайдера. Нужно, чтобы красиво обработать переходы на разные состояния слайдера.
     * @type {string}
     */
    let curr_style = "js--active"; // Состояние, когда на слайдере ничего не выводится
    let swiper_init = false;
    let set_slider;
    afterUpdate(() => {
        // Определяем текущий стиль окна, которое лежит поверх слайдера с изображениями
        curr_style = getImagesSliderStyle();

        // Сначала инициализируем слайдер с ихображениями
        // if (

        // ) {
        //     // if (curr_style === "js--none") {
        //     const swiperSlider = document.querySelector(
        //         '[data-name="slider-set"]',
        //     );
        //     swiper = new Swiper(swiperSlider, {
        //         effect: "fade",
        //         // init: false,
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
        // });
        // swiper.enable();

        // if (swiper_init === false) {
        // swiper.init();
        // swiper_init = true;
        // }

        // buildSwiperSlider();
        // swiper.update();

        if (
            $render_task_result_data.images.length > 0 ||
            ($show_product_images &&
                $progress_render_task_result.progress_images ===
                    $progress_render_task_result.progressbar_images_type)
        ) {
            buildSwiperSlider();
        }
        // }

        // if (
        //     $render_in_progress &&
        //     $render_task_result_data.images.length === 0
        // ) {
        //     swiper.destroy();
        // }
        // const swiperSliderProductImages = document.querySelector(
        //     '[data-name="slider-set-product-images"]',
        // );

        // const swiperSliderSetImages = document.querySelector(
        //     '[data-name="slider-set-set-images"]',
        // );

        // if (
        //     swiperSliderProductImages === null ||
        //     swiperSliderSetImages === null
        // ) {
        //     return;
        // }

        // if (
        //     ($show_product_images ||
        //         $render_task_result_data.images.length > 0) &&
        //     $progress_render_task_result.progress_images ===
        //         $progress_render_task_result.progressbar_images_type
        // ) {
        //     buildSwiperSlider(swiperSliderProductImages);

        //     set_slider = buildSwiperSlider(swiperSliderSetImages);
        // }

        // if (
        //     $render_in_progress &&
        //     $render_task_result_data.images.length === 0
        // ) {
        //     console.log("Туть");
        //     // swiper_init = false;
        //     set_slider.destroy();
        // }

        // Инициализуем превью галерии изображений в зависимости от текущего стиля окна, лежащего поверх слайдера
        initPreviewImagesGallery(curr_style);
    });

    function buildSwiperSlider() {
        const swiperSlider = document.querySelector('[data-name="slider-set"]');
        swiper = new Swiper(swiperSlider, {
            effect: "fade",
            // init: false,
            fadeEffect: {
                crossFade: true,
            },
            pagination: {
                el: swiperSlider.querySelector(".swiper-pagination"),
                clickable: true,
            },
            navigation: {
                nextEl: swiperSlider.querySelector(".arrow--next"),
                prevEl: swiperSlider.querySelector(".arrow--prev"),
            },
        });
    }

    let swiper;
    // function buildSwiperSlider(swiperSlider) {
    //     swiper = new Swiper(swiperSlider, {
    //         effect: "fade",
    //         // init: false,
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
    //     });
    // }

    function initPreviewImagesGallery(curr_slider_style) {
        const swiperSlider = document.querySelector('[data-name="slider-set"]');
        const pagination = swiperSlider.querySelector(".swiper-pagination");
        let paginationItems = pagination.querySelectorAll(
            ".swiper-pagination-bullet",
        );

        // Если на слайдере нет изображений для вывода, то скрываем превью галерии изображений
        if (curr_slider_style !== "js--none") {
            pagination.classList.remove("js--preview");
            pagination.classList.remove("js--active");
            pagination.classList.remove("js--position");
            pagination.classList.add("js--hidden");
        }
        // В противном случае отображаем превью галерии на экране
        else {
            pagination.classList.remove("js--hidden");
            pagination.classList.add("js--preview");
            pagination.classList.add("js--active");
            pagination.classList.add("js--position");
        }

        // Заполняем превью галерии текущими изображениями, которые отображаются на слайдере
        const slides = swiperSlider.querySelectorAll(".swiper-slide");

        // Если нет данных для вывода изображений на слайдере, то не инициализируем показ слайдов
        if (slides.length === 0) {
            return;
        }

        console.log(slides);

        paginationItems.forEach((item, index) => {
            const image = document.createElement("img");
            image.classList.add("pagination-preview__image");
            image.src = slides[index].src;
            item.insertAdjacentElement("beforeend", image);
        });

        // console.log(pagination);
    }

    // function initPreviewImagesGallery(swiperSlider, curr_slider_style) {
    //     console.log(swiperSlider);
    //     // const swiperSlider = document.querySelector('[data-name="slider-set"]');
    //     const pagination = swiperSlider.querySelector(".swiper-pagination");
    //     let paginationItems = pagination.querySelectorAll(
    //         ".swiper-pagination-bullet",
    //     );

    //     // Если на слайдере нет изображений для вывода, то скрываем превью галерии изображений
    //     if (curr_slider_style !== "js--none") {
    //         pagination.classList.remove("js--preview");
    //         pagination.classList.remove("js--active");
    //         pagination.classList.remove("js--position");
    //         pagination.classList.add("js--hidden");
    //     }
    //     // В противном случае отображаем превью галерии на экране
    //     else {
    //         pagination.classList.remove("js--hidden");
    //         pagination.classList.add("js--preview");
    //         pagination.classList.add("js--active");
    //         pagination.classList.add("js--position");
    //     }

    //     // Заполняем превью галерии текущими изображениями, которые отображаются на слайдере
    //     const slides = swiperSlider.querySelectorAll(".swiper-slide");

    //     // Если нет данных для вывода изображений на слайдере, то не инициализируем показ слайдов
    //     if (slides.length === 0) {
    //         return;
    //     }

    //     console.log(slides);

    //     paginationItems.forEach((item, index) => {
    //         const image = document.createElement("img");
    //         image.classList.add("pagination-preview__image");
    //         image.src = slides[index].src;
    //         item.insertAdjacentElement("beforeend", image);
    //     });

    //     // console.log(pagination);
    // }

    /**
     * Получаем стиль окна, которое лежит поверх слайдера слайдера с изображениями
     */
    function getImagesSliderStyle() {
        let curr_style = "js--active"; // Состояние, когда на слайдере не выводится изображений

        // Состояние, когда на слайдере с изображениями есть изображения для вывода
        // if ($show_product_images || $render_task_result_data.images.length > 0) {
        if (
            ($show_product_images ||
                $render_task_result_data.images.length > 0) &&
            $progress_render_task_result.progress_images ===
                $progress_render_task_result.progressbar_images_type
        ) {
            console.log("Туть");
            curr_style = "js--none"; // Состояние, когда на слайдере выводятся изображения

            // Находим текущий выбранный слот
            let chosen_slot = $chosen_slots.find(
                (slot) => slot.order_num === $curr_chosen_slot_num,
            );

            // Если получены отрендеренные изображения, то на слоте кликнута кнопка "Delete", то показываем изображения сета
            if (
                $render_task_result_data.images.length > 0 &&
                chosen_slot.clicked_delete_button === true
            ) {
                curr_style = "js--none";
            }
            // Если получены отрендеренные изображения, то кликнули на пустой слот, то показываем на слайдере надпись "Here will be photos"
            else if (
                $render_task_result_data.images.length > 0 &&
                chosen_slot.is_chosen === false
            ) {
                curr_style = "js--active";
            }
        }
        // Если происходит редеринг, то выводим окно с прогресс-баром
        else if ($render_in_progress) {
            curr_style = "js--hidden";
        }

        return curr_style;
    }

    // Флаг, который показывает, что все результаты рендеринга получены
    $: got_all_render_task_result_data =
        $render_task_result_data.images.length > 0 &&
        $render_task_result_data.videos.length > 0 &&
        $render_task_result_data.sequences.length > 0;

    /**
     * Обработка события, когда пользователь нажимает на лайк у сета на слайдере с изображениями
     * @param {string} set_id - идентификатор сета
     * @param {boolean} is_set_liked - показывает лайкнут ли сет
     */
    async function handleCreateSetSliderLikeClick(set_id, is_set_liked) {
        // Получаем значение токена пользователя из куки
        let token = getCookie("token");

        if (is_set_liked === false) {
            const resp = await fetch(
                "/products/product_sets/preference/set_like?" +
                    new URLSearchParams({ set_id: set_id }).toString(),
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            // Если удалось поставить лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
            if (resp.status == 201) {
                $render_task_result_data.is_product_set_liked = true;
                render_task_result_data.set($render_task_result_data);
            }
        } else {
            const resp = await fetch(
                "/products/product_sets/preference/unset_like?" +
                    new URLSearchParams({ set_id: set_id }).toString(),
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            // Если удалось убрать лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
            if (resp.status == 204) {
                $render_task_result_data.is_product_set_liked = false;
                render_task_result_data.set($render_task_result_data);
            }
        }

        // Получаем обновленное количество лайкнутых сетов
        await getUserNumberFavouriteSets(token);
    }
</script> -->

<!-- <div class="catalogs__set-free-img-wrapper">
    <div class="catalogs__set-free-img swiper" data-name="slider-set">
        {#if $show_product_images}
            <div class="swiper-wrapper">
                {#each $product_images as image}
                    <img class="swiper-slide" src={image} alt="image" />
                {/each}
            </div>
            <div
                class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
            >
                <span
                    class="swiper-pagination-bullet swiper-pagination-bullet-active"
                    aria-current="true"
                ></span>
            </div>
            <span
                class="swiper-notification"
                aria-live="assertive"
                aria-atomic="true"
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
        {:else}
            <div class="swiper-wrapper">
                {#if $progress_render_task_result.progress_images === $progress_render_task_result.progressbar_images_type}
                    {#each $render_task_result_data.images as image}
                        <img class="swiper-slide" src={image} alt="image" />
                    {/each}
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
            <span
                class="swiper-notification"
                aria-live="assertive"
                aria-atomic="true"
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
        {/if}
    </div> -->

    <!-- Этот элемент отвечает за дефолтное состояние или переход на изображений рендеринга. -->
    <!-- Нужно выводить только в том случае, если когда нет изображений, которые нужно вывести на слайдер. -->
    <!-- Это возможно, если не выбран товар и не получены изображения сета или выбран пустой слот  -->

    <!-- Подсказка по стилям -->
    <!--  js--hidden - анимация рендеринга -->
    <!--  js--active - окно, когда выводить на слайдер нечего -->
    <!--  js--none   - есть изображения, которые нужно вывести -->
    <!-- ------------------- -->
    <!-- <div class={`slider-preview ${curr_style}`} data-name="preview-slider">
        <div class="slider-preview__inner">
            <div class="slider-preview__icons">
                <svg
                    class="slider-preview__img-default"
                    width="41"
                    height="40"
                    viewBox="0 0 41 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2.12101 33.6016C0.981971 36.2051 0.249731 37.995 0.0870108 38.3204C0.00565076 38.4832 0.00565083 38.6459 0.00565083 38.8086C-0.0757092 39.5408 0.737891 40.1917 1.38877 39.9476C1.47013 39.9476 3.42277 39.134 6.35173 37.8323L2.12101 33.6016Z"
                        fill="#CCCCCC"
                    />
                    <path
                        d="M6.35181 37.8325C7.97901 37.1817 9.85029 36.3681 11.8843 35.4731L10.1757 33.7645L6.18909 35.4731C6.18909 35.4731 7.40949 34.2527 9.03669 32.6255L7.40949 30.9983C5.78229 32.6255 4.56189 33.8459 4.56189 33.8459C4.56189 33.8459 5.21277 32.3001 6.27045 29.8593L4.48053 28.0693C3.58557 30.1033 2.77197 31.9746 2.12109 33.6018L6.35181 37.8325Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M6.27039 29.859C6.92127 28.3132 7.73487 26.4419 8.62983 24.3265L6.83991 22.5366C6.02631 24.4079 5.21271 26.2792 4.48047 28.0691L6.27039 29.859Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M11.3143 27.0112C9.93116 28.3944 8.54804 29.7775 7.32764 30.9165L8.95484 32.5437C10.1752 31.3233 11.5584 29.9402 12.9415 28.6384L11.3143 27.0112Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M15.7083 31.4048L10.1758 33.7642L11.8843 35.4728C13.6743 34.7405 15.5455 33.927 17.4168 33.1134L15.7083 31.4048Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M39.9533 8.38009C39.9533 6.02065 39.9533 3.57984 39.9533 1.2204C39.9533 1.05768 39.9533 0.894955 39.872 0.732235C39.7092 0.244075 39.3024 0 38.7329 0C36.3735 0 33.9327 0 31.5732 0L33.8513 2.27809C35.1531 2.27809 36.3735 2.27809 37.6752 2.27809C37.6752 3.57985 37.6752 4.80024 37.6752 6.102L39.9533 8.38009Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M40.0349 16.2721C40.0349 14.8076 40.0349 13.4245 40.0349 11.96C40.0349 10.7396 40.0349 9.60055 40.0349 8.38015L37.7568 6.10205C37.7568 8.70557 37.7568 11.3905 37.7568 13.994L40.0349 16.2721Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M26.0408 2.2781C28.6443 2.2781 31.3292 2.2781 33.9327 2.2781L31.6546 0C29.0511 0 26.3662 0 23.7627 0L26.0408 2.2781Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M37.7568 13.9941C37.7568 16.5163 37.7568 19.0385 37.7568 21.642C37.6754 21.642 37.5941 21.642 37.5127 21.642L39.5467 23.676C39.7094 23.5133 39.8721 23.4319 39.9535 23.1878C40.0349 22.9437 40.0349 22.781 40.0349 22.5369C40.0349 20.4216 40.0349 18.3876 40.0349 16.2722L37.7568 13.9941Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M17.3357 0C16.9289 0 16.5221 0.162725 16.3594 0.488165L18.3934 2.52217C18.3934 2.4408 18.3934 2.35945 18.3934 2.2781C20.9155 2.2781 23.4377 2.2781 26.0412 2.2781L23.7631 0C21.7291 0 19.6138 0 17.5798 0C17.4984 0 17.4171 0 17.3357 0Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M16.2777 0.488281C16.1964 0.569641 16.1964 0.650991 16.115 0.732351C16.0336 0.895071 15.1387 2.92907 13.8369 6.02075L15.5455 7.72932C15.7082 7.40388 15.8709 6.99709 15.9523 6.67165C15.9523 7.15981 15.9523 7.64796 15.9523 8.13612L18.2304 10.4142C18.2304 7.81069 18.2304 5.1258 18.2304 2.52228L16.2777 0.488281Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M39.4655 23.6756L37.4315 21.6416C34.828 21.6416 32.1431 21.6416 29.5396 21.6416L31.8176 23.9197C32.6312 23.9197 33.2008 23.9197 33.2008 23.9197L32.2244 24.3265L34.0144 26.1164C36.7806 24.896 38.8146 24.0824 39.3028 23.8383C39.3841 23.757 39.4655 23.6756 39.4655 23.6756Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M16.1152 8.13623C16.1152 10.7398 16.1152 13.4246 16.1152 16.0282L18.3933 18.3062C18.3933 15.7027 18.3933 13.0178 18.3933 10.4143L16.1152 8.13623Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M13.3487 13.2616C14.1623 11.3089 14.9759 9.35627 15.7081 7.72907L13.9996 6.02051C13.3487 7.64771 12.5351 9.519 11.6401 11.553L13.3487 13.2616Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M23.9255 23.8386C27.0172 23.8386 30.1089 23.8386 31.8175 23.8386L29.5394 21.5605C26.9359 21.5605 24.251 21.5605 21.6475 21.5605L23.9255 23.8386Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M32.2244 24.3267L26.6919 26.6861L28.4818 28.476C30.5158 27.5811 32.3871 26.8488 34.0143 26.1166L32.2244 24.3267Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M10.9888 18.7132C11.8024 16.8419 12.616 14.9707 13.3483 13.1807L11.6397 11.4722C10.9075 13.2621 10.0939 15.052 9.28027 17.0046L10.9888 18.7132Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M26.6917 26.605L21.1592 28.9644L22.9491 30.7543C24.8204 29.9407 26.6917 29.1271 28.4816 28.3949L26.6917 26.605Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M18.3929 18.3064L16.1149 16.0283C16.1149 18.0623 16.1149 20.0963 16.1149 22.1303C16.1149 22.2117 16.1149 22.293 16.0335 22.293C15.8708 22.4557 15.5453 22.7812 15.3013 23.0253L16.9285 24.6525C17.3353 24.2457 17.5793 24.0016 17.6607 23.9202C17.7421 23.8389 17.8234 23.8389 17.9048 23.8389C19.532 23.8389 21.8101 23.8389 24.0068 23.8389L21.7287 21.5608C20.5897 21.5608 19.532 21.5608 18.3929 21.5608C18.3929 20.5031 18.3929 19.3641 18.3929 18.3064Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M15.3011 23.1064C14.3248 24.0828 12.8603 25.5473 11.3145 27.0117L12.9417 28.6389C14.5689 27.0117 16.0333 25.5472 16.9283 24.7336L15.3011 23.1064Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M21.2405 28.9639L15.708 31.3233L17.4166 33.0319C19.2878 32.2183 21.0778 31.486 22.949 30.6724L21.2405 28.9639Z"
                        fill="#DBDBDB"
                    />
                    <path
                        d="M8.62976 24.2453C9.362 22.4553 10.1756 20.584 10.9892 18.7128L9.19928 16.9229C8.38568 18.7941 7.65344 20.584 6.83984 22.4553L8.62976 24.2453Z"
                        fill="#DBDBDB"
                    />
                </svg>
                <svg
                    class="slider-preview__img-result"
                    width="41"
                    height="40"
                    viewBox="0 0 41 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2.12101 33.6016C0.981971 36.2051 0.249731 37.995 0.0870108 38.3204C0.00565076 38.4832 0.00565083 38.6459 0.00565083 38.8086C-0.0757092 39.5408 0.737891 40.1917 1.38877 39.9476C1.47013 39.9476 3.42277 39.134 6.35173 37.8323L2.12101 33.6016Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M6.35181 37.8325C7.97901 37.1817 9.85029 36.3681 11.8843 35.4731L10.1757 33.7645L6.18909 35.4731C6.18909 35.4731 7.40949 34.2527 9.03669 32.6255L7.40949 30.9983C5.78229 32.6255 4.56189 33.8459 4.56189 33.8459C4.56189 33.8459 5.21277 32.3001 6.27045 29.8593L4.48053 28.0693C3.58557 30.1033 2.77197 31.9746 2.12109 33.6018L6.35181 37.8325Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M6.27039 29.859C6.92127 28.3132 7.73487 26.4419 8.62983 24.3265L6.83991 22.5366C6.02631 24.4079 5.21271 26.2792 4.48047 28.0691L6.27039 29.859Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M11.3143 27.0112C9.93116 28.3944 8.54804 29.7775 7.32764 30.9165L8.95484 32.5437C10.1752 31.3233 11.5584 29.9402 12.9415 28.6384L11.3143 27.0112Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M15.7083 31.4048L10.1758 33.7642L11.8843 35.4728C13.6743 34.7405 15.5455 33.927 17.4168 33.1134L15.7083 31.4048Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M39.9533 8.38009C39.9533 6.02065 39.9533 3.57984 39.9533 1.2204C39.9533 1.05768 39.9533 0.894955 39.872 0.732235C39.7092 0.244075 39.3024 0 38.7329 0C36.3735 0 33.9327 0 31.5732 0L33.8513 2.27809C35.1531 2.27809 36.3735 2.27809 37.6752 2.27809C37.6752 3.57985 37.6752 4.80024 37.6752 6.102L39.9533 8.38009Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M40.0349 16.2721C40.0349 14.8076 40.0349 13.4245 40.0349 11.96C40.0349 10.7396 40.0349 9.60055 40.0349 8.38015L37.7568 6.10205C37.7568 8.70557 37.7568 11.3905 37.7568 13.994L40.0349 16.2721Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M26.0408 2.2781C28.6443 2.2781 31.3292 2.2781 33.9327 2.2781L31.6546 0C29.0511 0 26.3662 0 23.7627 0L26.0408 2.2781Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M37.7568 13.9941C37.7568 16.5163 37.7568 19.0385 37.7568 21.642C37.6754 21.642 37.5941 21.642 37.5127 21.642L39.5467 23.676C39.7094 23.5133 39.8721 23.4319 39.9535 23.1878C40.0349 22.9437 40.0349 22.781 40.0349 22.5369C40.0349 20.4216 40.0349 18.3876 40.0349 16.2722L37.7568 13.9941Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M17.3357 0C16.9289 0 16.5221 0.162725 16.3594 0.488165L18.3934 2.52217C18.3934 2.4408 18.3934 2.35945 18.3934 2.2781C20.9155 2.2781 23.4377 2.2781 26.0412 2.2781L23.7631 0C21.7291 0 19.6138 0 17.5798 0C17.4984 0 17.4171 0 17.3357 0Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M16.2777 0.488281C16.1964 0.569641 16.1964 0.650991 16.115 0.732351C16.0336 0.895071 15.1387 2.92907 13.8369 6.02075L15.5455 7.72932C15.7082 7.40388 15.8709 6.99709 15.9523 6.67165C15.9523 7.15981 15.9523 7.64796 15.9523 8.13612L18.2304 10.4142C18.2304 7.81069 18.2304 5.1258 18.2304 2.52228L16.2777 0.488281Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M39.4655 23.6756L37.4315 21.6416C34.828 21.6416 32.1431 21.6416 29.5396 21.6416L31.8176 23.9197C32.6312 23.9197 33.2008 23.9197 33.2008 23.9197L32.2244 24.3265L34.0144 26.1164C36.7806 24.896 38.8146 24.0824 39.3028 23.8383C39.3841 23.757 39.4655 23.6756 39.4655 23.6756Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M16.1152 8.13623C16.1152 10.7398 16.1152 13.4246 16.1152 16.0282L18.3933 18.3062C18.3933 15.7027 18.3933 13.0178 18.3933 10.4143L16.1152 8.13623Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M13.3487 13.2616C14.1623 11.3089 14.9759 9.35627 15.7081 7.72907L13.9996 6.02051C13.3487 7.64771 12.5351 9.519 11.6401 11.553L13.3487 13.2616Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M23.9255 23.8386C27.0172 23.8386 30.1089 23.8386 31.8175 23.8386L29.5394 21.5605C26.9359 21.5605 24.251 21.5605 21.6475 21.5605L23.9255 23.8386Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M32.2244 24.3267L26.6919 26.6861L28.4818 28.476C30.5158 27.5811 32.3871 26.8488 34.0143 26.1166L32.2244 24.3267Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M10.9888 18.7132C11.8024 16.8419 12.616 14.9707 13.3483 13.1807L11.6397 11.4722C10.9075 13.2621 10.0939 15.052 9.28027 17.0046L10.9888 18.7132Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M26.6917 26.605L21.1592 28.9644L22.9491 30.7543C24.8204 29.9407 26.6917 29.1271 28.4816 28.3949L26.6917 26.605Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M18.3929 18.3064L16.1149 16.0283C16.1149 18.0623 16.1149 20.0963 16.1149 22.1303C16.1149 22.2117 16.1149 22.293 16.0335 22.293C15.8708 22.4557 15.5453 22.7812 15.3013 23.0253L16.9285 24.6525C17.3353 24.2457 17.5793 24.0016 17.6607 23.9202C17.7421 23.8389 17.8234 23.8389 17.9048 23.8389C19.532 23.8389 21.8101 23.8389 24.0068 23.8389L21.7287 21.5608C20.5897 21.5608 19.532 21.5608 18.3929 21.5608C18.3929 20.5031 18.3929 19.3641 18.3929 18.3064Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M15.3011 23.1064C14.3248 24.0828 12.8603 25.5473 11.3145 27.0117L12.9417 28.6389C14.5689 27.0117 16.0333 25.5472 16.9283 24.7336L15.3011 23.1064Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M21.2405 28.9639L15.708 31.3233L17.4166 33.0319C19.2878 32.2183 21.0778 31.486 22.949 30.6724L21.2405 28.9639Z"
                        fill="#1F2933"
                    />
                    <path
                        d="M8.62976 24.2453C9.362 22.4553 10.1756 20.584 10.9892 18.7128L9.19928 16.9229C8.38568 18.7941 7.65344 20.584 6.83984 22.4553L8.62976 24.2453Z"
                        fill="#1F2933"
                    />
                </svg>
            </div>
            <div
                class="slider-preview__text"
                data-name-preview-text-default="Here will be photos"
                data-name-preview-text-result="Render in progress"
            >
                {#if $render_in_progress}
                    Render in progress
                {:else}
                    Here will be photos
                {/if}
            </div>
        </div>
    </div> -->

    <!-- {#if ($is_set_card_page || got_all_render_task_result_data) && $is_authenticated}
        <div
            class={`like${$render_task_result_data.is_product_set_liked ? " js--active" : ""}`}
            data-name="like"
            on:click={() =>
                handleCreateSetSliderLikeClick(
                    $render_task_result_data.product_set_id,
                    $render_task_result_data.is_product_set_liked,
                )}
        >
            <div class="like__inner">
                {#if $render_task_result_data.is_product_set_liked}
                    <img
                        src="/static/images/like-active.svg"
                        alt="like"
                        class="like__img like__img--active"
                    />
                {:else}
                    <img
                        src="/static/images/like.svg"
                        alt="like"
                        class="like__img"
                    />
                {/if}
            </div>
        </div>
    {/if} -->

    <!-- <form class="download" data-name="input-file-parent">
        <input
            type="file"
            name="slider-file"
            id="slider-file"
            hidden=""
            required=""
            accept="image/png, image/jpeg, image/heic"
            class="download__input"
            data-name="input-upload-file"
        />
        <label
            for="slider-file"
            data-text-result="Download pictures for free"
            data-name="label-text"
            class="download__label">Download pictures for 1$</label
        >
    </form> -->
</div>

<!--      -->

<!--     <div class="catalogs__set-free-img swiper" data-name="slider-set">
        <div class="swiper-wrapper">
            {#each curr_slider_images as image}
                svelte-ignore a11y-img-redundant-alt
                <img class="swiper-slide" src={image} alt="image" />
            {/each}
        </div>
        <div
            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
        >
            <span
                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                aria-current="true"
            ></span>
        </div>
        <span
            class="swiper-notification"
            aria-live="assertive"
            aria-atomic="true"
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


    // Если пользователь перешел на страницу карточки сета, то инициализируем перелистывание изображений
    // на слайдере результатов рендеринга только после того, как подрузили данные сета.
    // Если так не делать, то на превью изображений внизу слайдера будут выводиться пустые изображения
    // if ($is_set_card_page && $render_task_result_data.images.length > 0) {
    //     initCreateSetSlider();
    // }

    // // Если пользователь перешел на страницу создания сета, то сразу инициализируем перелистывание
    // // изображений на слайдере результатов рендеринга
    // if (!$is_set_card_page) {
    //     initCreateSetSlider();
    // }

    // if (curr_slider_images.length > 0) {
    //     currentSwiper.update();
    //     // const swiperSlider = document.querySelector(
    //     //     '[data-name="slider-set"]',
    //     // );

    //     // const pagination = swiperSlider.querySelector(".swiper-pagination");

    //     // const paginationItems = pagination.querySelectorAll(
    //     //     ".swiper-pagination-bullet",
    //     // );
    //     // // paginationItems.length = 0

    //     // paginationItems.forEach((item, index) => {
    //     //     const image = document.createElement("img");
    //     //     image.classList.add("pagination-preview__image");

    //     //     image.src = curr_slider_images[index];

    //     //     if (!currentSwiper.slides.includes(image)) {
    //     //         item.insertAdjacentElement("beforeend", image);
    //     //     }
    //     // });
    // }

    // curr_slider_images.forEach((item, index) => {
    //     const image = document.createElement("img");
    //     image.classList.add("pagination-preview__image");

    //     image.src = curr_slider_images[index];

    //     if (!currentSwiper.slides.includes(image)) {
    //         paginationItems.insertAdjacentElement("beforeend", image);
    //     }
    // });

    // currentSwiper.update();
    // console.log(curr_slider_images); --> -->
