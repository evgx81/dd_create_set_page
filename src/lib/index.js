const CLASSES = {
    OPEN: 'js--open',
    HIDDEN: 'js--hidden',
    SCROLLED : 'js--scrolled',
    ACTIVE: 'js--active',
    NONE: 'js--none'
};
const initHeroSlider = () => {
    const heroSwiper = new Swiper('.hero-slider', {
        slidesPerView: 1,
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
    });
};
initHeroSlider();

const initialSliders = () => {
    const buildSwiperSlider = (swiperSliderElement) => {
        const swiperSlider = swiperSliderElement;
        const swiperPagination = swiperSlider.querySelector('.swiper-pagination');
        if (!swiperSlider) return;

        const currentSwiper = new Swiper(swiperSlider, {
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: swiperPagination,
                clickable: true
            }
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
    }

    const slidersParents = document.querySelectorAll('[data-name="slider-parent"]');

    slidersParents.forEach((slidersParent) => {
        const swiperSliders = slidersParent.querySelectorAll('.swiper');
        swiperSliders.forEach((swiperSlider) => buildSwiperSlider(swiperSlider));
    });
};
initialSliders();


const initSetLikes = () => {
    const likes = document.querySelectorAll('[data-name="like"]');
    const setLike = (event) => {
        const like = event.target.closest('[data-name="like"]');
        like.classList.toggle(CLASSES.ACTIVE);
    }
    likes.forEach((like) => {
        like.addEventListener('click', setLike)
    })
};
initSetLikes();

// CUSTOM SCROLLBAR START
document.addEventListener('DOMContentLoaded', () => {
    const createScrollbar = (parent) => {
        const track = parent.querySelector('[data-name-scrollbar="track"]');
        if(track) {
            const inner = parent.querySelector('[data-name="list-wrapper"]');
            const buttonUp = parent.querySelector('[data-name-scrollbar="button-up"]');
            const buttonDown = parent.querySelector('[data-name-scrollbar="button-down"]');
            const thumb = parent.querySelector('[data-name-scrollbar="thumb"]');


            let isDragging = false;
            let startY;
            let startScrollTop;
            let scrollInterval;
            let scrollSpeed = 5; // Начальная скорость прокрутки
            let acceleration = 1; // Фактор ускорения
            let scrollDirection = 0; // 1 для вниз, -1 для вверх

            function scrollBy(amount) {
                inner.scrollBy({ top: amount});
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
                document.addEventListener('mousemove', onThumbMouseMove);
                document.addEventListener('mouseup', onThumbMouseUp);
            }

            function onThumbMouseMove(e) {
                if (!isDragging) return;
                const deltaY = e.clientY - startY;
                const trackHeight = track.clientHeight;
                const thumbHeight = thumb.clientHeight;
                const scrollableHeight = inner.scrollHeight - inner.clientHeight;
                const thumbPosition = (deltaY / (trackHeight - thumbHeight)) * scrollableHeight;
                inner.scrollTop = startScrollTop + thumbPosition;
                updateScrollbar();
            }

            function onThumbMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onThumbMouseMove);
                document.removeEventListener('mouseup', onThumbMouseUp);
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

            buttonUp?.addEventListener('mousedown', () => startScroll(-1));
            buttonDown?.addEventListener('mousedown', () => startScroll(1));
            buttonUp?.addEventListener('mouseup', stopScroll);
            buttonDown?.addEventListener('mouseup', stopScroll);
            buttonUp?.addEventListener('mouseleave', stopScroll);
            buttonDown?.addEventListener('mouseleave', stopScroll);

            inner.addEventListener('scroll', updateScrollbar);
            updateScrollbar();
            thumb.addEventListener('mousedown', onThumbMouseDown);
        }

    };
    const blockSettings = document.querySelector('[data-name="custom-scrollbar-parent"]');
    const blockDropdowns = document.querySelectorAll('[data-name="dropdown-scrollbar-parent"]');

    if(blockSettings) {
        createScrollbar(blockSettings);
    }
    if(blockDropdowns.length) {
        blockDropdowns.forEach((dropdown) => {
            createScrollbar(dropdown);
        })
    }
});
// CUSTOM SCROLLBAR END

// CARUSEL 360 START
window.CI360?.init();
// CARUSEL 360 END

// POPUP START
const initPopup = () => {
    const popup = document.querySelector('[data-name="popup"]');
    const popupSets = document.querySelectorAll('[data-name="popup-set-close"]');
    const body = document.querySelector('body');
    const closePopup = () => {
        popup.classList.add(CLASSES.HIDDEN);
        body.classList.remove(CLASSES.SCROLLED);
    }
    popupSets.forEach((set) => {
        set.addEventListener('click', closePopup)
    })
};
initPopup();
// POPUP END

// CATALOG SET (CC6) START
let counter = 0;
const initSetCatalogSections = () => {
    const openButtons = document.querySelectorAll('[data-name="catalog-set-item"]');
    const catalogSection = document.querySelector('[data-name="catalog-set-section"]');
    const defaultSectionParent = document.querySelector('[data-name="default-sections-parent"]');
    const additionalSectionParent = document.querySelector('[data-name="additional-sections-parent"]');
    const stulymButton = document.querySelector('[data-button="stylum"]');
    if(openButtons.length) {
        const openCatalogSections = () => {
            catalogSection.classList.add(CLASSES.ACTIVE);
            defaultSectionParent.classList.add(CLASSES.HIDDEN);
            initialSliders()
        };
        const closeCatalogSections = () => {
            catalogSection.classList.remove(CLASSES.ACTIVE);
            defaultSectionParent.classList.remove(CLASSES.HIDDEN)
            stulymButton.classList.remove(CLASSES.ACTIVE);
            additionalSectionParent.classList.add(CLASSES.ACTIVE);
            counter = 0;

            initialSliders()
        };

        stulymButton.addEventListener('click', closeCatalogSections)
        openButtons.forEach((button) => {
            button.addEventListener('click', openCatalogSections)
        });
    }
};
initSetCatalogSections();
// CATALOG SET (CC6) END

const initSetButtonText = () => {
    const buttons = document.querySelectorAll('[data-name="button-adding-set"]');
    const stulymButton =document.querySelector('[data-button="stylum"]');
    if(stulymButton) {
        const sliderPreloader = document.querySelector('[data-name="preview-slider"]');
        const sliderPreloaderText = sliderPreloader.querySelector('[data-name-preview-text-default]');
        const videoPreloader = document.querySelector('[data-name="preview-video"]');
        const videoPreloaderText = videoPreloader.querySelector('[data-name-preview-text-default]');
        const interactivePreloader = document.querySelector('[data-name="preview-360"]');
        const interactivePreloaderText = interactivePreloader.querySelector('[data-name-preview-text-default]');
        const sliderSet = document.querySelector('[data-name="slider-set"]');
        const setButtonText = (event) => {
            const button = event.target.closest('[data-name="button-adding-set"]');
            button.classList.toggle(CLASSES.ACTIVE);
            button.textContent = button.classList.contains(CLASSES.ACTIVE)
                ? button.textContent = button.dataset.buttonResaltText
                : button.textContent = button.dataset.buttonDefaultText;
            counter = button.classList.contains(CLASSES.ACTIVE) ? counter + 1 : counter - 1;
            if (counter) {
                stulymButton.classList.add(CLASSES.ACTIVE);
                sliderPreloader.classList.add(CLASSES.HIDDEN);
                videoPreloader.classList.add(CLASSES.HIDDEN);
                videoPreloader.classList.remove(CLASSES.NONE);
                interactivePreloader.classList.remove(CLASSES.NONE);
                interactivePreloader.classList.add(CLASSES.HIDDEN);
                sliderPreloaderText.textContent = sliderPreloaderText.dataset.namePreviewTextResult;
                videoPreloaderText.textContent = videoPreloaderText.dataset.namePreviewTextResult;
                interactivePreloaderText.textContent = interactivePreloaderText.dataset.namePreviewTextResult;
                if(sliderSet) {
                    sliderSet.classList.add('js--hidden');
                }
            } else {
                stulymButton.classList.remove(CLASSES.ACTIVE);
                sliderPreloader.classList.remove(CLASSES.HIDDEN);
                videoPreloader.classList.remove(CLASSES.HIDDEN);
                interactivePreloader.classList.remove(CLASSES.HIDDEN);
                sliderPreloaderText.textContent = sliderPreloaderText.dataset.namePreviewTextDefault;
                videoPreloaderText.textContent = videoPreloaderText.dataset.namePreviewTextDefault;
                interactivePreloaderText.textContent = interactivePreloaderText.dataset.namePreviewTextDefault;
            }
        }
        buttons.forEach((button) => {
            button.addEventListener('click', setButtonText)
        })
    }


};
initSetButtonText();

const initSetSearch = () => {
    const searchInput = document.querySelector('[data-name="search-input"]');
    const defaultSection = document.querySelector('[data-nmae="default-search-section"]');
    const resultSection = document.querySelector('[data-nmae="result-search-section"]');
    const setSearch = (event) => {
        if (event.code === "Enter" && defaultSection && resultSection) {
            defaultSection.classList.add(CLASSES.HIDDEN);
            resultSection.classList.add(CLASSES.ACTIVE);
        }
    };
    searchInput.addEventListener('keydown', setSearch);
};
initSetSearch();

const initOpenConfigButtons = () => {
    const openButtons = document.querySelectorAll('[data-name="open-buttons"]');

    const openConfigureButtons = (event) => {
        const buttonParent = event.target.closest('[data-name="open-buttons"]');
        buttonParent.classList.add(CLASSES.ACTIVE);
    }
    openButtons.forEach((button) => {
        button.addEventListener('click',openConfigureButtons);
    })
};
initOpenConfigButtons();

const openCatalogOrSliderByModifyButton = () => {
    const previewSlider = document.querySelector('[data-name="preview-slider"]');
    const setSection = document.querySelector('[data-name="catalog-set-section"]');
    const defaultSectionsParent = document.querySelector('[data-name="default-sections-parent"]');
    const sliderSetProduct = document.querySelector('[data-name="slider-set-product"]');
    const stulymButton = document.querySelector('[data-button="stylum"]');
    const onClickModifyButton = (event) => {
        if(event.target.dataset.name === 'button-modify'){
            previewSlider.classList.remove(CLASSES.HIDDEN);
            setSection.classList.add(CLASSES.ACTIVE);
            defaultSectionsParent.classList.add(CLASSES.HIDDEN);
            setTimeout(() => { previewSlider.classList.add(CLASSES.HIDDEN);}, 100)
            sliderSetProduct.classList.add(CLASSES.ACTIVE);
        }
    };

    document.addEventListener('click', onClickModifyButton);

    const closeCatalogSections = () => {
        const sliderSetParent = document.querySelector('[data-name="slider-set"]').parentNode;
        const videoParent = document.querySelector('[data-name="video-wrapper"]');
        const interactiveParent = document.querySelector('[data-name="preview-360"]').parentNode;

        setSection.classList.remove(CLASSES.ACTIVE);
        stulymButton.classList.remove(CLASSES.ACTIVE);
        defaultSectionsParent.classList.remove(CLASSES.HIDDEN);
        previewSlider.classList.remove(CLASSES.HIDDEN);
        previewSlider.classList.remove(CLASSES.NONE);
        setTimeout(() => {
            previewSlider.classList.add(CLASSES.HIDDEN);
        }, 100)
        sliderSetProduct?.classList.remove(CLASSES.ACTIVE);
        counter = 0;

        setTimeout(() => {
            sliderSetParent.classList.add('js--loading');
            videoParent.classList.add('js--loading');
            interactiveParent.classList.add('js--loading');
        }, 1500)

        initialSliders();
    };
    stulymButton?.addEventListener('click', closeCatalogSections);
};
openCatalogOrSliderByModifyButton();


document.addEventListener('DOMContentLoaded', function() {
    // Функция для обновления суммы для каждого типа контента
    function updateSum(type) {
        const input = document.querySelector(`input[data-name-input-money="${type}"]`);
        const resultElement = document.querySelector(`div[data-name-result-money="${type}"]`);
        const value = parseInt(input.value) || 0;
        resultElement.textContent = `${value}$`;
    }

    // Функция для обновления общей суммы
    function updateTotalSum() {
        let total = 0;
        document.querySelectorAll('.balance-content__input').forEach(input => {
            const type = input.getAttribute('data-name-input-money');
            total += (parseInt(input.value) || 0);
        });
        // document.querySelector('div[data-name-result-money="all"]').textContent = `${total}$`;
        document.querySelector('input[data-name-result-money="all"]').value = `${total}$`;
    }

    // Функция для изменения значения инпута и обновления суммы
    function changeValue(input, increment) {
        let currentValue = parseInt(input.value) || 0;
        currentValue += increment;
        if (currentValue < 0) currentValue = 0; // Не допускаем отрицательных значений
        input.value = currentValue;
        const type = input.getAttribute('data-name-input-money');
        updateSum(type);
        updateTotalSum();
    }

    // Добавляем обработчики событий для кнопок
    document.querySelectorAll('.balance-content__button').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.balance-content__row').querySelector('.balance-content__input');
            const increment = this.getAttribute('data-name-decrement') || this.getAttribute('data-name-interactive-photo') === 'decrement' ? -1 : 1;
            changeValue(input, increment);
        });
    });

    // Добавляем обработчики событий для изменения значений вручную в инпутах
    document.querySelectorAll('.balance-content__input').forEach(input => {
        input.addEventListener('input', function() {
            const type = this.getAttribute('data-name-input-money');
            updateSum(type);
            updateTotalSum();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Получаем все кнопки табов
    const tabButtons = document.querySelectorAll('[data-name="tab-button"]');
    // Получаем все контентные блоки табов
    const tabContents = document.querySelectorAll('[data-name="tab-content"]');

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Убираем класс js--active у всех кнопок и контентов
            tabButtons.forEach(btn => btn.classList.remove('js--active'));
            tabContents.forEach(content => content.classList.remove('js--active'));

            // Добавляем класс js--active к текущей кнопке и соответствующему контенту
            button.classList.add('js--active');
            tabContents[index].classList.add('js--active');
        });
    });
});
const preview = document.querySelector('[data-name="support-video-preview"]');
if(preview) {
    const hidePreview = () => {
        preview.classList.add(CLASSES.HIDDEN);
    }
    preview.addEventListener('click', hidePreview);
}

const initSetFileInput = () => {
    const fileInputs = document.querySelectorAll('[data-name="input-upload-file"]');

    const getFile = async (event) => {
        const inputFile = event.target;
        const file = await inputFile.files[0];
        if(file){
            const parent = inputFile.closest('[data-name="input-file-parent"]');
            const label = parent.querySelector('[data-name="label-text"]');
            label.textContent = label.dataset.textResult;
        }
    };

    fileInputs.forEach((input) => {
        input.addEventListener('change', getFile);
    })

};
initSetFileInput();

const initMobilePreview = () => {
  const mobilePreview =  document.querySelector('[data-name="mobile-preview"]');
  const body = document.querySelector('body');
  if(window.innerWidth < 1280) {
      mobilePreview.classList.add(CLASSES.ACTIVE);
      body.classList.add(CLASSES.SCROLLED);
  } else {
      mobilePreview.classList.remove(CLASSES.ACTIVE);
      body.classList.remove(CLASSES.SCROLLED);
  }
};
initMobilePreview();
window.addEventListener("resize", initMobilePreview)