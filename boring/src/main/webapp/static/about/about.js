document.addEventListener('DOMContentLoaded', function () {
    var whatWeDo = document.getElementById('what-we-do-text');
    var us = document.getElementById('us-text');

    // 选择所有的 h1 元素
    document.querySelectorAll('.content-box h1').forEach(function (header) {
        header.addEventListener('click', function(event) {
            var targetId = event.target.nextElementSibling.id;

            if (targetId === 'what-we-do-text') {
                if (whatWeDo.classList.contains('hidden')) {
                    whatWeDo.classList.remove('hidden');
                    whatWeDo.classList.add('visible');
                } else {
                    whatWeDo.classList.remove('visible');
                    whatWeDo.classList.add('hidden');
                }
            } else if (targetId === 'us-text') {
                if (us.classList.contains('hidden')) {
                    us.classList.remove('hidden');
                    us.classList.add('visible');
                } else {
                    us.classList.remove('visible');
                    us.classList.add('hidden');
                }
            }
        });
    });
});
