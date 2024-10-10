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
        descrDesc.remove();
        calculatorMobileForm.classList.remove('hidden')
    } else {
        calculatorMobileForm.remove()
        descrMobile.remove();
        calculatorForm.classList.remove('hidden')
    }
}
const totalPriceLine = document.querySelectorAll('.total-price');
const calculatorForm = document.querySelector('.calculator__desktop');
const calculatorMobileForm = document.querySelector('.calculator__mobile');
const descrMobile = document.querySelector('.image-desciption__mobile');
const descrDesc = document.querySelector('.image-subtitle-desktop');
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
            LockPlugin: {
                minDate: today,  // Блокировка дат до сегодняшнего дня
                minDays: 1,
               
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
                    console.log(rentDays)
                    console.log(seasonType)
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
                    const startDay = startDate.getDate();
                    currentDay = startDay;
                    const endDay = endDate.getDate();
                    finalDay = endDay;
                    const startMonth = months[startDate.getMonth()];
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

//first load flag
let isFirstLoad = true;

let price = [];
function changePrices(evt) {
    if (evt) evt.preventDefault(); // Предотвращаем дефолтное действие только если evt существует
    price = [];
    lessThanMinimum = false;
    const preloader = document.querySelector('.preloader');
    const preloaderOverlay = document.querySelector('.preloader-overlay');

    // Показываем прелоудер всегда, если evt существует
    if (evt) {
        preloader.classList.remove('hidden');
        preloaderOverlay.classList.remove('hidden');
    }

    fetch('https://phuket-cars-default-rtdb.asia-southeast1.firebasedatabase.app/.json')
        .then(response => response.json())
        .then(data => {
            if (data.cars) {
                data.cars.forEach(({ id, name, imgUrl, lowMonthPrice, lowSeasonPrice3, lowSeasonPrice5, lowSeasonPrice7, lowSeasonPrice10, lowSeasonPrice16, highMonthPrice, highSeasonPrice7, highSeasonPrice10, highSeasonPrice16, extremeMonthPrice, extremeSeasonPrice7, extremeSeasonPrice10, extremeSeasonPrice16}) => {
                    price.push({
                        id, name, imgUrl, lowMonthPrice, lowSeasonPrice3, lowSeasonPrice5, lowSeasonPrice7, lowSeasonPrice10, lowSeasonPrice16, highMonthPrice, highSeasonPrice7, highSeasonPrice10, highSeasonPrice16, extremeMonthPrice, extremeSeasonPrice7, extremeSeasonPrice10, extremeSeasonPrice16
                    });
                });
                console.log(price)
            
                renderCars(); 
            }

           
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            // Прячем прелоудер в любом случае
            preloader.classList.add('hidden');
            preloaderOverlay.classList.add('hidden');
            const moveTo = new MoveTo({ duration: 1500 });
            const target = document.getElementById('section-cars');
            if (isFirstLoad) {
                isFirstLoad = false; 
            } else {
                moveTo.move(target);
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    changePrices(new Event('change')); 

});
//флаг - меньше ли количество выбранных дней, чем допустимо
let lessThanMinimum = false;
function renderCars() {
    const cols = document.querySelectorAll('.row .col');
    let selectPickup;
    let selectReturn;
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
    cols.forEach(col => {
        col.innerHTML = '';
    });

    price.forEach((car, index) => {
        const colIndex = index % cols.length; 
        const col = cols[colIndex]; 
        deliveryPrice = dataValuePickup + dataValueReturn;
        const startMonth = today.getMonth();
        const endMonth = defaultEndDate.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, startMonth + 1, 0).getDate(); // Последний день месяца
        let totalCost = 0;
        const isFullMonth = (currentDay === 1 && finalDay === daysInMonth && startMonth === endMonth);
        console.log(car.lowMonthPrice)
        let minRentDays = 0;
        let startPrice = 0;
        let rentPrice = 0;
        let forMonth = false;
        let moreThanMonth = false;
        if (seasonType === 'lowSeason') {
            minRentDays = 3;
            if (rentDays < minRentDays) {
                lessThanMinimum = true;
                rentDays = minRentDays;
            }
            startPrice = car.lowSeasonPrice3;
            rentPrice = startPrice;
            if (rentDays <= 4) {
                rentPrice = rentPrice;
                console.log(rentPrice)
            }
            if (rentDays > 4 && rentDays <= 6) {
                rentPrice = car.lowSeasonPrice5;
                console.log(rentPrice)
            }
            if (rentDays > 6 && rentDays <= 9) {
                rentPrice = car.lowSeasonPrice7;
                console.log(rentPrice)
            }
            if (rentDays > 9 && rentDays <= 15) {
                rentPrice = car.lowSeasonPrice10;
                console.log(rentPrice)
            }
            if (rentDays > 15 && rentDays <= 20) {
                rentPrice = car.lowSeasonPrice16;
                console.log(rentPrice)
            }
            if (rentDays > 20 && rentDays <= daysInCurrentMonth) {
                rentPrice = car.lowMonthPrice;
                forMonth = true;
                console.log(rentPrice)
            }
            if (rentDays > daysInCurrentMonth) {
                rentPrice = 'Цена по запросу'
                moreThanMonth = true;
                console.log(rentPrice)
            }
        }
        if (seasonType === 'highSeason') {
            minRentDays = 7;
            if (rentDays < minRentDays) {
                lessThanMinimum = true;
                rentDays = minRentDays;
            }
            startPrice = car.highSeasonPrice7;
            rentPrice = startPrice;
            if (rentDays <= 9) {
                rentPrice = rentPrice;
            }
            if (rentDays > 9 && rentDays <= 15) {
                rentPrice = car.highSeasonPrice10;
            }
            if (rentDays > 15 && rentDays <= 20) {
                rentPrice = car.highSeasonPrice16;
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
            minRentDays = 7;
            if (rentDays < minRentDays) {
                lessThanMinimum = true;
                rentDays = minRentDays;
            }
            startPrice = car.extremeSeasonPrice7;
            rentPrice = startPrice;
            if (rentDays <= 9) {
                rentPrice = rentPrice;
            }
            if (rentDays > 9 && rentDays <= 15) {
                rentPrice = car.extremeSeasonPrice10;
            }
            if (rentDays > 15 && rentDays <= 20) {
                rentPrice = car.extremeSeasonPrice16;
            }
            if (rentDays > 20 && rentDays <= daysInCurrentMonth) {
                rentPrice = car.extremeMonthPrice;
                forMonth = true;
            }
            if (rentDays > daysInCurrentMonth) {
                rentPrice = 'Цена по запросу';
                moreThanMonth = true;
            }
        }
        const markup = `
    <div class="entry" data-id="${car.id}">
        <a href="/${car.carUrl}"><img src="${car.imgUrl}" alt="${car.name}"></a>
        <div class="content content-finder">
            <h5 class="car-name" data-name="${car.name}">${car.name}</h5>
            ${!moreThanMonth && !forMonth ? `
                <p class="initial-price">
                    <span>${rentPrice}฿</span>/${'сутки'}
                </p>` : ''}
            ${!forMonth ? `<p class="total-price">
                    <span></span>${!moreThanMonth ? !forMonth ? rentPrice * rentDays + deliveryPrice : rentPrice + deliveryPrice : ''}${!moreThanMonth ? `฿ итого` : 'Цена по запросу'}
                </p>` : !moreThanMonth ? `${rentPrice + deliveryPrice}฿ итого` : ''}
                ${
                   lessThanMinimum ? `<span class="card-warning">*Цена за минимальный срок аренды - ${minRentDays} суток</span>` : ''
                }
            <button class="button open-popup">Оставить заявку</button>
        </div>
    </div>
`;
        
        col.insertAdjacentHTML('beforeend', markup);
    });
    deleteEmptyRows()
}
function deleteEmptyRows() {
    document.querySelectorAll('.row').forEach(row => {
        const cols = row.querySelectorAll('.col');
        let isEmpty = true;
    
        // Проверяем, содержит ли хотя бы один col текст или другие элементы
        cols.forEach(col => {
            if (col.textContent.trim() !== '' || col.children.length > 0) {
                isEmpty = false;
            }
        });
    
        // Удаляем строку, если все колонки пусты
        if (isEmpty) {
            row.remove();
        }
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


