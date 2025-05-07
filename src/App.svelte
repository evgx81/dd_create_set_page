<script>
  import { fade } from "svelte/transition";
  import Popup from "./lib/Popup.svelte";
  import Header from "./lib/Header.svelte";
  import CreateSet from "./lib/CreateSet.svelte";
  import ProductCatalog from "./lib/ProductCatalog.svelte";
  import {
    cached_general_categories_products,
    chosen_set_type_id,
    chosen_slots,
    curr_chosen_slot_num,
    getSimilarProductSets,
    go_to_interactive_button_is_scrolled,
    go_to_video_button_is_scrolled,
    is_set_card_page,
    products,
    render_in_progress,
    render_task_result_data,
    set_data,
    show_go_to_interactive_photos_button,
    show_go_to_video_button,
    show_products_catalog,
    show_render_results_sliders,
    similar_product_sets,
  } from "./lib/stores";
  import VideoSlider from "./lib/VideoSlider.svelte";
  import Sequence360Slider from "./lib/Sequence360Slider.svelte";
  import Footer from "./lib/Footer.svelte";
  import MoreLikeThis from "./lib/MoreLikeThis.svelte";
  import MobilePreview from "./lib/MobilePreview.svelte";
  import { afterUpdate, onMount } from "svelte";
  import ButtonTop from "./lib/ButtonTop.svelte";
  import GoToInteractivePhotosButton from "./lib/GoToInteractivePhotosButton.svelte";
  import GoToVideoButton from "./lib/GoToVideoButton.svelte";
  import Progressbar from "./lib/Progressbar.svelte";
  import LoadingDataWindow from "./lib/LoadingDataWindow.svelte";

  let popup_visible = true;
  let show_create_set_page = false;

  /**
   * Обработка события, отправляемого из компонента Popup, когда пользователь
   * выбирает тип сета
   * @param {object} event Событие, отправляемое компоненом
   */
  function handlePopupClick(event) {
    popup_visible = false;
    chosen_set_type_id.set(event.detail.set_type_id);
  }

  /** @type Promise<any> */
  let products_promise;

  /**
   * Идентификатор общей категории, выбранной пользователем
   * @type {string}
   */
  let general_category_id;

  /**
   * Наименование общей категории, выбранной пользователем
   * @type {string}
   */
  let general_category_name;

  function updateIsAddedToSet(products) {
    products.forEach((product) => {
      // Находим слот, на который кликнул пользователь
      let curr_clicked_slot = $chosen_slots.find(
        (slot) => slot.order_num === $curr_chosen_slot_num,
      );

      product.is_added_to_set = product.sku === curr_clicked_slot.sku;
    });

    return products;
  }

  /**
   * Получает все товары выбранной укрупненной категории
   * @param {string} general_category_id Идентификатор укрупненной категории
   */
  async function getProductsForCategory(general_category_id) {
    return fetch(
      "/products/products/products_catalog?" +
        new URLSearchParams({
          category__general_categories__id: general_category_id,
        }).toString(),
    )
      .then(async (r) => await r.json())
      .then((r) => {
        $products.data = [...r];

        // При первом получении товаров добавляем каждому товару свойство, что он не добавлен в сет
        $products.data.forEach((product) => {
          product.is_added_to_set = false;
        });

        // Запоминаем в кеш идентификатор укрупненной категории и соответсвущие ей товары
        $cached_general_categories_products.set(
          general_category_id,
          $products.data,
        );
      });

    // .then((r) => $products.data = [...$products.data, ...r]);

    // if (res.ok) {
    //   return await res.json();
    // } else {
    //   throw new Error("Products data fetch failed!");
    // }
  }

  let general_category_products;

  /**
   * Получает данные для каталога товаров
   * @param {string} general_category_id Идентификатор укрупненной категории
   */
  function setProductsCatalog(general_category_id) {
    // Получаем из кеша все товары текущей укрупненной категории
    general_category_products =
      $cached_general_categories_products.get(general_category_id);

    // Если в кеше есть товары укрупненной категории, то получаем их.
    // Иначе - делаем GET-запрос получения товаров по идентификатору укрупненной категории
    if (general_category_products !== undefined) {
      // Получаем из кеша товары, соответсвующие выбранной категории
      let curr_cached_products =
        $cached_general_categories_products.get(general_category_id);

      // Обновляем текущий каталог товаров, помечая товары, которые добавлены в сет
      $products.data = updateIsAddedToSet(curr_cached_products);
    } else {
      products_promise = getProductsForCategory(general_category_id);

      products_promise.then(() => {
        // Если пользователь перешел на карточку сета и нажал на заполненный слот,
        // то помечаем товар на слоте в каталоге, как добавленный в сет
        if (
          $is_set_card_page &&
          $chosen_slots.find(
            (chosen_slot) => chosen_slot.order_num === $curr_chosen_slot_num,
          ).is_chosen
        ) {
          $products.data = updateIsAddedToSet($products.data);
        }
      });
    }
  }

  async function handleChosenSetComponent(event) {
    general_category_id = event.detail.general_category_id;
    general_category_name = event.detail.general_category_name;

    setProductsCatalog(event.detail.general_category_id);
  }

  /**
   * Получает все данные сета товаров
   * @param {string} set_id Идентификатор сета товаров
   */
  async function getProductSetData(set_id) {
    const resp = await fetch(
      "/products/product_sets/product_set_data?" +
        new URLSearchParams({ id: set_id }).toString(),
    );

    if (!resp.ok) {
      throw new Error(`Error: ${resp.status}`);
    }

    const product_set_data = await resp.json();

    // Запоминаем данные сета
    set_data.set(product_set_data[0]);

    // Помечаем, что каждый товар сета пока не добавлен в слот
    $set_data.products.forEach((product) => {
      product.is_added_to_chosen_slots = false;
    });

    set_data.set($set_data);
    console.log($set_data);
  }

  /**
   * Определяет, нужно ли показывать кнопку "Вверх"
   * @type {boolean}
   */
  let show_top_button = false;

  function hideGoToVideoButtonAndGoToInteractivePhotosButton() {
    // Данное условие срабатывает, если пользователь не пролистал кнопку "Video"
    if ($go_to_video_button_is_scrolled === false) {
      // Ищем кнопку "Video"
      const video_slider_element = document.getElementById("video");

      if (!video_slider_element) {
        return;
      }

      // Если пользователь пролистал страницу до любой части блока с видео,
      // то скрываем кнопку "Video"
      $go_to_video_button_is_scrolled =
        window.scrollY > video_slider_element.getBoundingClientRect().top / 2;

      // Если кнопка "Video" проскролирована, то скрываем кнопку "Video"
      if ($go_to_video_button_is_scrolled) {
        $show_go_to_video_button = false;
      }
    }

    // Данное условие срабатывает, если пользователь не пролистал кнопку "Interactive Photos"
    if ($go_to_interactive_button_is_scrolled === false) {
      // Ищем кнопку "Interactive Photos"
      const interactive_photos_slider_element =
        document.getElementById("interactive-photos");

      if (!interactive_photos_slider_element) {
        return;
      }

      // Если пользователь прокрутил страницу до любой части блока с панорамами,
      // то скрываем кнопку "Interactive photos"
      $go_to_interactive_button_is_scrolled =
        window.scrollY >
        interactive_photos_slider_element.getBoundingClientRect().top;

      if ($go_to_interactive_button_is_scrolled) {
        $show_go_to_interactive_photos_button = false;
      }
    }
  }

  document.addEventListener(
    "scroll",
    hideGoToVideoButtonAndGoToInteractivePhotosButton,
    false,
  );

  onMount(async () => {
    // Отображаем кнопку "Вверх" при прокрутке страницы
    window.onscroll = () => {
      show_top_button = window.scrollY !== 0;
    };

    let url_elements = location.pathname.split("/");

    // Если путь к текущей странице, разделенный по "/", состоит из четырех элементов, то путь имеет вид "/set_card",
    // в противном случае - пользователь перешел в страницу создания нового сета
    $is_set_card_page = url_elements.length === 4;

    // Если пользователь перешел на страницу карточки сета, то показываем кнопки "Video" и "Interactive photos"
    $show_go_to_video_button = $is_set_card_page;
    $show_go_to_interactive_photos_button = $is_set_card_page;
    $go_to_video_button_is_scrolled = !$is_set_card_page;
    $go_to_interactive_button_is_scrolled = !$is_set_card_page;

    // Если пользователь не перешел на страницу создания нового сета, значит он першел в карточку сета
    if ($is_set_card_page) {
      // Запоминаем идентификатор сета
      let set_id = url_elements[2];

      // Получаем данные сета
      await getProductSetData(set_id);

      chosen_set_type_id.set($set_data.set_type_id);

      // Показываем страницу со слайдерами
      show_create_set_page = true;

      // После показа карточки сета догружаем сеты, похожие на данный сет
      await getSimilarProductSets(set_id);
    }
  });

  afterUpdate(() => {
    // Если получено готовое видео, но кнопка "Video" не проскролена, то показываем кнопку "Video"
    if (
      $render_task_result_data.videos.length > 0 &&
      $go_to_video_button_is_scrolled === false
    ) {
      $show_go_to_video_button = true;
    }

    // Если получено готовые панорамы, но кнопка "Interactive Photos" не проскролена, то показываем кнопку "Interactive Photos"
    if (
      $render_task_result_data.sequences.length > 0 &&
      $go_to_interactive_button_is_scrolled === false
    ) {
      $show_go_to_interactive_photos_button = true;
    }
  });
</script>

<main>
  {#if popup_visible}
    <div
      transition:fade={{ duration: 2000 }}
      on:outroend={() => (show_create_set_page = true)}
    >
      <!-- Выводим popup-элемент, если перешли на страницу создания нового сета -->
      {#if $is_set_card_page === false}
        <Popup on:message={handlePopupClick} />
      {/if}

      <MobilePreview />
    </div>
  {/if}
  {#if show_create_set_page}
    <!-- <div
      class="section-wrapper"
      data-name="default-sections-parent"
      transition:fade={{ duration: 2000 }}
    > -->
    <div transition:fade={{ duration: 2000 }}>
      <Header />
      <CreateSet on:message={handleChosenSetComponent} />
    </div>

    <!-- Если идет процесс рендеринга, то показываем прогресс-бары изображений, видео и панорам -->
    {#if $render_in_progress}
      <Progressbar />
    {/if}

    {#if show_top_button}
      <ButtonTop />
    {/if}

    {#if $show_products_catalog}
      {#if general_category_products !== undefined}
        <ProductCatalog {general_category_name} />
        <Footer />
      {:else}
        {#await products_promise}
          <LoadingDataWindow />
        {:then}
          <ProductCatalog {general_category_name} />
          <Footer />
        {/await}
      {/if}

      <!-- Дополнительный блок с else нужен, чтобы не отображать компонент Footer во время загрузки каталога товаров  -->
    {:else}
      <div
        class={`section-wrapper${$show_render_results_sliders ? "" : " js--hidden"}`}
        data-name="default-sections-parent"
      >
        <section class="section section-pad-top section-pad-bot set-card-video">
          {#if $show_go_to_video_button}
            <GoToVideoButton />
          {/if}
          <VideoSlider />
          {#if $show_go_to_interactive_photos_button}
            <GoToInteractivePhotosButton />
          {/if}
        </section>
        <Sequence360Slider />
      </div>

      <!-- Если нужно отображать, слайдеры с результатами рендеринга, процесс рендеринга не идет и получены похожие сеты, то отображаем их -->
      {#if $show_render_results_sliders && $similar_product_sets.length > 0 && !$render_in_progress}
        <div
          class="section-wrapper-additional js--active"
          data-name="additional-sections-parent"
          transition:fade={{ duration: 2000 }}
        >
          <MoreLikeThis />
        </div>
      {/if}

      <Footer />
      <MobilePreview />
    {/if}
  {/if}
</main>
