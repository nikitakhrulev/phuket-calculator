const deskSubt = document.querySelector('.image-subtitle-desktop');
const mobSubt = document.querySelector('.image-desciption__mobile');

const subtContent = `Бесплатная доставка в аэропорт <br>
						Кредитная карта не нужна <br>
						Машины застрахованы`;

document.addEventListener('DOMContentLoaded', setSubt);

function setSubt() {
    if (window.innerWidth <= 768) {
        mobSubt.insertAdjacentHTML('beforeend', subtContent);
    } else {
        deskSubt.insertAdjacentHTML('beforeend', subtContent);
    }
}