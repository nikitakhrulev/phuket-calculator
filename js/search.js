let rentDays = 0;
const totalPriceLine = document.querySelectorAll('.total-price');
const calculatorForm = document.querySelector('.calculator__desktop');
const calculatorMobileForm = document.querySelector('.calculator__mobile');
const rooms = document.querySelector('.rooms'); // Выбираем первый элемент с классом .rooms
const carListItems = rooms ? rooms.querySelectorAll('.entry') : null; // Затем выбираем .entry внутри .rooms, если он существует

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
                    return num - 1; // Подсказка для количества ночей
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
        
                    const endDay = endDate.format('D'); 
                    const endMonth = months[endDate.format('M') - 1]; 
        
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
            data.cars.forEach(car => {
                const carObject = {
                    id: car.id,
                    name: car.name,
                    seasonPrice: car.seasonPrice,
                    notSeasonPrice: car.notSeasonPrice,
                    carUrl: car.carUrl,
                    imgUrl: car.imgUrl
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
    console.log(price)

    cols.forEach((col, index) => {
        if (index < price.length) { 
            const car = price[index]; 
            const markup = `
                <div class="entry">
                    <a href="/${car.carUrl}"><img src="${car.imgUrl}"></a>
                    <div class="content content-finder">
                        <h5 class="car-name" data-name="${car.name}">${car.name}</h5>
                        <p class="initial-price"><span>от ${car.notSeasonPrice}฿</span>/сутки</p>
                        <p class="total-price"><span></span>${parseInt(rentDays * car.seasonPrice)}฿ итого</p>
                        <button class="button open-popup">Оставить заявку</button>
                    </div>
                </div>
            `;
            col.innerHTML = markup; 
        }
    });
}

//moveTo
const moveTo = new MoveTo();
const target = document.getElementById('section-cars');