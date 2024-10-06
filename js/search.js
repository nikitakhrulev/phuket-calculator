let rentDays = 0;
let rentMonth = '';
let seasonType = '';
let deliveryPrice = 0;
let today = new Date();
let defaultEndDate = new Date(); 
let currentDay = 0;
let finalDay = 0;
let daysInCurrentMonth = 0;
let currentMonth = '';
let currentDayNumber = 0;

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
    'декабря': { minDays: { standard: 7, premium: 10 } }
};
//setForm
document.addEventListener('DOMContentLoaded', setForm)
function setForm() {
    if (window.innerWidth <= 768) {
        calculatorForm.remove()
    } else {
        calculatorMobileForm.remove()
    }
}
const totalPriceLine = document.querySelectorAll('.total-price');
const calculatorForm = document.querySelector('.calculator__desktop');
const calculatorMobileForm = document.querySelector('.calculator__mobile');
const rooms = document.querySelector('.rooms'); 
const carListItems = rooms ? rooms.querySelectorAll('.entry') : null; 

if (window.innerWidth <= 768) {
    calculatorMobileForm.addEventListener('submit', changePrices);
} else {
    calculatorForm.addEventListener('submit', changePrices);
}

document.addEventListener('DOMContentLoaded', setCalendar);

function setCalendar() {
    today = new Date(); 
    today.setDate(today.getDate() + 1); // + 1 day
    defaultEndDate = new Date();
    const startDay = (today.getDate()); //start day
    // defaultEndDate.setDate(today.getDate() + 14);  // was before
    defaultEndDate.setDate(startDay + 15)
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const startMonth = months[today.getMonth()]; 
    const endDay = defaultEndDate.getDate();
    const endMonth = months[defaultEndDate.getMonth()];
    const year = today.getFullYear();
    daysInCurrentMonth = new Date(year, today.getMonth() + 1, 0).getDate();
    // const days = Math.ceil((defaultEndDate - today) / (1000 * 60 * 60 * 24)) + 1; was before  
    const days = Math.ceil((defaultEndDate - today) / (1000 * 60 * 60 * 24))
    console.log(days)
    if (window.innerWidth <= 768) {
        const picker = new easepick.create({
            element: document.getElementById('datepicker-mobile'),
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
                'https://easepick.com/css/demo_hotelcal.css',
            ],
            zIndex: 99999,
            lang: "ru-RU",
            plugins: ['RangePlugin', 'LockPlugin'],
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
                    currentDay = startDay;
                    console.log(currentDay)
                    const startMonth = months[startDate.getMonth()];
                    console.log(startMonth)
                    const endDay = endDate.getDate();
                    finalDay = endDay;
                    console.log(finalDay)
                    const endMonth = months[endDate.getMonth()];

                    if (startMonth === 'декабря') {
                        if (startDay >= 20) {
                            seasonType = 'extremeSeason'; // С 20 декабря и позже
                        } else {
                            seasonType = 'highSeason'; // До 20 декабря
                        }
                    } else {
                        seasonType = seasonByMonth[startMonth].type; // Для других месяцев
                    }
                    
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
            plugins: ['RangePlugin', 'LockPlugin'],
            RangePlugin: {
                tooltipNumber(num) {
                    return num - 1;
                },
                locale: {
                    one: 'ночь',
                    other: 'ночей',
                },
            },
            LockPlugin: {
                minDate: today,  // Блокировка дат до сегодняшнего дня
                minDays: 1,
               
            },

            setup(picker) {
                // picker.setDateRange(today, defaultEndDate);

                picker.setDateRange(today, defaultEndDate);
                console.log(today)
                let dateRangeText;
                if (startMonth === endMonth) {
                    dateRangeText = `${startDay}-${endDay} ${startMonth} ${year}`;
                } else {
                    dateRangeText = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
                }
                document.getElementById('datepicker').value = dateRangeText;
                document.getElementById('days-count').textContent = `${days} дней`;
                currentMonth = months[today.getMonth()];
                console.log(currentMonth)
                currentDayNumber = today.getDay();
                console.log(currentDayNumber)
                rentDays = days;
                if (startMonth === 'декабря') {
                    if (startDay >= 20) {
                        seasonType = 'extremeSeason'; // С 20 декабря и позже
                    } else {
                        seasonType = 'highSeason'; // До 20 декабря
                    }
                } else {
                    seasonType = seasonByMonth[startMonth].type; // Для других месяцев
                }
                console.log(seasonType)
                          
                picker.on('select', (evt) => {
                    const startDate = evt.detail.start;
                    const endDate = evt.detail.end;
                    console.log(startDate)
                    const startDay = startDate.getDate();
                    console.log(startDay)
                    currentDay = startDay;
                    const endDay = endDate.getDate();
                    console.log(endDay)
                    finalDay = endDay;
                    const startMonth = months[startDate.getMonth()];
                    console.log(startMonth)
                    const endMonth = months[endDate.getMonth()];
                    const year = startDate.getFullYear();
                    if (startMonth === 'декабря') {
                        if (startDay >= 20) {
                            seasonType = 'extremeSeason'; // С 20 декабря и позже
                        } else {
                            seasonType = 'highSeason'; // До 20 декабря
                        }
                    } else {
                        seasonType = seasonByMonth[startMonth].type; // Для других месяцев
                    }
                    console.log(seasonType)
                    daysInCurrentMonth = new Date(year, startDate.getMonth() + 1, 0).getDate();
                    console.log(daysInCurrentMonth)
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
                picker.on('select', (evt) => {
                    console.log('Change event triggered', evt.detail);
                    const startDate = evt.detail.start;
                
                    if (startDate) {
                        const startMonth = startDate.getMonth();
                        console.log(`Start month: ${startMonth}`); // Логируем номер месяца
                    } else {
                        console.log('Start date is null'); // Если дата не выбрана
                    }
                });
            }
        });
    }
}

let price = [];

function changePrices(evt) {
    evt.preventDefault();
    price = [];
    const preloader = document.querySelector('.preloader');
    const preloaderOverlay = document.querySelector('.preloader-overlay');

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
                    lowSeasonPrice: car.lowSeasonPrice,
                    highSeasonPrice: car.highSeasonPrice,
                    extremeSeasonPrice: car.extremeSeasonPrice,
                    carUrl: car.carUrl,
                    imgUrl: car.imgUrl,
                    category: car.category, 
                    lowMonthPrice: car.lowMonthPrice,
                    highMonthPrice: car.highMonthPrice,
                    extremeMonthPrice: car.extremeMonthPrice,
                };
                price.push(carObject);
            });
            renderCars(); 
        }

        carListItems.forEach(card => card.remove());
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
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
    let selectPickup;
    let selectReturn;
    console.log(price)
    if (window.innerWidth <= 768) {
        selectPickup = document.getElementById('pickup');
        selectReturn = document.getElementById('return');
    } else {
        selectPickup = document.getElementById('pickup-desk');
        selectReturn = document.getElementById('return-desk');
    }
    
    const selectedOptionPickup = selectPickup.options[selectPickup.selectedIndex];
    const dataValuePickup = parseInt(selectedOptionPickup.getAttribute('data-value'));
    
    const selectedOptionReturn = selectReturn.options[selectReturn.selectedIndex];
    const dataValueReturn = parseInt(selectedOptionReturn.getAttribute('data-value'));
    
    // console.log('Pickup data-value:', dataValuePickup);
    // console.log('Return data-value:', dataValueReturn);
    
    cols.forEach(col => {
        col.innerHTML = '';
    });

    price.forEach((car, index) => {
        const colIndex = index % cols.length; 
        const col = cols[colIndex]; 
        deliveryPrice = dataValuePickup + dataValueReturn;

        // Логика для полной аренды на календарный месяц
        // const startDay = today.getDate();
        const startMonth = today.getMonth();
        // const endDay = defaultEndDate.getDate();
        const endMonth = defaultEndDate.getMonth();
        const currentYear = today.getFullYear();
        // Получаем количество дней в месяце
        const daysInMonth = new Date(currentYear, startMonth + 1, 0).getDate(); // Последний день месяца
        let totalCost = 0;

        // Проверка на полный календарный месяц (с 1 по последний день месяца)
        const isFullMonth = (currentDay === 1 && finalDay === daysInMonth && startMonth === endMonth);


        // if (isFullMonth) {
        //     // Если аренда на полный календарный месяц
        //     totalCost = 20000 + deliveryPrice;
        // } else {
        //     // Если аренда на неполный месяц
        //     totalCost = rentDays * (seasonType === 'lowSeason' ? car.lowSeasonPrice : 
        //                             seasonType === 'highSeason' ? car.highSeasonPrice : 
        //                             car.extremeSeasonPrice) + deliveryPrice;
        // }
        let startPrice = 0;
        let rentPrice = 0;
        let forMonth = false;
        let moreThanMonth = false;
        if (seasonType === 'lowSeason') {
            startPrice = car.lowSeasonPrice;
            rentPrice = startPrice;
            if (rentDays <= 5) {
                rentPrice = rentPrice;
            }
            if (rentDays > 5 && rentDays <= 7) {
                rentPrice -= 100;
            }
            if (rentDays > 7 && rentDays <= 10) {
                rentPrice -= 200;
            }
            if (rentDays > 10 && rentDays <= 14) {
                rentPrice -= 300;
            }
            if (rentDays > 14 && rentDays <= 20) {
                rentPrice -= 400;
            }
            if (rentDays > 20 && rentDays <= daysInCurrentMonth) {
                rentPrice = car.lowMonthPrice;
                forMonth = true;
            }
            if (rentDays > daysInCurrentMonth) {
                rentPrice = 'Цена по запросу'
                moreThanMonth = true;
            }
        }
        if (seasonType === 'highSeason') {
            startPrice = car.highSeasonPrice;
            rentPrice = startPrice;
            if (rentDays <= 10) {
                rentPrice = rentPrice;
            }
            if (rentDays > 10 && rentDays <= 14) {
                rentPrice -= 100;
            }
            if (rentDays > 14 && rentDays <= 20) {
                rentPrice -= 200;
            }
            if (rentDays > 20 && rentDays <= daysInCurrentMonth) {
                rentPrice = car.highMonthPrice;
                forMonth = true;
            }
            if (rentDays > daysInCurrentMonth) {
                rentPrice = 'Цена по запросу';
                moreThanMonth = true;
            }
        }
        if (seasonType === 'extremeSeason') {
            startPrice = car.extremeSeasonPrice;
            rentPrice = startPrice;
            if (rentDays <= 10) {
                rentPrice = rentPrice;
            }
            if (rentDays > 10 && rentDays <= 14) {
                rentPrice -= 100;
            }
            if (rentDays > 14 && rentDays <= 20) {
                rentPrice -= 200;
            }
            if (rentDays > 20 && rentDays <= daysInCurrentMonth) {
                rentPrice = car.highMonthPrice;
                forMonth = true;
            }
            if (rentDays > daysInCurrentMonth) {
                rentPrice = 'Цена по запросу';
                moreThanMonth = true;
            }
        }
        console.log(forMonth)
        // <p class="initial-price"><span>от ${seasonType === 'lowSeason' ? car.lowSeasonPrice: seasonType === 'highSeason' ? car.highSeasonPrice: seasonType === 'extremeSeason' ? car.extremeSeasonPrice : 0}฿</span>/сутки</p>
        const markup = `
    <div class="entry">
        <a href="/${car.carUrl}"><img src="${car.imgUrl}" alt="${car.name}"></a>
        <div class="content content-finder">
            <h5 class="car-name" data-name="${car.name}">${car.name}</h5>
            ${!moreThanMonth  ? `
                <p class="initial-price">
                    <span>${rentPrice}฿</span>/${'сутки'}
                </p>` : ''}
            ${!forMonth ? `<p class="total-price">
                    <span></span>${!moreThanMonth ? !forMonth ? rentPrice * rentDays + deliveryPrice : rentPrice + deliveryPrice : ''}${!moreThanMonth ? `฿ итого` : 'Цена по запросу'}
                </p>` : ''}
            <button class="button open-popup">Оставить заявку</button>
        </div>
    </div>
`;
        
        col.insertAdjacentHTML('beforeend', markup);
    });
}






const selectElement = document.getElementById('pickup');
selectElement.addEventListener('change', function() {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const dataValue = selectedOption.getAttribute('data-value');
    console.log(dataValue);
});



//moveTo
const moveTo = new MoveTo();
const target = document.getElementById('section-cars');
