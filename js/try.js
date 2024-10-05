let rentDays = 0;
let rentMonth = '';
let seasonType = '';
let deliveryPrice = 0;
const seasonByMonth = {
    'января': { type: 'extremeSeason', minDays: { standard: 7, premium: 10 } },
    'февраля': { type: 'highSeason', minDays: { standard: 7, premium: 7 } },
    'марта': { type: 'highSeason', minDays: { standard: 7, premium: 7 } },
    'апреля': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'мая': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'июня': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'июля': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'августа': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'сентября': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'октября': { type: 'lowSeason', minDays: { standard: 3, premium: 3 } },
    'ноября': { type: 'highSeason', minDays: { standard: 7, premium: 7 } },
    'декабря': { type: 'extremeSeason', minDays: { standard: 7, premium: 10 } }
};
const totalPriceLine = document.querySelectorAll('.total-price');
const calculatorForm = document.querySelector('.calculator__desktop');
const calculatorMobileForm = document.querySelector('.calculator__mobile');
const rooms = document.querySelector('.rooms'); 
const carListItems = rooms ? rooms.querySelectorAll('.entry') : null; 

if (window.innerWidth <= 768) {
    calculatorMobileForm.addEventListener('submit', changePrices)
} else {
    calculatorForm.addEventListener('submit', changePrices);
}

document.addEventListener('DOMContentLoaded', setCalendar)

function setCalendar() {
    // Вычисляем сегодняшнюю дату и дату через 14 дней
    const today = new Date();
    const defaultEndDate = new Date();
    defaultEndDate.setDate(today.getDate() + 14); // Добавляем 14 дней к сегодняшней дате

    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    // Форматирование дат для отображения
    const startDay = today.getDate();
    const startMonth = months[today.getMonth()];
    const endDay = defaultEndDate.getDate();
    const endMonth = months[defaultEndDate.getMonth()];
    const year = today.getFullYear();

    const days = Math.ceil((defaultEndDate - today) / (1000 * 60 * 60 * 24)) + 1; // Количество дней аренды

    if (window.innerWidth <= 768) {
        const picker = new easepick.create({
            element: document.getElementById('datepicker-mobile'),
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
                'https://easepick.com/css/demo_hotelcal.css',
            ],
            zIndex: 99999,
            lang: "ru-RU",
            plugins: ['RangePlugin'],
            RangePlugin: {
                tooltipNumber(num) {
                    return num - 1;
                },
                locale: {
                    one: 'ночь',
                    other: 'ночей',
                },
            },
            setup(picker) {
                // Устанавливаем начальные даты при загрузке
                picker.setDateRange(today, defaultEndDate);

                const pickupDate = document.querySelector('.datepicker-date-pickup input');
                const returnDate = document.querySelector('.datepicker-date-return input');
                const daysCount = document.querySelector('.days-count__mobile');

                pickupDate.style.color = '#000';
                returnDate.style.color = '#000';
                daysCount.style.display = 'block';
                pickupDate.value = `${startDay} ${startMonth}`;
                returnDate.value = `${endDay} ${endMonth}`;
                daysCount.textContent = `${days} дней`;
                rentDays = days;

                picker.on('select', (evt) => {
                    const startDate = evt.detail.start;
                    const endDate = evt.detail.end;

                    const startDay = startDate.getDate();
                    const startMonth = months[startDate.getMonth()];
                    const endDay = endDate.getDate();
                    const endMonth = months[endDate.getMonth()];

                    seasonType = seasonByMonth[startMonth].type;

                    pickupDate.value = `${startDay} ${startMonth}`;
                    returnDate.value = `${endDay} ${endMonth}`;

                    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    daysCount.textContent = `${days} ${days === 1 ? 'день' : 'дней'}`;
                    rentDays = days;
                });
            }
        });
    } else {
        const picker = new easepick.create({
            element: document.getElementById('datepicker'),
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
                'https://easepick.com/css/demo_hotelcal.css',
            ],
            zIndex: 99999,
            lang: "ru-RU",
            plugins: ['RangePlugin'],
            RangePlugin: {
                tooltipNumber(num) {
                    return num - 1;
                },
                locale: {
                    one: 'ночь',
                    other: 'ночей',
                },
            },
            setup(picker) {
                // Устанавливаем начальные даты при загрузке
                picker.setDateRange(today, defaultEndDate);

                let dateRangeText;
                if (startMonth === endMonth) {
                    dateRangeText = `${startDay}-${endDay} ${startMonth} ${year}`;
                } else {
                    dateRangeText = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
                }

                document.getElementById('datepicker').value = dateRangeText;
                document.getElementById('days-count').textContent = `${days} дней`;
                rentDays = days;

                picker.on('select', (evt) => {
                    const startDate = evt.detail.start;
                    const endDate = evt.detail.end;

                    const startDay = startDate.getDate();
                    const endDay = endDate.getDate();
                    const startMonth = months[startDate.getMonth()];
                    const endMonth = months[endDate.getMonth()];
                    const year = startDate.getFullYear();

                    let dateRangeText;
                    if (startMonth === endMonth) {
                        dateRangeText = `${startDay}-${endDay} ${startMonth} ${year}`;
                    } else {
                        dateRangeText = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
                    }

                    document.getElementById('datepicker').value = dateRangeText;

                    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    document.getElementById('days-count').textContent = `${days} ${days === 1 ? 'день' : 'дней'}`;
                    rentDays = days;
                });
            }
        });
    }
}




let price = [];

function changePrices(evt) {
    evt.preventDefault();
    price = [];

    // Находим прелоудер
    const preloader = document.querySelector('.preloader');
    const preloaderOverlay = document.querySelector('.preloader-overlay');

    // Показать прелоудер, убираем класс hidden
    preloader.classList.remove('hidden');
    preloaderOverlay.classList.remove('hidden');
    
    fetch('https://phuket-cars-default-rtdb.asia-southeast1.firebasedatabase.app/.json')
    .then(response => response.json())
    .then(data => {
        if (data.cars) {
            console.log(data.cars)
            data.cars.forEach(car => {
                const carObject = {
                    id: car.id,
                    name: car.name,
                    lowSeasonPrice: car. lowSeasonPrice,
                    highSeasonPrice: car.highSeasonPrice,
                    extremeSeasonPrice: car.extremeSeasonPrice,
                    carUrl: car.carUrl,
                    imgUrl: car.imgUrl,
                    category: car.category  
                };
                price.push(carObject);
            });
            renderCars(); // Отрисовываем карточки с новыми данными

        }

        // Удаляем предыдущие карточки
        carListItems.forEach(card => card.remove());
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Скрываем прелоудер после того, как данные загружены и карточки отрисованы
        preloader.classList.add('hidden');
        preloaderOverlay.classList.add('hidden');
        const moveTo = new MoveTo({
            duration: 1500
        });
        const target = document.getElementById('section-cars');
        moveTo.move(target); 
    });
}

function renderCars() {
    const cols = document.querySelectorAll('.row .col');
    console.log(price);
    //pickup
    let selectPickup;
    let selectReturn;
    
    if (window.innerWidth <= 768) {
        selectPickup = document.getElementById('pickup');
        selectReturn = document.getElementById('return');
    } else {
        selectPickup = document.getElementById('pickup-desk');
        selectReturn = document.getElementById('return-desk');
    }
    
    // Получаем выбранные опции и их data-value
    const selectedOptionPickup = selectPickup.options[selectPickup.selectedIndex];
    const dataValuePickup = parseInt(selectedOptionPickup.getAttribute('data-value'));
    
    const selectedOptionReturn = selectReturn.options[selectReturn.selectedIndex];
    const dataValueReturn = parseInt(selectedOptionReturn.getAttribute('data-value'));
    
    // Выводим значения в консоль
    console.log('Pickup data-value:', dataValuePickup);
    console.log('Return data-value:', dataValueReturn);
    
    //total delivery

    // Удаляем предыдущие карточки
    cols.forEach(col => {
        col.innerHTML = '';
    });

    price.forEach((car, index) => {
        const colIndex = index % cols.length; // Вычисляем индекс колонки
        const col = cols[colIndex]; // Получаем колонку
         deliveryPrice = dataValuePickup + dataValueReturn;
        const markup = `
            <div class="entry">
                <a href="/${car.carUrl}"><img src="${car.imgUrl}" alt="${car.name}"></a>
                <div class="content content-finder">
                    <h5 class="car-name" data-name="${car.name}">${car.name}</h5>
                    <p class="initial-price"><span>от ${seasonType === 'lowSeason' ? car.lowSeasonPrice: seasonType === 'highSeason' ? car.highSeasonPrice: seasonType === 'extremeSeason' ? car.extremeSeasonPrice : 0}฿</span>/сутки</p>
                    <p class="total-price"><span></span>${parseInt(seasonType === 'lowSeason' ? car.lowSeasonPrice * rentDays : seasonType === 'highSeason' ? car.highSeasonPrice * rentDays : seasonType === 'extremeSeason' ? rentDays * car.extremeSeasonPrice : 0) + deliveryPrice}฿ итого</p>
                    <button class="button open-popup">Оставить заявку</button>
                </div>
            </div>
        `;
        
        col.innerHTML += markup; // Добавляем карточку к колонке
    });
}
// Получаем элемент select
const selectElement = document.getElementById('pickup');

// Добавляем обработчик события изменения
selectElement.addEventListener('change', function() {
    // Получаем выбранный option
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    
    // Получаем значение атрибута data-value
    const dataValue = selectedOption.getAttribute('data-value');

    // Выводим значение в консоль или сохраняем в переменную
    console.log(dataValue);
    // Можно сохранить в переменную
    // let myDataValue = dataValue;
});





//moveTo
const moveTo = new MoveTo();
const target = document.getElementById('section-cars');