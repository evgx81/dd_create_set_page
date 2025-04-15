<script>
    import { onMount } from "svelte";
    import { brands, filters } from "../stores";

    const CLASSES = {
        OPEN: "js--open",
        HIDDEN: "js--hidden",
        SCROLLED: "js--scrolled",
        ACTIVE: "js--active",
        NONE: "js--none",
    };

    const createFilterScrollbar = (parent) => {
        const track = parent.querySelector('[data-name-scrollbar="track"]');
        if (track) {
            const inner = parent.querySelector('[data-name="list-wrapper"]');
            const buttonUp = parent.querySelector(
                '[data-name-scrollbar="button-up"]',
            );
            const buttonDown = parent.querySelector(
                '[data-name-scrollbar="button-down"]',
            );
            const thumb = parent.querySelector('[data-name-scrollbar="thumb"]');

            let isDragging = false;
            let startY;
            let startScrollTop;
            let scrollInterval;
            let scrollSpeed = 5; // Начальная скорость прокрутки
            let acceleration = 1; // Фактор ускорения
            let scrollDirection = 0; // 1 для вниз, -1 для вверх

            function scrollBy(amount) {
                inner.scrollBy({ top: amount });
                updateScrollbar();
            }

            function updateScrollbar() {
                const innerHeight = inner.scrollHeight;
                const visibleHeight = inner.clientHeight;
                const scrollRatio = visibleHeight / innerHeight;
                thumb.style.height = `${scrollRatio * 100}%`;

                const thumbHeight = thumb.clientHeight;
                const trackHeight = track.clientHeight;
                thumb.style.transform = `translateY(${(inner.scrollTop / (innerHeight - visibleHeight)) * (trackHeight - thumbHeight)}px)`;
            }

            function onThumbMouseDown(e) {
                isDragging = true;
                startY = e.clientY;
                startScrollTop = inner.scrollTop;
                document.addEventListener("mousemove", onThumbMouseMove);
                document.addEventListener("mouseup", onThumbMouseUp);
            }

            function onThumbMouseMove(e) {
                if (!isDragging) return;
                const deltaY = e.clientY - startY;
                const trackHeight = track.clientHeight;
                const thumbHeight = thumb.clientHeight;
                const scrollableHeight =
                    inner.scrollHeight - inner.clientHeight;
                const thumbPosition =
                    (deltaY / (trackHeight - thumbHeight)) * scrollableHeight;
                inner.scrollTop = startScrollTop + thumbPosition;
                updateScrollbar();
            }

            function onThumbMouseUp() {
                isDragging = false;
                document.removeEventListener("mousemove", onThumbMouseMove);
                document.removeEventListener("mouseup", onThumbMouseUp);
            }

            function startScroll(direction) {
                scrollDirection = direction;
                scrollInterval = setInterval(() => {
                    scrollBy(scrollDirection * scrollSpeed);
                    scrollSpeed += acceleration; // Увеличиваем скорость
                }, 20); // Интервал в миллисекундах
            }

            function stopScroll() {
                clearInterval(scrollInterval);
                scrollSpeed = 10; // Сброс скорости после остановки
                scrollDirection = 0;
            }

            buttonUp?.addEventListener("mousedown", () => startScroll(-1));
            buttonDown?.addEventListener("mousedown", () => startScroll(1));
            buttonUp?.addEventListener("mouseup", stopScroll);
            buttonDown?.addEventListener("mouseup", stopScroll);
            buttonUp?.addEventListener("mouseleave", stopScroll);
            buttonDown?.addEventListener("mouseleave", stopScroll);

            inner.addEventListener("scroll", updateScrollbar);
            updateScrollbar();
            thumb.addEventListener("mousedown", onThumbMouseDown);
        }
    };

    const toggleDropdowns = () => {
        const dropdowns = document.querySelectorAll(".dropdown--js");

        const openDropdown = (dropdown) => {
            const content = dropdown.querySelector(".dropdown__content--js");
            dropdown.classList.add(CLASSES.ACTIVE);
            content.style.maxHeight = content.scrollHeight + "px";
            dropdowns.forEach((element) => {
                if (element !== dropdown) {
                    element.classList.remove(CLASSES.ACTIVE);
                    const content = element.querySelector(
                        ".dropdown__content--js",
                    );
                    content.style.maxHeight = null;
                }
            });
        };

        const closeDropdown = (dropdown) => {
            dropdown.classList.remove(CLASSES.ACTIVE);
            const content = dropdown.querySelector(".dropdown__content--js");
            content.style.maxHeight = null;
        };

        const closeDropdowns = () => {
            dropdowns.forEach((dropdown) => {
                dropdown.classList.remove(CLASSES.ACTIVE);
                const content = dropdown.querySelector(
                    ".dropdown__content--js",
                );
                content.style.maxHeight = null;
            });
        };

        const updateMaxHeight = (content) => {
            content.style.maxHeight = content.scrollHeight + "px";
        };

        dropdowns.forEach((dropdown) => {
            const header = dropdown.querySelector(".dropdown__header--js");
            const content = dropdown.querySelector(".dropdown__content--js");

            dropdown.addEventListener("mouseenter", (event) => {
                if (window.innerWidth > 1280) {
                    if (event.target.tagName.toLowerCase() === "button") {
                        event.stopPropagation();
                    } else {
                        if (content.style.maxHeight) {
                            closeDropdown(dropdown);
                        } else {
                            openDropdown(dropdown);
                        }
                    }
                }
            });
            header.addEventListener("click", (event) => {
                if (event.target.tagName.toLowerCase() === "button") {
                    event.stopPropagation();
                } else {
                    if (content.style.maxHeight) {
                        closeDropdown(dropdown);
                    } else {
                        openDropdown(dropdown);
                    }
                }
            });
            dropdown.addEventListener("mouseleave", (event) => {
                if (window.innerWidth > 1280) {
                    closeDropdown(dropdown);
                }
            });
            const clickableElements = content.querySelectorAll("*");
            clickableElements.forEach((element) => {
                element.onclick = () => updateMaxHeight(content);
            });
        });
        const closeDropdownByOutClick = (event) => {
            if (!event.target.closest(".dropdown--js")) {
                closeDropdowns();
            }
        };
        document.addEventListener("click", closeDropdownByOutClick);
    };

    onMount(() => {
        // Делаем выпадающее меню
        toggleDropdowns();

        // Создаем scrollbar
        const blockDropdowns = document.querySelectorAll(
            '[data-name="dropdown-scrollbar-parent"]',
        );

        if (blockDropdowns.length) {
            blockDropdowns.forEach((dropdown) => {
                createFilterScrollbar(dropdown);
            });
        }
    });
</script>

<div class="dropdown--js">
    <div class="dropdown__header--js">
        <button class="button button--light">Brand</button>
    </div>
    <div
        class="dropdown__content dropdown__content--js"
        data-name="dropdown-scrollbar-parent"
    >
        <div class="dropdown__body-wrapper">
            <ul class="dropdown__body" data-name="list-wrapper">
                {#each $brands as brand, idx}
                    <li class="dropdown__list-item">
                        <label for="brand-0{idx}">
                            <span class="dropdown__link-text">{brand}</span>
                            <input
                                id="brand-0{idx}"
                                type="checkbox"
                                name="brand"
                                bind:group={$filters.brands}
                                value={brand}
                            />
                            <div class="dropdown-checkbox">
                                <div class="dropdown-checkbox__mark"></div>
                            </div>
                        </label>
                    </li>
                {/each}
            </ul>
            <div class="catalog-scrollbar">
                <div class="catalog-scrollbar__track">
                    <div
                        class="catalog-scrollbar__track-inner"
                        data-name-scrollbar="track"
                    >
                        <div
                            class="catalog-scrollbar__thumb"
                            data-name-scrollbar="thumb"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
