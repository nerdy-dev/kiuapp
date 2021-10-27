//#region Stickers
const STICKERS = {
    "alpaca": [
        "beach",
        "tired"
    ],
    "beagle": [
        "beach",
        "tired"
    ],
    "bunny": [
        "beach"
    ],
    "caveman": [
        "beach"
    ],
    "donkey": [
        "beach",
        "tired"
    ],
    "frog": [
        "beach"
    ],
    "lion": [
        "beach",
        "tired"
    ],
    "monk": [
        "beach",
        "tired"
    ],
    "teddy": [
        "beach"
    ],
    "cat": [
        "coffee"
    ],
    "cow": [
        "coffee",
        "spa"
    ],
    "koala": [
        "coffee",
        "spa",
        "tired"
    ],
    "sloth": [
        "coffee",
        "spa",
        "tired"
    ],
    "unicorn": [
        "coffee"
    ],
    "fox": [
        "spa",
        "tired"
    ],
    "pig": [
        "spa",
        "tired"
    ],
    "chihuahua": [
        "tired"
    ],
    "racoon": [
        "tired"
    ]
};
//#endregion

var STICKER_INDEX = -1;
var STICKER_IMAGS = [];

var TODAY = dateString(new Date());
var TODAY_INDEX = 0;
var CURRENT_DAY = 0;
var CURRENT_DAY_OFFSET = 0;
var CURRENT_DAY_CLASSES = null;

var DAY_DRAGGING = false;
var DAY_DRAGGING_CARD = null;
var DAY_DRAGGING_START = null;
var DAY_DRAGGING_END = null;
var DAY_DRAGGING_VELOCITY = null;
var DAY_DRAGGING_LAST_PROCESS = null;
var DAY_DRAGGING_PROCESS_TIME = 30;
var DAY_HOLD_INTERVAL = null;
var DAY_HOLD_START = null;
var DAY_EXT_DRAGGING = false;
var DAY_EXT_DRAGGING_CARD = null;
var DAY_EXT_DRAGGING_START = null;
var DAY_EXT_DRAGGING_END = null;
var DAY_EXT_DRAGGING_VELOCITY = null;
var DAY_EXT_DRAGGING_LAST_PROCESS = null;
var DAY_EXT_DRAGGING_PROCESS_TIME = 30;

for (let i = 0; i < 3; i++) {
    preload_sticker();
}


window.addEventListener('mousemove', function (e) {
    view_day_process_dragging(e.clientX, e.clientY);
    view_day_exp_process_dragging(e.clientY);
});
window.addEventListener('touchmove', function (e) {
    if (e.touches.length != 1) return;
    const touch = e.touches[0];
    view_day_process_dragging(touch.clientX, touch.clientY);
    view_day_exp_process_dragging(touch.clientY);
});
window.addEventListener('mouseup', function () {
    if (DAY_DRAGGING) {
        view_day_stop_dragging();
    }
    if (DAY_EXT_DRAGGING) {
        view_day_exp_stop_dragging();
    }
});
window.addEventListener('touchend', function () {
    if (DAY_DRAGGING) {
        view_day_stop_dragging();
    }
    if (DAY_EXT_DRAGGING) {
        view_day_exp_stop_dragging();
    }
});

$(document).on('click', '[data-day-button]', function () {
    const btn = $(this);
    if (btn.hasClass('disabled')) return;
    const action = btn.attr('data-day-button');
    switch (action) {
        case 'prev':
            day_swipe(true);
            break;
        case 'next':
            day_swipe(false);
            break;
        case 'today':
            if (CURRENT_DAY != TODAY_INDEX) {
                day_swipe(CURRENT_DAY > TODAY_INDEX, TODAY_INDEX);
            }
            break;

        default:
            break;
    }
});
$(document).on('click', '[data-show-comment]', function () {
    const id = $(this).attr('data-show-comment');
    var html = Autolinker.link(CLASSES_BY_ID[id].comment, {
        newWindow: true,
        className: 'link-bm wordwrap',
        stripPrefix: false,
        stripTrailingSlash: false,
    });
    $('#comment').html(html);
    $('#comment_md').modal('show');
});


function resize_day_view() {
    const card = $('#day_card');
    const buttons = $('#day_buttons');
    const h = card.height();
    const w = h / 1.25;
    const f = w / 600;
    CONTAINER.find('.day-card').css('width', w + 'px').css('font-size', f + 'rem');
    buttons.css('width', w + 'px');
}

function day_by_date(date) {
    day_by_index(DATE_TO_INDEX[dateString(date)]);
}

function day_by_index(index, load) {
    if (load == undefined) load = true;
    CURRENT_DAY = index;
    CURRENT_DAY_OFFSET = CURRENT_DAY - TODAY_INDEX;
    $('[data-day-button="prev"]').toggleClass('disabled', CURRENT_DAY == 0);
    $('[data-day-button="next"]').toggleClass('disabled', CURRENT_DAY == CLASSES.length - 1);
    $('[data-day-button="today"]').toggleClass('disabled', CURRENT_DAY_OFFSET == 0);
    if (load) day_by_index_load(index);
}

function day_by_index_load(index) {
    const date = DATES[index];
    const classes = get_classes_by_index(index);
    CURRENT_DAY_CLASSES = classes;
    day_html_load(index, date, classes);
}

function day_html_load(index, date, classes) {
    document.getElementById('day_card').style.filter = '';
    var title = date.toLocaleDateString(LANG.locale, DATE_FORMAT);
    var titleRaw = date.toLocaleDateString(LANG.locale, DATE_FORMAT);
    $('#day_date').text(title);
    $('#day_date_next').text(title);
    var classes_html = ``;
    if (classes.length < 1) {
        STICKER_INDEX++;
        const author = '@stickerfolio';
        const url = 'https://www.flaticon.com/authors/stickerfolio';
        const url_text = 'flaticon.com';
        classes_html = `
        <img class="sticker new" src="${STICKER_IMAGS[STICKER_INDEX].src}">
        <p class="sticker-credits text-muted">${LANG.stickers_credits.replace('%1%', author).replace('%2%', `<a class="link-light" target="_blank" href="${url}">${url_text}</a>`)}</p>
        `;
        preload_sticker();
    } else {
        // classes_html = `
        // <pre style="text-align: left;">${JSONSyntaxHighlight(JSON.stringify(classes, null, 1))}</pre>
        // `;
        var prev_class_end = classes[0].end;
        var prev_class_bld = classes[0].bld;
        classes.forEach(x => {
            if (prev_class_end < x.start) {
                var gap = x.start - prev_class_end;
                var gap_hr = 0;
                var gap_min = gap / 1000 / 60;
                if (gap > 59) {
                    gap_hr = Math.floor(gap_min / 60);
                    gap_min = gap_min % 60;
                }
                var gap_short = gap_hr < 1;
                if (gap_hr < 10) gap_hr = '0' + gap_hr;
                if (gap_min < 10) gap_min = '0' + gap_min;
                var gap_text = '';
                if (gap_short) {
                    gap_text = LANG.gap_short.replace('%1%', gap_min);
                } else {
                    gap_text = LANG.gap_long.replace('%1%', gap_hr + ':' + gap_min);
                }
                if (prev_class_bld != x.bld) {
                    gap_text += ' / ' + LANG.building_change;
                }
                classes_html += `
                <div class="day-class-gap${(prev_class_bld != x.bld) ? ' bld-change' : ''}">${gap_text}</div>`;
            }
            var aud = x.aud;
            if (x.bld != '') {
                aud = x.aud + '<br>' + x.bld;
                if (x.comment != '') {
                    aud = x.aud + ', ' + x.bld;
                }
            }
            var class_info = `<p class="day-class-aud">${aud}</p>`;
            if (x.comment != '') {
                class_info = `<p class="day-class-comment"><button class="btn btn-sm btn-bm" data-show-comment="${x.id}">${LANG.teacher_comment}</button></p>` + class_info;
            }
            classes_html += `
            <div class="day-class">
                <h6 class="day-class-name">${x.name}</h6>
                <div class="day-class-data">
                    <div class="day-class-time">${x.start.toLocaleTimeString(LANG.locale, TIME_FORMAT)}</div>
                    <div class="day-class-info">${class_info}</div>
                    <div class="day-class-time">${x.end.toLocaleTimeString(LANG.locale, TIME_FORMAT)}</div>
                </div>
            </div>
            `;
            prev_class_end = x.end;
            prev_class_bld = x.bld;
        });
    }
    var wday = weekday(date);
    var weekDate = new Date();
    const isToday = index == TODAY_INDEX;
    if (isToday) {
        title = LANG.today;
    }
    weekDate.setDate(weekDate.getDate() + 1);
    const isTomorrow = index == TODAY_INDEX + 1;
    if (isTomorrow) {
        title = LANG.tomorrow;
    }
    if (title != titleRaw) {
        wday += ' (' + titleRaw + ')';
    }
    var html = `
    <div class="day-wrapper">
        <div class="day-date">
            <h5>${title}</h5>
            <hr>
            <p class="mb-0">${wday}</p>
            <hr>
        </div>
        <div class="day-classes">
        ${classes_html}
        </div>
    </div>
    `;
    $('#day_content').html(html);
    $('#day_content_next').html(html);
    setTimeout(() => {
        $('.sticker.new').removeClass('new');
    }, 50);
    $('.day-classes').toggleClass('no-classes', classes.length < 1);
    $('#day_card').toggleClass('no-classes', classes.length < 1).toggleClass('today', isToday).toggleClass('tomorrow', isTomorrow);
    setTimeout(() => {
        if (index < 1 || index == CLASSES.length - 1) {
            $('.card-back:nth-child(3):visible').fadeOut(200);
        } else {
            $('.card-back:nth-child(3):hidden').fadeIn(200);
        }
        if (index < 2 || index == CLASSES.length - 2) {
            $('.card-back:nth-child(2):visible').fadeOut(200);
        } else {
            $('.card-back:nth-child(2):hidden').fadeIn(200);
        }
        if (index < 3 || index == CLASSES.length - 3) {
            $('.card-back:nth-child(1):visible').fadeOut(200);
        } else {
            $('.card-back:nth-child(1):hidden').fadeIn(200);
        }
    }, 200);
}

function day_debug_load() {
    day_html_load(0, new Date(), [{
            aud: "ауд.информ.безоп. (Зайцева, 17)",
            comment: "",
            date: new Date(),
            start: new Date('2021-09-01T12:00:00'),
            end: new Date('2021-09-01T13:00:00'),
            groups: "1091, 1092",
            name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            prof: "старший преподаватель Нагаев Н.Х.",

        }, {
            aud: "ауд.информ.безоп. (Зайцева, 17)",
            comment: "",
            date: new Date(),
            start: new Date('2021-09-01T14:30:00'),
            end: new Date('2021-09-01T16:00:00'),
            groups: "1091, 1092",
            name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            prof: "старший преподаватель Нагаев Н.Х.",

        },
        {
            aud: "ауд.информ.безоп. (Зайцева, 17)",
            comment: "",
            date: new Date(),
            start: new Date('2021-09-01T16:30:00'),
            end: new Date('2021-09-01T18:00:00'),
            groups: "1091, 1092",
            name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            prof: "старший преподаватель Нагаев Н.Х.",

        },
        {
            aud: "ауд.информ.безоп. (Зайцева, 17)",
            comment: "",
            date: new Date(),
            start: new Date('2021-09-01T18:10:00'),
            end: new Date('2021-09-01T19:00:00'),
            groups: "1091, 1092",
            name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            prof: "старший преподаватель Нагаев Н.Х.",

        },
    ]);
}

function day_by_index_relative(offset) {
    day_by_index(TODAY_INDEX + offset);
}

function day_today() {
    day_by_index(TODAY_INDEX);
}

function view_day() {
    CURRENT_VIEW = 'DAY';
    $('.view-toggle').show();
    $('#view_day').hide();
    CONTAINER.html(`
    <div class="cards-back">
        <div class="card day-card mx-auto card-back">
            <div class="card-body"></div>
        </div>
        <div class="card day-card mx-auto card-back">
            <div class="card-body"></div>
        </div>
        <div class="card day-card mx-auto card-back">
            <div class="card-body" id="day_content_next"></div>
        </div>
    </div>
    <div class="card day-card mx-auto" id="day_card">
        <div class="card-body" id="day_content"></div>
    </div>
    <div class="day-button-container">
        <div class="day-buttons" id="day_buttons">
            <a class="btn-icon day-button" data-day-button="prev"><i class="fas fa-chevron-left"></i></a>
            <a class="btn-icon day-button gold" data-day-button="today" style="margin-bottom: .3em;"><i class="fas fa-calendar-day"></i></a>
            <a class="btn-icon day-button" data-day-button="next"><i class="fas fa-chevron-right"></i></a>
        </div>
    </div>
    `);
    resize_day_view();
    const now = new Date();
    const today_classes = get_classes_by_index(TODAY_INDEX);
    if (today_classes.length > 0 && today_classes[today_classes.length - 1].end < now) {
        day_by_index_relative(1);
    } else {
        day_today();
    }
    //day_debug_load();
    const card = document.getElementById('day_card');

    card.addEventListener('mousedown', function (e) {
        DAY_DRAGGING_PROCESS_TIME = 10;
        view_day_start_dragging(e.clientX, e.clientY, card);
        if (DAY_HOLD_INTERVAL != null) clearInterval(DAY_HOLD_INTERVAL);
        if (get_classes_by_index(CURRENT_DAY).length > 0) {
            DAY_HOLD_START = new Date();
            DAY_HOLD_INTERVAL = setInterval(day_hold_interval, 100);
        }
    });
    card.addEventListener('touchstart', function (e) {
        const touch = e.touches[0];
        view_day_start_dragging(touch.clientX, touch.clientY, card);
        if (DAY_HOLD_INTERVAL != null) clearInterval(DAY_HOLD_INTERVAL);
        if (get_classes_by_index(CURRENT_DAY).length > 0) {
            DAY_HOLD_START = new Date();
            DAY_HOLD_INTERVAL = setInterval(day_hold_interval, 100);
        }
    });
}

function view_day_start_dragging(x, y, card) {
    if (CURRENT_VIEW != 'DAY') return;
    DAY_DRAGGING_START = [x, y];
    DAY_DRAGGING_END = [x, y];
    DAY_DRAGGING_VELOCITY = [0, 0];
    DAY_DRAGGING_CARD = card;
    DAY_DRAGGING_CARD.classList.add('moving');
    DAY_DRAGGING_LAST_PROCESS = new Date();
    DAY_DRAGGING = true;
}

function view_day_stop_dragging() {
    if (CURRENT_VIEW != 'DAY') return;
    DAY_DRAGGING_CARD.classList.remove('moving');
    const deltaX = DAY_DRAGGING_END[0] - DAY_DRAGGING_START[0];
    const deltaY = DAY_DRAGGING_END[1] - DAY_DRAGGING_START[1];
    const velocityX = DAY_DRAGGING_VELOCITY[0];
    const velocityY = DAY_DRAGGING_VELOCITY[1];
    const moveOutWidth = document.body.clientWidth;
    const right = deltaX > 0;
    const keepLast = (CURRENT_DAY == 0 && right) || (CURRENT_DAY == CLASSES.length - 1 && !right);
    const keep = Math.abs(deltaX) < 100 || Math.abs(velocityX) < 1.5 || keepLast;
    DAY_DRAGGING_CARD.classList.toggle('removed', !keep);
    if (keep) {
        DAY_DRAGGING_CARD.style.transform = '';
    } else {
        const endX = Math.max(Math.abs(velocityX) * moveOutWidth, moveOutWidth);
        const toX = right ? endX : -endX;
        const endY = Math.abs(velocityY) * moveOutWidth;
        const toY = deltaY > 0 ? endY : -endY;
        const rotate = deltaX * 0.03 * deltaY / 80;
        DAY_DRAGGING_CARD.style.transform = 'translate(' + toX + 'px, ' + (toY + deltaY) + 'px) rotate(' + rotate + 'deg)';
        day_after_swipe(DAY_DRAGGING_CARD, right);
    }
    DAY_DRAGGING = false;
}

function view_day_process_dragging(x, y) {
    if (CURRENT_VIEW != 'DAY' || !DAY_DRAGGING) return;
    const now = new Date();
    if (now - DAY_DRAGGING_LAST_PROCESS < DAY_DRAGGING_PROCESS_TIME) return;
    DAY_DRAGGING_LAST_PROCESS = now;
    DAY_DRAGGING_VELOCITY = [x - DAY_DRAGGING_END[0], y - DAY_DRAGGING_END[1]];
    DAY_DRAGGING_END = [x, y];
    const deltaX = DAY_DRAGGING_END[0] - DAY_DRAGGING_START[0];
    const deltaY = DAY_DRAGGING_END[1] - DAY_DRAGGING_START[1];
    const rotate = deltaX * 0.03 * deltaY / 80;
    DAY_DRAGGING_CARD.style.transform = 'translate(' + deltaX + 'px, ' + deltaY * 0.5 + 'px) rotate(' + rotate + 'deg)';
}

function day_swipe(right, indexOverride) {
    const card = document.getElementById('day_card');
    const moveOutWidth = document.body.clientWidth * 1.5;
    card.classList.add('removed');
    if (right) {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
    } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }
    day_after_swipe(card, right, indexOverride);
}

function day_after_swipe(card, right, indexOverride) {
    if (indexOverride == undefined) indexOverride = -1;
    if (indexOverride == -1) {
        if (right) {
            day_by_index(CURRENT_DAY - 1, false);
        } else {
            day_by_index(CURRENT_DAY + 1, false);
        }
    } else {
        day_by_index(indexOverride, false);
    }
    setTimeout(() => {
        card.classList.add('old');
        card.classList.add('new');
        card.style.transform = '';
        setTimeout(() => {
            card.classList.remove('old');
            day_by_index_load(CURRENT_DAY);
            card.classList.remove('new');
            card.classList.remove('removed');
        }, 50);
    }, 150);
}

function day_hold_interval() {
    const deltaX = DAY_DRAGGING_END[0] - DAY_DRAGGING_START[0];
    const deltaY = DAY_DRAGGING_END[1] - DAY_DRAGGING_START[1];
    if ((deltaX > 2 || deltaY > 2 || !DAY_DRAGGING) && DAY_HOLD_INTERVAL != null) {
        clearInterval(DAY_HOLD_INTERVAL);
        document.getElementById('day_card').style.filter = '';
        return;
    }
    const now = new Date();
    const time = now - DAY_HOLD_START;
    if (time >= 450) {
        clearInterval(DAY_HOLD_INTERVAL);
        if ((deltaX > 2 || deltaY > 2 || !DAY_DRAGGING)) {
            document.getElementById('day_card').style.filter = '';
            return;
        }
        day_expand();
    } else {
        const card = document.getElementById('day_card');
        const scale = 1 + time / 450 / 75;
        const blur = time / 300;
        card.style.transform = 'scale(' + scale + ')';
        card.style.filter = 'blur(' + blur + 'px)';
    }
}

function day_expand() {
    document.getElementById('day_card').style.filter = '';
    const date = DATES[CURRENT_DAY];
    const classes = CURRENT_DAY_CLASSES;
    var title = date.toLocaleDateString(LANG.locale, DATE_FORMAT);
    var wday = weekday(date);
    var weekDate = new Date();
    weekDate.setDate(weekDate.getDate() + 1);
    var classes_html = '';
    var first = true;
    if (classes.length > 0) {
        var prev_class_end = classes[0].end;
        var prev_class_bld = classes[0].bld;
        classes.forEach(x => {
            if (first) first = false;
            else classes_html += '<hr class="ec-hr">';
            if (prev_class_end < x.start) {
                var gap = x.start - prev_class_end;
                var gap_hr = 0;
                var gap_min = gap / 1000 / 60;
                if (gap > 59) {
                    gap_hr = Math.floor(gap_min / 60);
                    gap_min = gap_min % 60;
                }
                var gap_short = gap_hr < 1;
                if (gap_hr < 10) gap_hr = '0' + gap_hr;
                if (gap_min < 10) gap_min = '0' + gap_min;
                var gap_html = '';
                if (gap_short) {
                    gap_html = LANG.gap_short.replace('%1%', gap_min);
                } else {
                    gap_html = LANG.gap_long.replace('%1%', gap_hr + ':' + gap_min);
                }
                if (prev_class_bld != x.bld) {
                    gap_html += `
                    <div class="ec-bld-change">
                        <div class="ec-bld-title">${LANG.building_change}</div>
                        <div class="ec-bld-text">${LANG.building_change_go.replace('%1%', `<span class="ec-bld-name">${prev_class_bld}</span>`).replace('%2%', `<span class="ec-bld-name">${x.bld}</span>`)}</div>
                    </div>
                    `;
                }
                classes_html += `
                <div class="ec-gap">
                    ${gap_html}
                </div>
                <hr class="ec-hr">`;
            }
            var comment_html = '';
            if (x.comment != '') {
                comment_html = `<p class="day-class-comment"><button class="btn btn-sm btn-bm" data-show-comment="${x.id}">${LANG.teacher_comment}</button></p>`;
            }
            classes_html += `
            <div class="expanded-class">
                <h6 class="ec-name">${x.name}</h6>
                <div class="ec-summary">
                    <div class="ec-summary-cell">
                        ${x.type}
                    </div>
                    <div class="ec-summary-divider"></div>
                    <div class="ec-summary-cell">
                        ${x.aud}
                    </div>
                    <div class="ec-summary-divider"></div>
                    <div class="ec-summary-cell">
                        ${x.groups}
                    </div>
                </div>
                <div class="ec-prof">${x.prof.type} <span class="font-weight-bold">${x.prof.name}</span></div>
                ${comment_html}
                <div class="ec-bld">${x.bld}</div>
            </div>
            `;
            prev_class_end = x.end;
            prev_class_bld = x.bld;
        });
    } else {
        classes_html = `<p class="text-center mt-4">${LANG.noclasses}</p>`;
    }
    OVERLAY.html(`
    <div class="day-expanded" id="day_exp">
        <div class="day-expanded-bar"></div>
        <div class="day-expanded-content" id="day_exp_content">
            <div class="day-expanded-date">
                <h3>${title}</h3>
                <p class="mb-0">${wday}</p>
            </div>
            <hr>
            <div class="expanded-classes">
                ${classes_html}
            </div>
        </div>
    </div>
    `);
    const card = document.getElementById('day_exp');
    const content = document.getElementById('day_exp_content');
    card.addEventListener('mousedown', function (e) {
        console.log(card.scrollTop);
        if (content.scrollTop < 1) {
            DAY_EXT_DRAGGING_PROCESS_TIME = 10;
            view_day_exp_start_dragging(e.clientY, card);
        }
    });
    card.addEventListener('touchstart', function (e) {
        if (content.scrollTop < 1 && e.touches.length == 1) {
            const touch = e.touches[0];
            view_day_exp_start_dragging(touch.clientY, card);
        }
    });
    setTimeout(() => {
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        view_day_stop_dragging();
        OVERLAY.addClass('active');
    }, 100);
}

function view_day_exp_start_dragging(y, card) {
    if (CURRENT_VIEW != 'DAY') return;
    DAY_EXT_DRAGGING_START = y;
    DAY_EXT_DRAGGING_END = y;
    DAY_EXT_DRAGGING_VELOCITY = 0;
    DAY_EXT_DRAGGING_CARD = card;
    DAY_EXT_DRAGGING_CARD.classList.add('moving');
    DAY_EXT_DRAGGING_LAST_PROCESS = new Date();
    DAY_EXT_DRAGGING = true;
}

function view_day_exp_stop_dragging() {
    if (CURRENT_VIEW != 'DAY') return;
    DAY_EXT_DRAGGING_CARD.classList.remove('moving');
    const delta = DAY_EXT_DRAGGING_END - DAY_EXT_DRAGGING_START;
    const keep = Math.abs(delta) < 150 || Math.abs(DAY_EXT_DRAGGING_VELOCITY) < 1.5;
    if (delta < 1 || keep) {
        DAY_EXT_DRAGGING_CARD.style.transform = '';
    } else {
        const y = window.innerHeight;
        DAY_EXT_DRAGGING_CARD.style.transform = 'translateY(' + y + 'px)';
        setTimeout(() => {
            OVERLAY.removeClass('active');
        }, 100);
    }
    DAY_EXT_DRAGGING = false;
}

function view_day_exp_process_dragging(y) {
    if (CURRENT_VIEW != 'DAY' || !DAY_EXT_DRAGGING) return;
    const now = new Date();
    if (now - DAY_EXT_DRAGGING_LAST_PROCESS < DAY_EXT_DRAGGING_PROCESS_TIME) return;
    DAY_EXT_DRAGGING_LAST_PROCESS = now;
    DAY_EXT_DRAGGING_VELOCITY = y - DAY_EXT_DRAGGING_END;
    DAY_EXT_DRAGGING_END = y;
    var delta = DAY_EXT_DRAGGING_END - DAY_EXT_DRAGGING_START;
    if (delta < 0) delta = 0;
    DAY_EXT_DRAGGING_CARD.style.transform = 'translateY(' + delta + 'px)';
}

function preload_sticker() {
    const char = get_random(Object.keys(STICKERS));
    const type = get_random(STICKERS[char]);
    var img = new Image();
    img.src = `img/stickers/${type}/${char}.png`;
    STICKER_IMAGS.push(img);
}