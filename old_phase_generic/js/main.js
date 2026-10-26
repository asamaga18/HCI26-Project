const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.tab-page');

buttons.forEach(function (btn) {
    btn.addEventListener('click', function() {
        pages.forEach(function (p) { p.classList.remove('active'); });
        buttons.forEach(function (b) { b.classList.remove('active'); });
        document.getElementById(btn.dataset.tab).classList.add('active');
        btn.classList.add('active');
    });
});