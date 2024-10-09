const modalTemplate = `
<aside class="popup-overlay"></aside>
<aside class="popup hidden">
    <div class="popup__wrapper">
        <div class="popup__close">
            <img src="/img/popup-icons/close-modal-desk.svg" alt="close" id="close-modal">
        </div>
        <div class="popup__content-wrapper">
            <div class="popup__header">
                <p>Забронировать авто <span class="auto-name"></span></p>
            </div>
            <div class="popup__offer">
                <p>Для бронирования автомобиля свяжитесь с нами удобным вам способом:</p>
            </div>
            <div class="popup__links">
                <a class="whats-app__link button-link" id="modal-whatsapp-link" href="#">
                    <img src="/img/popup-icons/whatsapp-icon.svg" alt="whatsapp-icon">
                    <p>Whatsapp</p>
                </a>
                <a class="telegram__link button-link" href="https://t.me/artemder">
                    <img src="/img/popup-icons/telegram-icon.svg" alt="telegram-icon">
                    <p>Telegram</p>
                </a>
            </div>
            <div class="popup__phone">
                <a href="#">+66 82 30 30 400</a>
            </div>
            <div class="popup__privacy">
                <p>Нажимая на кнопку "Whatsapp" или "Telegram" вы тем самым выражаете согласие на обработку персональных данных в соответствии с политикой конфиденциальности</p>
            </div>
        </div>
    </div>
</aside>`;

document.addEventListener('DOMContentLoaded', () => {
    const modalNavBar = document.querySelector('.navbar');

    // Получаем все элементы с классом .row
    const rows = document.querySelectorAll('.row');

    // Назначаем обработчик события клика для каждой .row
    rows.forEach(row => {
        row.addEventListener('click', function(evt) {
            if (evt.target.closest('.open-popup')) {
                openModal(evt);
            }
        });
    });

    function openModal(evt) {
        document.body.insertAdjacentHTML('beforeend', modalTemplate);
        const popup = document.querySelector('.popup');
        const autoName = popup.querySelector('.auto-name');
        const overlay = document.querySelector('.popup-overlay');
        const whatsAppLink = document.getElementById('modal-whatsapp-link');

        const contentElement = evt.target.closest('.content-finder');
        if (contentElement) {
            const carNameElement = contentElement.querySelector('.car-name');
            const carName = carNameElement.dataset.name;
            autoName.textContent = carName;
            whatsAppLink.href = `https://api.whatsapp.com/send?phone=66823030400&text=Здравствуйте!%20Я%20хотел%20бы%20арендовать%20автомобиль%20${carName}%20на%20даты:`;
        } else {
            autoName.textContent = "";
            whatsAppLink.href = `https://api.whatsapp.com/send?phone=66823030400&text=Здравствуйте!%20Я%20хотел%20бы%20арендовать%20автомобиль%20на%20даты:`; 
        }

        popup.classList.remove('hidden');
        overlay.style.display = 'block';
        overlay.style.position = 'fixed';
        document.body.classList.add('popup-open');
        
        if (window.innerWidth < 460) {
            document.body.classList.add('fixed');
            modalNavBar.classList.add('hidden');
        }

        document.getElementById('close-modal')?.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    function closeModal() {
        const popup = document.querySelector('.popup');
        const overlay = document.querySelector('.popup-overlay');
        if (popup) {
            popup.remove();
        }
        if (overlay) {
            overlay.remove();
        }
        document.body.classList.remove('popup-open');
        if (window.innerWidth < 460) {
            modalNavBar.classList.remove('hidden');
            document.body.classList.remove('fixed');
        }
    }
});

function adjustPopupHeight() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.style.height = `${window.innerHeight}px`;
    }
}

window.addEventListener('resize', adjustPopupHeight);
window.addEventListener('load', adjustPopupHeight);
