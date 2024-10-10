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
                renderCars(); 
            }

            const carListItems = document.querySelectorAll('.your-card-selector'); // Замените на ваш селектор
            carListItems.forEach(card => card.remove());
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
        console.log(lowMonthPrice)
        const isFullMonth = (currentDay === 1 && finalDay === daysInMonth && startMonth === endMonth);

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
            }
            if (rentDays > 4 && rentDays <= 6) {
                rentPrice = car.lowSeasonPrice5;
            }
            if (rentDays > 6 && rentDays <= 9) {
                rentPrice = car.lowSeasonPrice7;
            }
            if (rentDays > 9 && rentDays <= 15) {
                rentPrice = car.lowSeasonPrice10;
            }
            if (rentDays > 15 && rentDays <= 20) {
                rentPrice = car.lowSeasonPrice16;
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
                rentPrice -= car.extremeSeasonPrice10;
                console.log(rentPrice)
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
}