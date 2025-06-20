<script>
    import _ from "lodash";
    import {
        is_not_optional_slot_filled,
        chosen_set_type_id,
        chosen_slots,
        render_in_progress,
        render_task,
        render_task_result_data,
        show_products_catalog,
        filters,
        // curr_chosen_sku,
        similar_product_sets,
        show_render_results_sliders,
        getCookie,
        getUserNumberFavouriteSets,
        getSimilarProductSets,
        product_set_data_for_rendering,
        user_data,
        show_go_to_video_button,
        go_to_video_button_is_scrolled,
        go_to_interactive_button_is_scrolled,
        show_go_to_interactive_photos_button,
        progress_render_task_result,
        swiper_images,
        update_swiper,
        go_to_first_swiper_slide,
        is_admin_user,
        is_set_deleted,
    } from "./stores";
    import { afterUpdate, onMount } from "svelte";

    /**
     * Проверяет доступность кнопки "Stylum"
     */
    let stylum_button_is_active = true;

    /**
     * Показывает максимальное количество изображений сета, которое может быть получено во время рендеринга
     */
    let max_set_images_number = 5;

    async function isActiveStylumButton() {
        setInterval(async function () {
            try {
                const raspredelytor_resp = await fetch(
                    `https://api.stylum.ai/status/user/stylum/${$user_data.email.replace("@", "%40")}`,
                );

                if (!raspredelytor_resp.ok) {
                    throw new Error(`Error: ${raspredelytor_resp.status}`);
                }

                let is_active_data = await raspredelytor_resp.json();
                stylum_button_is_active = is_active_data.status;
            } catch (error) {
                stylum_button_is_active = false;
            }
        }, 3000);
    }

    onMount(async () => {
        // Если пользователь авторизован, то проверяем доступность кнопки "Stylum"
        // if ($is_authenticated) {
        //     await isActiveStylumButton();
        // }
    });

    /**
     * Получает результаты выполнения задачи на рендеринг
     * @param {string} render_task_id - идентификатор задачи на рендерениг
     */
    async function getRenderTaskResultProgress(render_task_id) {
        fetch(`https://api.stylum.ai/status/progress/task/${render_task_id}`)
            .then((progress_resp) => {
                if (!progress_resp.ok) {
                    console.log(
                        "Распределятор пока не создал задачу на рендеринг.",
                    );

                    return;
                }
                return progress_resp.json();
            })
            .then((data) => {
                $progress_render_task_result.progressbar_images_type =
                    data.progress.cameraNum;
                $progress_render_task_result.progress_images =
                    data.progress.camera;
                $progress_render_task_result.progress_video =
                    data.progress.video;
                $progress_render_task_result.progress_sequences =
                    data.progress.panorama;
                console.log($progress_render_task_result);
            })
            .catch((error) => {
                console.log(`${error}`);
            });
    }

    async function getRenderTaskResult(render_task_id) {
        const resp = await fetch(
            "/render_tasks/get_task_result?" +
                new URLSearchParams({ id: render_task_id }).toString(),
        );

        if (!resp.ok) {
            throw new Error(`Error: ${resp.status}`);
        }

        if (resp.status == 200 || resp.status == 206) {
            const data = await resp.json();
            render_task_result_data.set(data);
        }

        return resp.status == 200;
    }

    function updateSwiperImages() {
        for (
            let image_idx = 0;
            image_idx < max_set_images_number;
            image_idx++
        ) {
            // Если новое изображение сета существует, и оно не равно текущему изображению на свайпере, то запоминаем это изображение и обновляем свайпер
            if (
                $render_task_result_data.images[image_idx] !== undefined &&
                $swiper_images[image_idx] !==
                    $render_task_result_data.images[image_idx]
            ) {
                $swiper_images[image_idx] =
                    $render_task_result_data.images[image_idx];
                update_swiper.set(true);
            }
        }
    }

    /**
     * Обрабытывает результаты задачи на рендеринг и, возвращая промиз об успешном выполнении задачи (см. подробнее - https://learn.javascript.ru/promise)
     * @returns {Promise<boolean>} - промиз об успешном выполнении задачи
     */
    function processRenderTaskResults() {
        return new Promise((resolve) => {
            let process_render_task_result_data = setInterval(
                async function () {
                    // Делаем запрос на получение данных результата задачи на рендеринг
                    let got_all_render_task_result_data =
                        await getRenderTaskResult($render_task.id);

                    // Делаем запрос на получение данных для прогресс-баров результата задачи на рендеринг
                    // await getRenderTaskResultProgress($render_task.id);

                    // Обновляем изображения в свайпере
                    updateSwiperImages();

                    // Если получены все результаты рендеринга, то прекращаем запросы и отмечаем, что рендеринг закончен
                    if (got_all_render_task_result_data) {
                        render_in_progress.set(false);
                        clearInterval(process_render_task_result_data);
                        resolve(got_all_render_task_result_data);
                    }
                },
                1000,
            );
        });
    }

    async function handleStylumClick() {
        // Отмечаем, что после нажатия на кнопку "Stylum" сет не удален. Это нужно, чтобы корректно отображать кнопки "Approve the set" и "Delete the set" после получения результатов рендеринга
        is_set_deleted.set(false);

        // Отмечаем, обязательный слот не заполнен. Нужно, чтобы убрать показ кнопки "Stylum" после нажатия на нее
        is_not_optional_slot_filled.set(false);

        // Отмечаем, что каталог товаров больше показывать не нужно
        show_products_catalog.set(false);

        // Отмечаем, что нужно показывать слайдеры с результатами рендеринга
        show_render_results_sliders.set(true);

        // Отмечаем, что начался процесс рендеринга
        render_in_progress.set(true);

        // Определяем данные товаров, необходимые для создания задачи на рендеринг
        $product_set_data_for_rendering = {
            chosen_set_type_id: $chosen_set_type_id, // Идентификатор типа сета
            sku: curr_chosen_sku, // Массив артикулов товаров, выбранных пользователем
            scene: $render_task_result_data.scene, // Значение сцены берем из результатов рендеринга, при первом создании сета поле "scene" принимает значение пустой строки
        };

        // Получаем значение токена пользователя из куки
        let token = getCookie("token");

        // Создаем новую задачу на рендеринг, отправляя POST-запрос на сервер
        const resp = await fetch("/render_tasks/create_task/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify($product_set_data_for_rendering),
        });

        if (!resp.ok) {
            throw new Error(`Error: ${resp.status}`);
        }

        const data = await resp.json();

        // Сохраняем в стор идентификатор созданной задачи на рендеринг
        render_task.set(data);
        console.log($render_task);

        // Если ранее были получены результаты рендеринга и кнопка "Stylum" нажата повторно,
        // то затираем старые данные и ждем результатов выполнения новой задачи на рендеринг
        render_task_result_data.set({
            id: "",
            scene: "",
            images: [],
            sequences: [],
            videos: [],
            product_set_id: "",
            is_product_set_active: false,
            is_product_set_liked: false,
        });

        // Сбрасываем список данных похожих сетов
        similar_product_sets.set([]);

        // Сбрасываем все фильтры
        filters.set({
            brands: [],
            colors: [],
            materials: [],
            sizes: [],
            decor_categories: [],
            price_asc: false,
            price_desc: false,
            most_popular: false,
            size_asc: false,
            size_desc: false,
        });

        // Сбрасываем чек-поинты прогресс-баров
        progress_render_task_result.set({
            progress_images: 0,
            progressbar_images_type: 5,
            progress_video: 0,
            progress_sequences: 0,
        });

        // Нужно, чтобы кнопки "Modify" и "Delete" на заполненных слотах не отображались
        $chosen_slots
            .filter((slot) => slot.is_chosen)
            .forEach((filled_slot) => {
                filled_slot.show_delete_button = false;
                filled_slot.show_modify_button = false;
                filled_slot.clicked_delete_button = false;
                filled_slot.clicked_modify_button = false;
            });

        chosen_slots.set($chosen_slots);

        // Отмечаем, что кнопки "Video" и "Interactive Photos" не показывать после нажатия на кнопку "Stylum"
        show_go_to_video_button.set(false);
        show_go_to_interactive_photos_button.set(false);

        // Отмечаем, что кнопки "Video" и "Interactive Photos" не проскроллированы и могут быть вновь показаны на странице
        go_to_video_button_is_scrolled.set(false);
        go_to_interactive_button_is_scrolled.set(false);

        // Устанавливаем, что у свайпера текущим активным слайдом является первый слайд после нажатия на кнопку "Stylum"
        go_to_first_swiper_slide.set(true);

        // Заполняем свайпер гифками, которые характеризуют процесс рендринга
        swiper_images.set(
            Array(max_set_images_number).fill("/static/images/stylum.gif"),
        );
        update_swiper.set(true);

        processRenderTaskResults().then(async () => {
            // Отмечаем, обязательный слот заполнен после окончания процесса рендеринга
            is_not_optional_slot_filled.set(true);

            // Обновляем количество сетов пользователя после получения результатов рендеринга
            await getUserNumberFavouriteSets(token);

            // Когда получили результаты рендеринга, делаем запрос на получение похожих сетов товаров
            await getSimilarProductSets(
                $render_task_result_data.product_set_id,
            );
        });
    }

    function getStylumButtonClass() {
        // Если пользователь является админом, то кнопка Stylum активна всегда и нет необходимости менять сет, чтобы отправить его на рендеринг
        if ($is_admin_user) {
            return $is_not_optional_slot_filled ? " js--active" : "";
        }

        //  Если выбран обязательный товар или артикулы товаров, отправленных ранее на рендеринг, не совпадают с артикулами товаров, которые находятся в заполненных слотах, то отображяется кнопка Stylum
        return $is_not_optional_slot_filled &&
            !_.isEqual(curr_chosen_sku, $product_set_data_for_rendering.sku)
            ? " js--active"
            : "";
    }

    let curr_stylum_button_style = "";
    let curr_chosen_sku = [];

    afterUpdate(() => {
        curr_chosen_sku = Array.from(
            $chosen_slots
                .filter((slot) => slot.is_chosen)
                .map((filled_slot) => filled_slot.sku),
        );
        curr_stylum_button_style = getStylumButtonClass();
    });
</script>

<button
    class={`button button--dark${curr_stylum_button_style}`}
    data-button="stylum"
    on:click={() => {
        handleStylumClick();
    }}
    style={`${stylum_button_is_active ? "" : "background: #808080"}`}
    disabled={!stylum_button_is_active}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="15"
        viewBox="0 0 50 15"
        fill="none"
    >
        <path
            d="M8.85264 8.00296C8.85264 8.6804 8.68041 9.27746 8.33595 9.81712C7.99149 10.3568 7.48628 10.7701 6.80884 11.0801C6.14288 11.3787 5.35062 11.5394 4.43206 11.5394C3.32979 11.5394 2.42271 11.3327 1.71082 10.9194C1.20561 10.6209 0.792257 10.219 0.47076 9.72526C0.149264 9.23154 0 8.73781 0 8.26705C0 7.99148 0.0918562 7.76184 0.287051 7.56664C0.482245 7.37145 0.723366 7.27959 1.01042 7.27959C1.25154 7.27959 1.44673 7.35997 1.61896 7.50923C1.77971 7.6585 1.92898 7.88814 2.0438 8.18667C2.18158 8.54262 2.34233 8.84115 2.50308 9.07079C2.66383 9.31191 2.90495 9.50711 3.20349 9.65637C3.50202 9.80564 3.89241 9.88601 4.38613 9.88601C5.05209 9.88601 5.60323 9.72526 6.01658 9.41525C6.42994 9.10523 6.64809 8.71485 6.64809 8.24408C6.64809 7.87666 6.53327 7.57812 6.31512 7.34848C6.08548 7.11884 5.79842 6.94661 5.44248 6.82031C5.08654 6.69401 4.60429 6.56771 4.00723 6.42992C3.20349 6.24621 2.53753 6.02805 1.99787 5.77545C1.45822 5.52284 1.03338 5.17838 0.711884 4.75355C0.390387 4.31723 0.24112 3.77757 0.24112 3.13458C0.24112 2.52603 0.413353 1.97489 0.746332 1.50413C1.07931 1.03337 1.56155 0.665943 2.19306 0.401857C2.82458 0.149252 3.57091 0.0229492 4.43206 0.0229492C5.12098 0.0229492 5.70657 0.103323 6.21178 0.275554C6.7055 0.447784 7.13034 0.665944 7.45184 0.952994C7.78482 1.22856 8.02594 1.5271 8.1752 1.83711C8.32447 2.14713 8.40484 2.44566 8.40484 2.74419C8.40484 3.00828 8.31299 3.2494 8.11779 3.46756C7.9226 3.68572 7.69296 3.78906 7.40591 3.78906C7.14182 3.78906 6.94663 3.72016 6.82032 3.59386C6.68254 3.46756 6.54475 3.2494 6.38401 2.96235C6.17733 2.53751 5.93621 2.21602 5.64916 1.97489C5.36211 1.73377 4.91431 1.61895 4.2828 1.61895C3.69721 1.61895 3.22645 1.74525 2.87051 1.99786C2.51456 2.25046 2.33085 2.56048 2.33085 2.91642C2.33085 3.13458 2.38826 3.32977 2.51456 3.49052C2.64087 3.65127 2.80161 3.78906 3.01977 3.90388C3.23793 4.0187 3.44461 4.11055 3.66277 4.17944C3.88093 4.24834 4.23687 4.34019 4.74208 4.46649C5.37359 4.61576 5.93621 4.77651 6.4529 4.94874C6.95811 5.12097 7.39443 5.33913 7.75037 5.59173C8.10631 5.84434 8.38188 6.16583 8.58856 6.55622C8.7493 6.95809 8.85264 7.44034 8.85264 8.00296Z"
            fill="white"
        ></path>
        <path
            d="M10.7343 3.28393H10.9639V2.03239C10.9639 1.69941 10.9754 1.43533 10.9869 1.24013C11.0099 1.04494 11.0558 0.884189 11.1362 0.746405C11.2165 0.608621 11.3314 0.4938 11.4806 0.401944C11.6299 0.310088 11.8021 0.26416 11.9858 0.26416C12.2499 0.26416 12.491 0.367497 12.6977 0.562692C12.8355 0.688994 12.9274 0.849742 12.9618 1.04494C12.9962 1.24013 13.0192 1.50422 13.0192 1.84868V3.26097H13.777C14.0756 3.26097 14.2937 3.32986 14.4545 3.46765C14.6037 3.60543 14.6841 3.78914 14.6841 4.0073C14.6841 4.28287 14.5693 4.47807 14.3511 4.59289C14.133 4.70771 13.8115 4.76512 13.4096 4.76512H13.0192V8.57715C13.0192 8.89865 13.0307 9.15125 13.0537 9.32348C13.0766 9.49571 13.134 9.64498 13.2374 9.74832C13.3407 9.85166 13.5015 9.90907 13.7196 9.90907C13.8459 9.90907 14.0067 9.8861 14.2133 9.84017C14.42 9.79424 14.5808 9.77128 14.6956 9.77128C14.8678 9.77128 15.0171 9.84017 15.1434 9.97796C15.2812 10.1157 15.3501 10.2765 15.3501 10.4717C15.3501 10.8047 15.1664 11.0573 14.7989 11.241C14.4315 11.4132 13.9148 11.5051 13.2259 11.5051C12.5829 11.5051 12.0892 11.3902 11.7562 11.1836C11.4232 10.9654 11.2051 10.6669 11.1017 10.2765C10.9984 9.8861 10.941 9.38089 10.941 8.7379V4.75363H10.6654C10.3669 4.75363 10.1372 4.68474 9.97647 4.53548C9.81573 4.39769 9.73535 4.21398 9.73535 3.99582C9.73535 3.77766 9.81573 3.59395 9.98796 3.45616C10.1832 3.35282 10.4243 3.28393 10.7343 3.28393Z"
            fill="white"
        ></path>
        <path
            d="M18.0534 11.792L18.2486 11.3327L15.6995 4.90278C15.5388 4.53535 15.4584 4.25978 15.4584 4.09903C15.4584 3.9268 15.5044 3.75457 15.5962 3.60531C15.6881 3.45604 15.8144 3.32974 15.9751 3.23788C16.1359 3.14603 16.2966 3.1001 16.4688 3.1001C16.7674 3.1001 16.997 3.19195 17.1463 3.38715C17.2955 3.58234 17.4333 3.84643 17.5482 4.20237L19.3049 9.31187L20.9698 4.55832C21.0961 4.16793 21.2224 3.86939 21.3257 3.65124C21.4291 3.43308 21.5439 3.28381 21.6587 3.21492C21.7735 3.13454 21.9458 3.1001 22.1639 3.1001C22.3247 3.1001 22.4739 3.14602 22.6117 3.2264C22.7495 3.30677 22.8643 3.42159 22.9447 3.55938C23.0251 3.69716 23.0595 3.84643 23.0595 4.00718C23.0366 4.09903 23.0021 4.23682 22.9562 4.42053C22.9103 4.59276 22.8528 4.77647 22.784 4.96019L20.0742 12.0446C19.8446 12.6646 19.6149 13.1584 19.3853 13.5143C19.1671 13.8702 18.8686 14.1458 18.5012 14.3295C18.1337 14.5247 17.64 14.6166 17.02 14.6166C16.4114 14.6166 15.9521 14.5477 15.6536 14.4214C15.3551 14.2951 15.1943 14.054 15.1943 13.698C15.1943 13.4569 15.2632 13.2732 15.4125 13.1469C15.5618 13.0206 15.7684 12.9517 16.0555 12.9517C16.1703 12.9517 16.2736 12.9632 16.377 12.9976C16.5033 13.0321 16.6181 13.0435 16.7214 13.0435C16.9626 13.0435 17.1463 13.0091 17.2841 12.9402C17.4219 12.8713 17.5482 12.745 17.6515 12.5728C17.7893 12.3891 17.9041 12.125 18.0534 11.792Z"
            fill="white"
        ></path>
        <path
            d="M24.5713 10.2649V1.26302C24.5713 0.84967 24.6631 0.528174 24.8469 0.321497C25.0306 0.103339 25.2832 0 25.5932 0C25.9032 0 26.1558 0.103338 26.351 0.310014C26.5462 0.516691 26.6381 0.838187 26.6381 1.25154V10.2535C26.6381 10.6783 26.5347 10.9883 26.351 11.195C26.1558 11.4017 25.9032 11.505 25.5932 11.505C25.2947 11.505 25.042 11.3902 24.8469 11.1835C24.6631 10.9883 24.5713 10.6783 24.5713 10.2649Z"
            fill="white"
        ></path>
        <path
            d="M34.1681 10.3567V10.0927C33.9155 10.4027 33.6629 10.6668 33.3873 10.8849C33.1117 11.1031 32.8132 11.2523 32.4917 11.3557C32.1702 11.459 31.8028 11.5164 31.3779 11.5164C30.8727 11.5164 30.4249 11.4131 30.0345 11.2064C29.6327 10.9997 29.3341 10.7127 29.116 10.3453C28.8519 9.90894 28.7256 9.26595 28.7256 8.45072V4.34016C28.7256 3.9268 28.8174 3.61679 29.0012 3.41011C29.1849 3.20344 29.4375 3.1001 29.7475 3.1001C30.0575 3.1001 30.3101 3.20344 30.5053 3.41011C30.7005 3.61679 30.7924 3.9268 30.7924 4.34016V7.65846C30.7924 8.14071 30.8383 8.54258 30.9187 8.87556C30.999 9.19706 31.1483 9.46114 31.355 9.64485C31.5616 9.82857 31.8487 9.92042 32.2046 9.92042C32.5491 9.92042 32.8821 9.81709 33.1921 9.61041C33.5021 9.40373 33.7317 9.12816 33.8695 8.79518C33.9844 8.49665 34.0418 7.85366 34.0418 6.8662V4.34016C34.0418 3.9268 34.1336 3.61679 34.3288 3.41011C34.524 3.20344 34.7766 3.1001 35.0866 3.1001C35.3966 3.1001 35.6492 3.20344 35.833 3.41011C36.0167 3.61679 36.1085 3.9268 36.1085 4.34016V10.3567C36.1085 10.7471 36.0167 11.0457 35.8444 11.2409C35.6607 11.4361 35.4311 11.5394 35.144 11.5394C34.857 11.5394 34.6273 11.4361 34.4436 11.2294C34.2599 11.0227 34.1681 10.7356 34.1681 10.3567Z"
            fill="white"
        ></path>
        <path
            d="M45.089 7.46327V10.219C45.089 10.6553 44.9857 10.9768 44.7905 11.1949C44.5953 11.4131 44.3312 11.5164 44.0097 11.5164C43.6997 11.5164 43.4356 11.4016 43.2519 11.1949C43.0567 10.9768 42.9648 10.6553 42.9648 10.219V6.91213C42.9648 6.39544 42.9419 5.98209 42.9074 5.69504C42.873 5.40798 42.7811 5.16686 42.6204 4.98315C42.4596 4.79944 42.2185 4.70758 41.874 4.70758C41.1966 4.70758 40.7488 4.93722 40.5306 5.40798C40.3125 5.87875 40.2091 6.54471 40.2091 7.41734V10.219C40.2091 10.6553 40.1058 10.9768 39.9221 11.1949C39.7269 11.4131 39.4743 11.5279 39.1528 11.5279C38.8428 11.5279 38.5787 11.4131 38.3835 11.1949C38.1883 10.9768 38.085 10.6438 38.085 10.219V4.28275C38.085 3.89236 38.1768 3.59382 38.349 3.39863C38.5328 3.19195 38.7624 3.1001 39.0609 3.1001C39.348 3.1001 39.5776 3.19195 39.7728 3.38715C39.968 3.58234 40.0599 3.83495 40.0599 4.17941V4.3746C40.4158 3.93828 40.8062 3.62827 41.2196 3.42159C41.6329 3.21492 42.0807 3.12306 42.5859 3.12306C43.1026 3.12306 43.5619 3.2264 43.9293 3.43308C44.3082 3.63975 44.6182 3.94977 44.8594 4.3746C45.2038 3.94977 45.5827 3.62827 45.9846 3.43308C46.3865 3.2264 46.8228 3.12306 47.3165 3.12306C47.8791 3.12306 48.3729 3.23788 48.7862 3.45604C49.1996 3.6742 49.4981 3.9957 49.7048 4.40905C49.877 4.78796 49.9689 5.37354 49.9689 6.17728V10.2304C49.9689 10.6668 49.8655 10.9883 49.6703 11.2064C49.4751 11.4246 49.211 11.5279 48.8895 11.5279C48.5795 11.5279 48.3154 11.4131 48.1203 11.1949C47.9251 10.9768 47.8217 10.6438 47.8217 10.219V6.7399C47.8217 6.2921 47.7988 5.93616 47.7643 5.67207C47.7299 5.40799 47.6265 5.17835 47.4543 4.99463C47.2821 4.81092 47.0295 4.71906 46.6965 4.71906C46.4209 4.71906 46.1683 4.79944 45.9157 4.96019C45.6746 5.12093 45.4794 5.33909 45.3416 5.61466C45.1579 5.95912 45.089 6.57915 45.089 7.46327Z"
            fill="white"
        ></path>
    </svg>
</button>
