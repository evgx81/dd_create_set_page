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
* @type {import("svelte/store").Writable<{id: string, is_liked: boolean, is_active: boolean, set_type_id: string, task_id: string, scene: string, images: Array.<string>, sequences: Array.<string>, videos: Array.<string>, products: Array.<{general_category_ids: Array.<string>, sku: string, images: Array.<string>, product_image_for_slot: string, brand: string, name: string, length: number, width: number, height: number, color: string, price: number, is_added_to_chosen_slots: boolean}>}>}
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
 * @type {import("svelte/store").Writable<Array.<{order_num: number, is_chosen: boolean, show_delete_button: boolean, show_modify_button: boolean, clicked_modify_button: boolean, clicked_delete_button: boolean, is_optional: boolean, sku: string, images: Array.<string>, product_image_for_slot: string, brand: string, name: string, length: number, width: number, height: number, color: string, price: number}>>}
 */
export const chosen_slots = writable([]);

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

/**
 * Хранит данные об артикулах товаров, которые пользователь выбрал в сет
 * @type {import("svelte/store").Readable<Array.<string>>}
 */
export const curr_chosen_sku = derived(chosen_slots, chosen_slots => { console.log(chosen_slots); console.log(chosen_slots.filter(slot => slot.is_chosen).map(filled_slot => filled_slot.sku)); return Array.from(chosen_slots.filter(slot => slot.is_chosen).map(filled_slot => filled_slot.sku)) });

// /**
//  * Хранит данные об артикулах товаров, которые пользователь выбрал в сет
//  * @type {import("svelte/store").Writable<Array.<string>>}
//  */
// export const curr_chosen_sku = writable([]);

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
 * @type {import("svelte/store").Writable<{
 *  data: Array.<{
 *      sku: string, 
 *      name: string, 
 *      brand: string, 
 *      country_of_origin: string, 
 *      colors: Array.<string>, 
 *      price: number, 
 *      general_category_ids: Array.<string>, 
 *      length: number, 
 *      width: number, 
 *      height: number, 
 *      images: Array.<string>,
 *      images_for_catalog: Array.<string>,
 *      image_for_slot: string, 
 *      materials: Array.<string>, 
 *      is_added_to_set: boolean, 
 *      size_category_name: string, 
 *      size_category_priority: number, 
 *      amount_in_sets: number, 
 *      category: string}>
 * }>}
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
 * @type {import("svelte/store").Writable<Map.<string, Array.<{
 *      sku: string, 
 *      name: string, 
 *      brand: string, 
 *      country_of_origin: string, 
 *      colors: Array.<string>, 
 *      price: number, 
 *      general_category_ids: Array.<string>, 
 *      length: number, 
 *      width: number, 
 *      height: number, 
 *      images: Array.<string>, 
 *      images_for_catalog: Array.<string>,
 *      image_for_slot: string, 
 *      materials: Array.<string>, 
 *      is_added_to_set: boolean, 
 *      size_category_name: string, 
 *      size_category_priority: number, 
 *      amount_in_sets: number, 
 *      category: string}>
 * >>}
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
 * @type {import("svelte/store").Readable<Array.<{
 *      sku: string, 
 *      name: string, 
 *      brand: string, 
 *      country_of_origin: string, 
 *      colors: Array.<string>, 
 *      price: number, 
 *      general_category_ids: Array.<string>, 
 *      length: number, 
 *      width: number, 
 *      height: number, 
 *      images: Array.<string>,
 *      images_for_catalog: Array.<string>,
 *      image_for_slot: string, 
 *      materials: Array.<string>, 
 *      is_added_to_set: boolean, 
 *      size_category_name: string, 
 *      size_category_priority: number, 
 *      amount_in_sets: number, 
 *      category: string}>>}
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