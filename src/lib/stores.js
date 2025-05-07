import { derived, writable } from "svelte/store";
import sortBy from "lodash.sortby";
import _, { orderBy } from 'lodash';

/**
* Показывает, является ли текущая страниц
* @type {import("svelte/store").Writable<boolean>}
*/
export const is_set_card_page = writable(true);

// ---------------------------
// Начало данных карточки сета
// ---------------------------

/**
* Данные сета
* @type {import("svelte/store").Writable<{id: string, is_liked: boolean, is_active: boolean, set_type_id: string, task_id: string, scene: string, images: Array.<string>, sequences: Array.<string>, videos: Array.<string>, products: Array.<{general_category_ids: Array.<string>, sku: string, images: Array.<string>, brand: string, name: string, length: number, width: number, height: number, color: string, price: number, is_added_to_chosen_slots: boolean}>}>}
*/
export const set_data = writable({ id: "", is_liked: false, is_active: false, set_type_id: "", task_id: "", products: [], scene: "", images: [], sequences: [], videos: [] });


// --------------------------
// Конец данных карточки сета
// --------------------------

/**
 * Хранит о данные о сетах пользователя
 * @type {import("svelte/store").Writable<{email: string, is_stuff: boolean}>}
 */
export const user_data = writable({ email: "", is_stuff: false });

/**
* Показывает, авторизован ли пользователь
* @type {import("svelte/store").Readable<boolean>}
*/
export const is_authenticated = derived(user_data, ($user_data) => {
    return $user_data.email !== "";
});

/**
* Показывает, обладает ли пользователь правами администратора - вводить поле сцены и одобрять вывод созданных сетов в каталоге товаров
* @type {import("svelte/store").Readable<boolean>}
*/
export const is_admin_user = derived(user_data, ($user_data) => {
    return $user_data.is_stuff;
});


/**
 * Получает значение ключа из куки
 * @param {string} name - значение ключа
 */
export const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '')
}



/**
* Количество сетов лайкнутых пользователем
* @type {import("svelte/store").Writable<{number_of_favourite_sets: number}>}
*/
export const number_of_favourite_sets_data = writable({ number_of_favourite_sets: 0 });

/**
 * Получает и сохраняет в стор количество лайкнутых сетов пользователем
 * @param {string} token - значение токена пользователя
 */
export async function getUserNumberFavouriteSets(token) {
    try {
        const resp = await fetch("/users/user/favourite_sets/", {
            headers: {
                Authorization: token,
            },
        });
        if (!resp.ok) {
            throw new Error(`Response status: ${resp.status}`);
        }

        const data = await resp.json();
        number_of_favourite_sets_data.set(data);
    } catch (error) {
        console.error(error.message);
    }
}



/**
 * Получает и сохраняет в стор похожие сеты товаров
 * @param {string} product_set_id - идентификатор сета на рендерениг
 */
export async function getSimilarProductSets(product_set_id) {
    return fetch(
        "/products/product_sets/similar_sets?" +
        new URLSearchParams({
            set_id: product_set_id,
        }).toString(),
    )
        .then(async (r) => await r.json())
        .then((r) => {
            similar_product_sets.set(r);
        })
        .catch((error) => {
            console.log(error);
            similar_product_sets.set([]);
        });
}






// --------------------
// Начало данных сетов |
// --------------------

/**
 * Хранит данные типов сетов
 *  @type {import("svelte/store").Writable<Array.<{id: string, set_type_image: string, general_categories_popup_images: Array.<string>}>>}
 */
export const set_types_popup = writable([]);

/**
 * Хранит данные о типах сета в хедере
 * @type {import("svelte/store").Writable<Array.<{id: string, image: string}>>}
 */
export const page_header_data = writable([])

/**
 * Хранит идентификатор выбранного типа сета
 * @type {import("svelte/store").Writable<string>}
 */
export const chosen_set_type_id = writable("");

// -------------------
// Конец данных сетов |
// -------------------

/**
 * Хранит данные о товарах, которые пользователь выбрал в сет
 * @type {import("svelte/store").Writable<Array.<{order_num: number, is_chosen: boolean, show_delete_button: boolean, show_modify_button: boolean, clicked_modify_button: boolean, clicked_delete_button: boolean, is_optional: boolean, sku: string, images: Array.<string>, brand: string, name: string, length: number, width: number, height: number, color: string, price: number}>>}
 */
export const chosen_slots = writable([]);

// /**
//  * Хранит изображения, выводимые на слайдер создания сета
//  * @type {import("svelte/store").Writable<Array.<string>>}
//  */
// export let product_images = writable([]);

// /**
//  * Показывает, нужно ли отображать изображения товара на слайдер создания сета 
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export let show_product_images = writable(false);

// /**
//   * Текущие изображения товара для свайпера
//   * @type {import("svelte/store").Writable.<Array.<string>>}
//   */
// export const swiper_product_images = writable([]);

// /**
//   * Текущие изображения сета для свайпера
//   * @type {import("svelte/store").Writable.<Array.<string>>}
//   */
// export const swiper_set_images = writable([]);

/**
  * Показывает, что свайпер с изображениями может быть инициализирован
  * @type {import("svelte/store").Writable.<boolean>}
  */
export const swiper_with_set_images_can_be_shown = writable(false);


// ***********************************************************************************************

//-------------------------------------------------------
// Начало переменных, характеризующих процесс рендеринга |
// ------------------------------------------------------

/**
 * Хранит данные, которые необходимы для создания задачи на рендеринг
 * @type {import("svelte/store").Writable<{chosen_set_type_id: string, sku: Array.<string>, scene: string}>}
 */
export const product_set_data_for_rendering = writable({ chosen_set_type_id: "", sku: [], scene: "" });

/**
 * Хранит идентификатор задачи на рендеринг
 * @type {import("svelte/store").Writable<{id: string}>}
 */
export const render_task = writable({ id: "" });

/**
 * Хранит результаты задачи на рендеринг
 * @type {import("svelte/store").Writable<{id: string, scene: string, product_set_id: string, is_product_set_active: boolean, is_product_set_liked: boolean, images: Array.<string>, sequences: Array.<string>, videos: Array.<string>}>}
 */
export const render_task_result_data = writable({ id: "", scene: "", product_set_id: "", is_product_set_active: false, is_product_set_liked: false, images: [], sequences: [], videos: [] });

/**
 * Хранит прогресс задачи на рендеринг
 * @type {import("svelte/store").Writable<{progress_images: number, progressbar_images_type: number, progress_video: number, progress_sequences: number}>}
 */
export const progress_render_task_result = writable({ progress_images: 0, progressbar_images_type: 0, progress_video: 0, progress_sequences: 0 });

// /**
//  * Хранит результаты задачи на рендеринг
//  * @type {import("svelte/store").Writable<{version: number, error: number, info: string, task_id: string, progress: {camera: number, cameraNum: number, panorama: number, video: number} }>}
//  */
// export const progress_render_task_result = writable({ version: 0.1, error: 0, info: "Successful", task_id: "", progress: { camera: 5, cameraNum: 5, panorama: 5, video: 5 } });

/*
 * Показывает, идет ли процесс рендеринга изображений
 * @type {import("svelte/store").Writable<boolean>}
 */
export const render_in_progress = writable(false);

/**
 * Хранит о сетах, похожих на тот, что создал пользователь
 * @type {import("svelte/store").Writable<Array.<{id: string, images: Array.<string>, total_price: number, products: Array.<{image:string, price: number}>, is_liked: boolean}>>}
 */
export const similar_product_sets = writable([])


//------------------------------------------------------
// Конец переменных, характеризующих процесс рендеринга |
// -----------------------------------------------------

// ***********************************************************************************************

// -------------------------------------------------------------
// Начало переменных, которые отвечают за вывод кнопки "Stylum" |
// -------------------------------------------------------------


/**
 * Показывает, заполнен ли обязательный слот
 * @type {import("svelte/store").Writable<boolean>}
 */
export const is_not_optional_slot_filled = writable(false);

// /**
//  * Хранит данные об артикулах товаров, которые пользователь выбрал в сет
//  * @type {import("svelte/store").Readable<Array.<string>>}
//  */
// export const curr_chosen_sku = derived(chosen_slots, ($chosen_slots) => Array.from($chosen_slots.filter(slot => slot.is_chosen).map(filled_slot => filled_slot.sku)));

/**
 * Хранит данные об артикулах товаров, которые пользователь выбрал в сет
 * @type {import("svelte/store").Writable<Array.<string>>}
 */
export const curr_chosen_sku = writable([]);

// ------------------------------------------------------------
// Конец переменных, которые отвечают за вывод кнопки "Stylum" |
// ------------------------------------------------------------


// ***********************************************************************************************

/**
 * Показывает, нужно ли показывать каталог товаров
 * @type {import("svelte/store").Writable<boolean>}
 */
export let show_products_catalog = writable(false);


export let show_render_results_sliders = writable(true);


/**
 * Хранит данные о товарах общей категории каталога
 * @type {import("svelte/store").Writable<{data: Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>}>}
 */
export const products = writable({ data: [] });


/**
 * Хранит текущий номер строки слота, на который нажал пользователь
 * @type {import("svelte/store").Writable<number>}
 */
export const curr_chosen_slot_num = writable(1);

/**
 * Хранит данные о компонентах (укрупненных категориях), входящих в состав сета
 * @type {import("svelte/store").Writable<Array.<{general_category_name: string, general_category_display_name: string, general_category_id: string, image_url: string, is_optional: boolean, order_num: number}>>}
 */
export const slots = writable([]);

/**
 * Хранит данные о компонентах (укрупненных категориях), входящих в состав сета, отсортированными по порядку вывода
 * @type {import("svelte/store").Readable<Array.<{general_category_name: string, general_category_display_name: string, general_category_id: string, image_url: string, is_optional: boolean, order_num: number}>>}
 */
export const slots_sorted = derived(slots, (slots) => sortBy(slots, "order_num"));


/**
 * Хранит данные о компонентах (укрупненных категориях), входящих в состав сета
 * @type {import("svelte/store").Writable<Map.<string, Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>>>}>>}
 */
export const cached_general_categories_products = writable(new Map());



// -------------------------------
// Начало общей информация о сете |
// -------------------------------

/**
 * Хранит общее количество товаров в сете
 * @type {import("svelte/store").Writable<number>}
 */
export const total_amount_of_products = writable(0);

/**
 * Хранит общую цену товаров в сете
 * @type {import("svelte/store").Writable<number>}
 */
export const total_price = writable(0);

/**
 * Хранит массив изображений, которые отображаются на свайпере изображений
 * @type {import("svelte/store").Writable<Array.<string>>}
 */
export const swiper_images = writable([]);

/**
 * Флаг, указывающий на то, нужно ли обновить слайдер
 * @type {import("svelte/store").Writable<boolean>}
 */
export const update_swiper = writable(false);

/**
 * Флаг, указывающий на то, нужно ли слайдеру перейти на первый слайд
 * @type {import("svelte/store").Writable<boolean>}
 */
export const go_to_first_swiper_slide = writable(false);

// ------------------------------
// Конец общей информация о сете |
// ------------------------------


// ***********************************************************************************************

// --------------------------
// Начало фильтрации товаров |
// --------------------------


function filterProducts(products, filters) {
    let filtered_products = [...products];

    // Фильтруем по бренду
    if (filters.brands.length > 0) {
        filtered_products = filtered_products.filter((product) =>
            filters.brands.includes(product.brand),
        );
    }

    // Фильтруем по цвету
    if (filters.colors.length > 0) {
        filtered_products = filtered_products.filter((product) =>
            filters.colors.every((color) => product.colors.includes(color)),
        );
    }

    // Фильтруем по материалу
    if (filters.materials.length > 0) {
        filtered_products = filtered_products.filter((product) =>
            filters.materials.every((material) =>
                product.materials.includes(material),
            ),
        );
    }

    // Фильтруем по размеру
    if (filters.sizes.length > 0) {
        filtered_products = filtered_products.filter((product) =>
            filters.sizes.includes(product.size_category_priority),
        );
    }

    // Фильтруем по типу категории, если выбранная категория товаров является декором
    if (filters.decor_categories.length > 0) {
        filtered_products = filtered_products.filter((product) =>
            filters.decor_categories.includes(product.category),
        );
    }

    if (filters.price_asc) {
        // Сортируем в порядке увеличения цены товаров
        filtered_products = _.orderBy(filtered_products, "price");
    } else if (filters.price_desc) {
        // Сортируем в порядке уменьшения цены товаров
        filtered_products = _.orderBy(filtered_products, "price", "desc");
    } else if (filters.most_popular) {
        // Сортируем в порядке уменьшения популярности товаров
        filtered_products = _.orderBy(
            filtered_products,
            "amount_in_sets",
            "desc",
        );
    } else if (filters.size_asc) {
        // Сортируем в порядке увеличения размера товаров
        filtered_products = _.orderBy(
            filtered_products,
            "size_category_priority",
        );
    } else if (filters.size_desc) {
        // Сортируем в порядке уменьшения размера товаров
        filtered_products = _.orderBy(
            filtered_products,
            "size_category_priority",
            "desc",
        );
    }

    return filtered_products;
}

/**
 * Хранит фильтры товаров, выбранные пользователем
 */
export const filters = writable({ brands: [], colors: [], materials: [], sizes: [], decor_categories: [], price_asc: false, price_desc: false, most_popular: false, size_asc: false, size_desc: false });

/**
 * Хранит отфильтрованные товары
 * @type {import("svelte/store").Readable<Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>>}
 */
export const products_filtered = derived([products, filters], ([$products, $filters]) => filterProducts($products.data, $filters));


/**
 * Данные брендов товаров укрупненной категории
 * @type {import("svelte/store").Readable<Array.<string>>}
 */
export const brands = derived(products, (products) => Array.from(new Set(products.data.map(product => product.brand))));

/**
 * Возвращает все уникальные цвета товаров укрупненной категории
 * @param {import("svelte/store").Readable<Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>>} products
 */
export const colors = derived(products, ($products) => {
    let products_colors = [];

    $products.data.forEach(product => {
        product.colors.forEach((color) => {
            if (products_colors.includes(color) === false) products_colors.push(color);
        })
    });

    return products_colors;
});

/**
 * Хранит все уникальные материалы товаров
 * @param {import("svelte/store").Readable<Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>>} products
 */
export const materials = derived(products, ($products) => {
    let products_materials = [];

    $products.data.forEach(product => {
        product.materials.forEach((material) => {
            if (products_materials.includes(material) === false) products_materials.push(material);
        })
    });

    return products_materials;
});

/**
 * Хранит все уникальные размеры товаров
 * @type {import("svelte/store").Readable<Array.<{name: string, priority: number}>>}
 */
export const sizes = derived(products, (products) => sortBy(_.uniqWith(products.data.map(product => ({ name: product.size_category_name, priority: product.size_category_priority })), _.isEqual), "priority", "desc"));


/**
 * Хранит все уникальные категории декора
 * @type {import("svelte/store").Readable<Array.<string>>}
 */
export const decor_categories = derived(products, (products) => Array.from(new Set(products.data.map(product => product.category))));

/**
 * Показывает, нужно ли показывать кнопку "Video" для перехода к слайдеру с видео
 * @type {import("svelte/store").Writable.<boolean>}
 */
export const show_go_to_video_button = writable(false);

/**
 * Показывает, нужно ли показывать кнопку "Interactive photos" для перехода к слайдеру с панорамами
 * @type {import("svelte/store").Writable.<boolean>}
 */
export const show_go_to_interactive_photos_button = writable(false);

/**
 * Показывает, прокрутил ли пользователь кнопку "Video"
 * @type {import("svelte/store").Writable.<boolean>}
 */
export const go_to_video_button_is_scrolled = writable(false);

/**
 * Показывает, прокрутил ли пользователь кнопку "Interactive photos"
 * @type {import("svelte/store").Writable.<boolean>}
 */
export const go_to_interactive_button_is_scrolled = writable(false);

/**
 * Показывает, удален ли сет
 * @type {import("svelte/store").Writable.<boolean>}
 */
export const is_set_deleted = writable(false);

/**
 * Процедура, которая инициализирует перелистывание изображений на слайдере результатов рендеринга
 */
// export const initCreateSetSlider = () => {

//     const buildSwiperSlider = (swiperSliderElement) => {
//         const swiperSlider = swiperSliderElement;
//         const swiperPagination = swiperSlider.querySelector('.swiper-pagination');
//         const swiperArrowNext = swiperSlider.querySelector('.arrow--next');
//         const swiperArrowPrev = swiperSlider.querySelector('.arrow--prev');
//         if (!swiperSlider) return;

//         const currentSwiper = new Swiper(swiperSlider, {
//             effect: "fade",
//             fadeEffect: {
//                 crossFade: true
//             },
//             pagination: {
//                 el: swiperPagination,
//                 clickable: true
//             },
//             navigation: {
//                 nextEl: swiperArrowNext,
//                 prevEl: swiperArrowPrev,
//             }
//         });

//         // Если осуществляется перелистывания слайдера с изображениями товаров или рендеров,
//         // то добавляются дополниетельно стрелки и изображения снизу слайдера
//         if (swiperSlider.dataset.name === "slider-set") {
//             const pagination = swiperSlider.querySelector('.swiper-pagination');
//             const slides = swiperSlider.querySelectorAll('.swiper-slide');

//             // Если нет данных для вывода изображений на слайдере, то не инициализируем показ слайдов
//             if (slides.length === 0) {
//                 return;
//             }

//             const paginationItems = pagination.querySelectorAll('.swiper-pagination-bullet');

//             paginationItems.forEach((item, index) => {

//                 const image = document.createElement("img");
//                 image.classList.add('pagination-preview__image');
//                 image.src = slides[index].src;
//                 item.insertAdjacentElement('beforeend', image);
//             })

//             pagination.classList.add('js--preview');
//             pagination.classList.add('js--active');
//             pagination.classList.add('js--position');
//         }
//     }

//     const slidersParent = document.querySelector('[data-name="slider-parent"]');
//     const swiperSliders = slidersParent.querySelectorAll('.swiper');
//     swiperSliders.forEach((swiperSlider) => buildSwiperSlider(swiperSlider));

// };

export const initProductAndSimilarProductSetSliders = () => {
    const buildSwiperSlider = (swiperSliderElement) => {
        const swiperSlider = swiperSliderElement;
        if (!swiperSlider) return;

        const currentSwiper = new Swiper(swiperSlider, {
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: swiperSlider.querySelector('.swiper-pagination'),
                clickable: true
            },
        });

        swiperSlider.addEventListener('mousemove', (event) => {
            const rect = swiperSlider.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const width = rect.width;

            const numberOfSlides = currentSwiper.slides.length;
            const partWidth = width / numberOfSlides;
            const slideIndex = Math.floor(x / partWidth);

            currentSwiper.slideTo(slideIndex);
        });

        // В момент ухода курсора со слайдера, отображаем первое изображение на слайдере
        swiperSlider.addEventListener('mouseleave', () => currentSwiper.slideTo(0));
    }

    // Находим все слайдеры с товарами и сетами, похожими на данный товар и инициализируем их
    const slidersParents = document.querySelectorAll('[data-name="slider-parent-product-or-similar_set"]');

    slidersParents.forEach((slidersParent) => {
        const swiperSliders = slidersParent.querySelectorAll('.swiper');
        swiperSliders.forEach((swiperSlider) => buildSwiperSlider(swiperSlider));
    });
};

// -------------------------
// Конец фильтрации товаров |
// -------------------------

// ***********************************************************************************************



// /**
//  * Хранит артикулы товаров, которые были переданы на рендеринг
//  * @type {import("svelte/store").Writable<Array.<string>>}
//  */
// export const sku_for_rendering = writable([]);
// /**
//  * Показывает, продолжается ли рендеринг о текущем состоянии рендринга видео
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export const rendering_of_video_in_progress = writable(false);

// export const to_hide_preview_video = writable(false);

// /**
//  * Показывает, получены ли все изображения сета
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export const got_result_images = writable(false);

// /**
//  * Показывает, получено ли видео сета
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export const got_result_video = writable(false);

// /**
//  * Показывает, получены ли последовательности сета
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export const got_result_sequences = writable(false);

// export const got_all_render_results = writable(false);




// export const chosen_slots_ordered = derived([chosen_slots, slots, curr_chosen_slot_num], ([chosen_slots, slots, curr_chosen_slot_num]) => {

//     let chosen_filled_slot = chosen_slots.find(
//         (curr_slot) =>
//             curr_slot.is_chosen === true &&
//             curr_slot.order_num === curr_chosen_slot_num &&
//             slots.find((slot) => slot.order_num === curr_slot.order_num)
//                 .is_optional === true,
//     );

//     if (chosen_filled_slot) {
//         chosen_slots = chosen_slots.filter(slot => slot !== chosen_filled_slot);
//         chosen_slots.splice(1, 0, chosen_filled_slot);
//     }

//     return chosen_slots;
// })





// ----------------------------------------------------------------------------------
// Начало переменных, которые отвечают за вывод кнопок "Modify" и "Delete" на слотах |
// ----------------------------------------------------------------------------------

// Следующие флаги нужны, чтобы кнопки на заполненных слотах не отображались во время рендринга.
// До нажатия на кнопку "Stylum" эти флаги ни имеют смысла is_modified- кликнув на заполненный слот выведется только кнопка "Delete" и
// процесс отображения кнопок регулируется локальными флагами слота.
// Как только получили отрендернные изображения отображение кнопок регулируется глобальными флагами. 


// /**
//  * Показывает, нужно ли отображать кнопку "Delete" (нужно, чтобы она скрывалась, когда идет рендеринг)
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export const show_delete_button = writable(true);

// /**
//  * Показывает, нужно ли отображать кнопку "Modify"
//  * @type {import("svelte/store").Writable<boolean>}
//  */
// export const show_modify_button = writable(false);


// ---------------------------------------------------------------------------------
// Конец переменных, которые отвечают за вывод кнопок "Modify" и "Delete" на слотах |
// ---------------------------------------------------------------------------------

// export const render_task_results = createRenderTaskResults();


/**
 * Хранит идентификатор задачи на рендеринг
 */
// export let render_task_results_promise = render_task_results.init();


// const sleep = async (func, p1, p2, ms) => await new Promise((r) => setTimeout(func, ms, p1, p2));

// export let getRenderTaskResults = async (render_task_results_data, render_task_id) => {
//     console.log(render_task_id);
//     console.log(render_task_results_data);

//     // Обработка вывода прогрессбара изображений товара
//     // const sliderPreloader = document.querySelector(
//     //     '[data-name="preview-slider"]',
//     // );
//     // console.log(sliderPreloader);
//     // const sliderPreloaderText = sliderPreloader.querySelector(
//     //     "[data-name-preview-text-default]",
//     // );
//     // sliderPreloader.classList.add(CLASSES.HIDDEN);
//     // sliderPreloaderText.textContent =
//     //     sliderPreloaderText.dataset.namePreviewTextResult;

//     return fetch(
//         "render_tasks/get_task_result?" +
//         new URLSearchParams({
//             id: render_task_id,
//         }).toString(),
//     )
//         .then(async (response) => {

//             if (response.status == 200) {
//                 await response.json().then((result) => { render_task_results_data = { ...result }, console.log(render_task_results_data); create_set_slider_images.set(render_task_results_data.images);})
//             }
//             else if (response.status == 206) {
//                 await response.json().then((result) => render_task_results_data = { ...result })

//                 await sleep(getRenderTaskResults, 3000, render_task_results_data, render_task_id);
//                 // setTimeout(getRenderTaskResults, 3000, render_task_results_data, render_task_id);
//                 // new Promise(resolve => setTimeout(resolve, getRenderTaskResults(render_task_results, render_task_id), 3000));
//             }
//             else {
//                 await sleep(getRenderTaskResults, render_task_results_data, render_task_id, 3000);
//                 // setTimeout(getRenderTaskResults, 3000, render_task_results_data, render_task_id);
//             }
//         })

// }



// export let filter_brands = writable([]);
// export let filter_colors = writable([]);
// export let filter_materials = writable([]);
// export let filter_sizes = writable([]);
// export let filter_decor_categories = writable([]);

// export let price_asc = writable(false);
// export let price_desc = writable(false);
// export let most_popular = writable(false);
// export let size_asc = writable(false);
// export let size_desc = writable(false);

// function filterProducts($products, brand, color, material, size, decor_categories, price_asc, price_desc, most_popular, size_asc, size_desc) {

//     // Получаем массив текущих товаров укрупненной категории
//     let filtered_products = $products.data;


//     // Фильтруем по бренду
//     if (brand.length > 0) {
//         filtered_products = filtered_products.filter(product => brand.includes(product.brand));
//         // filtered_products.splice(0, filtered_products.length, ...filtered_products.filter(product => brand.includes(product.brand)));
//     }

//     // Фильтруем по цвету
//     if (color.length > 0) {
//         // filtered_products = getProductsFilteredByColors(filtered_products, $filters.color);
//         filtered_products = filtered_products.filter(product => product.colors.every(color => color.includes(color)));
//     }

//     // Фильтруем по материалу
//     if (material.length > 0) {
//         // filtered_products = getProductsFilteredByMaterials(filtered_products, $filters.material);
//         filtered_products = filtered_products.filter(product => product.materials.every(material => material.includes(material)));
//     }

//     // Фильтруем по размеру
//     if (size.length > 0) {
//         filtered_products = filtered_products.filter(product => size.includes(product.size_category_priority));
//     }


//     if (decor_categories.length > 0) {
//         filtered_products = filtered_products.filter(product => decor_categories.includes(product.category));
//     }

//     // Сортируем в порядке увеличения цены товаров
//     if (price_asc) {
//         filtered_products = orderBy(filtered_products, "price");
//     }

//     // Сортируем в порядке уменьшения цены товаров
//     if (price_desc) {
//         filtered_products = orderBy(filtered_products, "price", "desc");
//     }

//     // Сортируем в порядке уменьшения популярности товаров
//     if (most_popular) {
//         filtered_products = orderBy(filtered_products, "amount_in_sets", "desc");
//     }

//     // Сортируем в порядке увеличения размера товаров
//     if (size_asc) {
//         filtered_products = orderBy(filtered_products, "size_category_priority");
//     }

//     // Сортируем в порядке уменьшения размера товаров
//     if (size_desc) {
//         filtered_products = orderBy(filtered_products, "size_category_priority", "desc");
//     }

//     // // Фильтруем по размеру
//     // if ($filters.size.length > 0) {
//     //     filtered_products = filtered_products.filter(product => $filters.size.includes(product.size_category_priority));
//     // }

//     // // Сортируем в порядке увеличения цены товаров
//     // if ($filters.price_asc) {
//     //     filtered_products = sortBy(filtered_products, "price");
//     // }

//     // // Сортируем в порядке уменьшения цены товаров
//     // if ($filters.price_desc) {
//     //     filtered_products = sortBy(filtered_products, "price", "desc");
//     // }

//     // // Сортируем в порядке уменьшения популярности товаров
//     // if ($filters.most_popular) {
//     //     filtered_products = sortBy(filtered_products, "amount_in_sets", "desc");
//     // }

//     // // Сортируем в порядке увеличения размера товаров
//     // if ($filters.size_asc) {
//     //     filtered_products = sortBy(filtered_products, "size_category_priority");
//     // }

//     // // Сортируем в порядке уменьшения размера товаров
//     // if ($filters.size_desc) {
//     //     filtered_products = sortBy(filtered_products, "size_category_priority", "desc");
//     // }

//     let products_data = {
//         data: filtered_products
//     }

//     // console.log(products_data);

//     return products_data;
// }

// /**
//  * Хранит отфильтрованные товары
//  * @type {import("svelte/store").Readable<{data: Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>}>}
//  */
// export let products_filtered = derived([products, filter_brands, filter_colors, filter_materials, filter_sizes, filter_decor_categories, price_asc, price_desc, most_popular, size_asc, size_desc,], ([$products, $brand, $color, $material, $size, $decor_categories, $price_asc, $price_desc, $most_popular, $size_asc, $size_desc]) => filterProducts($products, $brand, $color, $material, $size, $decor_categories, $price_asc, $price_desc, $most_popular, $size_asc, $size_desc));







// /**
//  * Хранит отфильтрованные товары
//  * @type {import("svelte/store").Readable<{data: Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>}>}
//  */
// export let products_filtered = derived([products, filters], ([$products, $filters]) => filterProducts($products, $filters));



// function filterProducts($products, $filters) {

//     // Получаем массив текущих товаров укрупненной категории
//     let filtered_products = $products.data;


//     // Фильтруем по бренду
//     if ($filters.brands.length > 0) {
//         filtered_products = filtered_products.filter(product => $filters.brands.includes(product.brand));
//     }

//     // Фильтруем по цвету
//     if ($filters.colors.length > 0) {
//         // filtered_products = getProductsFilteredByColors(filtered_products, $filters.color);
//         filtered_products = filtered_products.filter(product => product.colors.every(color => color.includes(color)));
//     }

//     // Фильтруем по материалу
//     if ($filters.materials.length > 0) {
//         // filtered_products = getProductsFilteredByMaterials(filtered_products, $filters.material);
//         filtered_products = filtered_products.filter(product => product.materials.every(material => material.includes(material)));
//     }

//     // Фильтруем по размеру
//     if ($filters.sizes.length > 0) {
//         filtered_products = filtered_products.filter(product => size.includes(product.size_category_priority));
//     }


//     if ($filters.decor_categories.length > 0) {
//         filtered_products = filtered_products.filter(product => decor_categories.includes(product.category));
//     }

//     // // Сортируем в порядке увеличения цены товаров
//     // if (price_asc) {
//     //     filtered_products = orderBy(filtered_products, "price");
//     // }

//     // // Сортируем в порядке уменьшения цены товаров
//     // if (price_desc) {
//     //     filtered_products = orderBy(filtered_products, "price", "desc");
//     // }

//     // // Сортируем в порядке уменьшения популярности товаров
//     // if (most_popular) {
//     //     filtered_products = orderBy(filtered_products, "amount_in_sets", "desc");
//     // }

//     // // Сортируем в порядке увеличения размера товаров
//     // if (size_asc) {
//     //     filtered_products = orderBy(filtered_products, "size_category_priority");
//     // }

//     // // Сортируем в порядке уменьшения размера товаров
//     // if (size_desc) {
//     //     filtered_products = orderBy(filtered_products, "size_category_priority", "desc");
//     // }

//     // // Фильтруем по размеру
//     // if ($filters.size.length > 0) {
//     //     filtered_products = filtered_products.filter(product => $filters.size.includes(product.size_category_priority));
//     // }

//     // // Сортируем в порядке увеличения цены товаров
//     // if ($filters.price_asc) {
//     //     filtered_products = sortBy(filtered_products, "price");
//     // }

//     // // Сортируем в порядке уменьшения цены товаров
//     // if ($filters.price_desc) {
//     //     filtered_products = sortBy(filtered_products, "price", "desc");
//     // }

//     // // Сортируем в порядке уменьшения популярности товаров
//     // if ($filters.most_popular) {
//     //     filtered_products = sortBy(filtered_products, "amount_in_sets", "desc");
//     // }

//     // // Сортируем в порядке увеличения размера товаров
//     // if ($filters.size_asc) {
//     //     filtered_products = sortBy(filtered_products, "size_category_priority");
//     // }

//     // // Сортируем в порядке уменьшения размера товаров
//     // if ($filters.size_desc) {
//     //     filtered_products = sortBy(filtered_products, "size_category_priority", "desc");
//     // }

//     let products_data = {
//         data: filtered_products
//     }

//     // console.log(products_data);

//     return products_data;
// }


// /**
//  * Возвращает все уникальные материалы товаров
//  * @param {Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>} products
//  */
// function getMaterials(products) {
//     let products_materials = [];
//     products.forEach(product => {
//         product.materials.forEach((material) => {
//             if (products_materials.includes(material) === false) {
//                 products_materials.push(material);
//             }
//         })
//     });

//     return products_materials;
// }

// export const materials = derived(products, (products) => getMaterials(products.data));



// /**
//  * Возвращает все уникальные цвета товаров
//  * @param {Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean, size_category_name: string, size_category_priority: number, amount_in_sets: number, category: string}>} products
//  */
// function getColors(products) {
//     let products_colors = [];
//     products.forEach(product => {
//         product.colors.forEach((color) => {
//             if (products_colors.includes(color) === false) {
//                 products_colors.push(color);
//             }
//         })
//     });

//     return products_colors;
// }
// export const colors = derived(products, (products) => getColors(products.data));



// -----------------------------
// Начало упорядочивания товаров
// -----------------------------


// /**
//  * Хранит критерии сортировки товаров, выбранные пользователем
//  * @type {import("svelte/store").Writable<{price_asc: boolean, price_desc: boolean, most_popular: boolean, size_asc: boolean, size_desc:boolean}>}
//  */
// export let sorts = writable({ price_asc: false, price_desc: false, most_popular: false, size_asc: false, size_desc: false });

// /**
//  * 
//  * @param {{price_asc: boolean, price_desc: boolean, most_popular: boolean, size_asc: boolean, size_desc:boolean}} $sorts 
//  * @param {Array.<{sku: string, name: string, brand: string, country_of_origin: string, colors: Array.<string>, price: number, general_category_ids: Array.<string>, length: number, width: number, height: number, images: Array.<string>, materials: Array.<string>, is_added_to_set: boolean}>} $products_filtered 
//  * @returns 
//  */
// function sortProducts($sorts, $products_filtered) {

//     let sorted_products = $products_filtered;

//     // Сортируем в порядке увеличения цены товаров
//     if ($sorts.price_asc) {
//         sorted_products = sortBy(sorted_products, "price");
//     }

//     // Сортируем в порядке уменьшения цены товаров
//     if ($sorts.price_desc) {
//         sorted_products = sortBy(sorted_products, "price", "desc");
//     }

//     return sorted_products;
// }

// export const products_sorted = derived([sorts, products_filtered], ([$sorts, $products_filtered]) => sortProducts($sorts, $products_filtered));


// ----------------------------
// Конец упорядочивания товаров
// ----------------------------