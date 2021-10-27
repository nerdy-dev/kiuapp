const IS_APP_INSTALLED = window.matchMedia('(display-mode: standalone)').matches;
const IS_IOS = navigator.vendor && navigator.vendor.indexOf('Apple') > -1;
const IS_ANDROID = /(android)/i.test(navigator.userAgent);
const IS_SAFARI = IS_IOS && navigator.userAgent && navigator.userAgent.indexOf('CriOS') == -1 && navigator.userAgent.indexOf('FxiOS') == -1;
const DAY = 86400000;


const CONTAINER = $('#container').first();
const OVERLAY = $('#overlay').first();
const DATE_FORMAT = {
    month: 'long',
    day: 'numeric',
};
const TIME_FORMAT = {
    hour: '2-digit',
    minute: '2-digit'
};
const DATE_TIME_FORMAT = {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

var FOCUS = true;



if (IS_SAFARI && USER_ID < 1) {
    document.getElementsByClassName('bm-copyright')[0].style.lineHeight = 2;
    document.getElementsByClassName('bm-copyright')[0].style.paddingBottom = '1rem';
}

lang_deinit();
lang_init();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    $('#lightmode_selector').trigger('chnage');
});

$(document).on('click', '[href="#install"]', function (e) {
    e.preventDefault();
    install_pwa();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('service.js', {
            scope: '/kiu/',
        }).then(function (registration) {
            //console.log('ServiceWorker registered');
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        }).catch(function (err) {
            console.log(err);
        });
    });
} else {
    console.log('service worker is not supported');
}
window.addEventListener('blur', function () {
    FOCUS = false;
});
window.addEventListener('focus', function () {
    if (!FOCUS) {
        FOCUS = true;
        refocus();
    }
});
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    this.deferredPrompt = e;
    return false;
});

function refocus() {
    if (typeof redate == 'undefined') return;
    const dateChanged = redate();
    if (!dateChanged && CURRENT_VIEW == 'DAY' && CURRENT_DAY == TODAY_INDEX) {
        const today_classes = get_classes_by_index(TODAY_INDEX);
        const now = new Date();
        if (today_classes.length > 0 && today_classes[today_classes.length - 1].end < now) {
            day_by_index_relative(1);
        }
    }
}



var container_last_y = 0;

function adjust_container() {
    const y = CONTAINER.offset().top;
    if (container_last_y != y) {
        container_last_y = y;
        DP_CONTAINER.css('height', 'calc(100vh - ' + container_last_y + 'px)');
        DP_CONTAINER.css('top', container_last_y + 'px');
    }
}
adjust_container();
$(window).on('resize', adjust_container);

function loader(show, text = '') {
    document.getElementById('loader_text').innerText = text;
    document.getElementById('loader').classList.toggle('show', show);
}

$(document).on('click', '[href="#reload"]', function (e) {
    e.preventDefault();
    loader(true);
    setTimeout(() => {
        location.href = "?reload";
    }, 200);
});
$(document).on('click', '[href="#lang"]', function (e) {
    e.preventDefault();
    if (LANG.locale == 'en-US') {
        lang_set('RU');
    } else {
        lang_set('EN');
    }
});
$(document).on('click', '[href="#signin"]', function (e) {
    e.preventDefault();
    $('#sign_in').modal('show');
});
$(document).on('click', '[href="#settings"]', function (e) {
    e.preventDefault();
    $('#settings').modal('show');
});
$(document).on('click', '#s_btn', function () {
    loader(true);
});
$(document).on('click', '.btn-icon.animated:not(.disabled)', function () {
    const btn = $(this);
    btn.addClass('pressed');
    setTimeout(() => {
        btn.removeClass('pressed');
    }, 300);
});

function install_pwa() {
    console.log(this.deferredPrompt);
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then(choice => {
        console.log(choice);
    });
    this.deferredPrompt = null;
}


function weekday(date) {
    return LANG.weekdays[date.getDay()];
}

function lang_init() {
    $('[data-lang][data-lang-init=0]').each(function () {
        const t = $(this);
        const val = LANG[t.attr('data-lang')];
        if (t.is('[data-lang-html]')) {
            t.html(val);
        } else
        if (t.is('[data-lang-attr]')) {
            t.attr(t.attr('data-lang-attr'), val);
        } else {
            t.text(val);
        }
        t.attr('data-lang-init', '1');
    });
    if (typeof CURRENT_VIEW != 'undefined') {
        if (CURRENT_VIEW == 'DAY') {
            day_by_index(CURRENT_DAY);
        }
    }

}

function lang_deinit() {
    $('[data-lang]').attr('data-lang-init', '0').text('');
}

function lang_set(value) {
    lang_deinit();
    const now = new Date();
    $('#lang').replaceWith(`<script src="/kiu/js/lang/${value}.js?${now.getTime()}" id="lang"></script>`);
    Cookies.set('kiu_lang', value, {
        path: '/',
        domain: '.badm.dev',
        expires: 365,
    });
    lang_init();
}

function lightmode_set(value) {
    const now = new Date();
    $('#lightmode').remove();
    if (value) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = 'lightmode';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'css/light.css?' + new Date().getTime();
        link.media = 'all';
        head.appendChild(link);
    }
    Cookies.set('kiu_light', value ? 'yes' : 'no', {
        path: '/',
        domain: '.badm.dev',
        expires: 365,
    });
}