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
                picker.on('select', (evt) => {
                    const startDate = evt.detail.start;
                    const endDate = evt.detail.end;
        
                    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
                    const startDay = startDate.format('D'); 
                    const startMonth = months[startDate.format('M') - 1]; 
                    console.log(startMonth)
                    const endDay = endDate.format('D'); 
                    const endMonth = months[endDate.format('M') - 1];
                    seasonType = seasonByMonth[startMonth].type;
        
                    const pickupDate = document.querySelector('.datepicker-date-pickup input');
                    const returnDate = document.querySelector('.datepicker-date-return input');
                    const daysCount = document.querySelector('.days-count__mobile');
                    // const daysCount = document.querySelector('.days-count__mobile');
                    pickupDate.style.color = '#000';
                    returnDate.style.color = '#000';
                    daysCount.style.display = 'block';
                    pickupDate.value = `${startDay} ${startMonth}`;
                    returnDate.value = `${endDay} ${endMonth}`;
        
                    const days = evt.detail.end.diff(evt.detail.start, 'days');
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
                picker.on('select', (evt) => {
                    const startDate = evt.detail.start;
                    const endDate = evt.detail.end;
        
                    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
                    const startDay = startDate.format('D'); 
                    const endDay = endDate.format('D');
        
                    const startMonth = months[startDate.format('M') - 1]; 
                    const endMonth = months[endDate.format('M') - 1]; 
                    console.log(seasonByMonth[startMonth])
                    seasonType = seasonByMonth[startMonth].type;
                    console.log(seasonType)
                    const year = startDate.format('YYYY'); 
        
                    let dateRangeText;
                    if (startMonth === endMonth) {
                        dateRangeText = `${startDay}-${endDay} ${startMonth} ${year}`;
                    } else {
                        dateRangeText = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
                    }
        
                    document.getElementById('datepicker').value = dateRangeText;
        
                    const days = evt.detail.end.diff(evt.detail.start, 'days');
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