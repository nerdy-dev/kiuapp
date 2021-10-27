var CLASSES = [];
var CLASSES_BY_ID = {};
var CLASS_NAMES = [];
var TEACHERS = {};
var DATES = [];
var DATE_TO_INDEX = {};
var CURRENT_VIEW = 'NONE';
var CURRENT_OVERLAY = 'NONE';
var LAST_UPDATE = new Date();
var KIU = true;
var CALENDAR = null;

$(function () {
    reonline();
    reping();
    update(function () {
        view_day();
        setInterval(redate, 5000);
        setInterval(reupdate, 10000);
        setInterval(reping, 300000);
        setInterval(reonline, 300000);
    });
});
$(window).on('resize', function () {
    if (CURRENT_VIEW == 'DAY') resize_day_view();
});
$('body').on('keydown', function (e) {
    if (CURRENT_VIEW == 'DAY') {
        switch (e.keyCode) {
            case 37:
                $('[data-day-button="prev"]').trigger('click');
                break;
            case 39:
                $('[data-day-button="next"]').trigger('click');
                break;
            case 40:
                $('[data-day-button="today"]').trigger('click');
                break;
            default:
                break;
        }
    }
});

$(document).on('click', '[href="#signout"]', function (e) {
    e.preventDefault();
    loader(true);
    setTimeout(() => {
        location.href = '/kiu/?out';
    }, 100);
});
$(document).on('click', '[href="#calendar"]', function (e) {
    e.preventDefault();
    toggle_overlay('CALENDAR', ``, function () {
        document.getElementById('overlay').appendChild(CALENDAR);
        var el = document.querySelector('.calendar-day.current');
        if (el != null) el.classList.remove('current');
        el = document.querySelector('.calendar-day.today');
        if (el != null) el.classList.remove('today');
        el = document.querySelector('.calendar-day[data-date="' + dateString(DATES[CURRENT_DAY]) + '"]');
        if (el != null) {
            el.classList.add('current');
            var scroll = el.offsetTop - window.innerHeight / 2;
            if (scroll < 0) scroll = 0;
            el.parentElement.scrollTop = scroll;
        }
        el = document.querySelector('.calendar-day[data-date="' + dateString(new Date()) + '"]');
        if (el != null) el.classList.add('today');


    });
});
$(document).on('click', '[href="#search"]', function (e) {
    e.preventDefault();
    toggle_overlay('SEARCH', `
    <div class="search-wrapper">
        <div class="search-box">
            <input type="text" autocomplete="off" id="search" placeholder="${LANG.search_placeholder}">
            <i class="fas fa-search search-icon"></i>
        </div>
        <div class="search-results" id="search_results">
        </div>
    </div>
    `, function () {
        document.getElementById('search').focus();
        setTimeout(() => {
            document.getElementById('search').focus();
        }, 200);
        setTimeout(() => {
            document.getElementById('search').focus();
        }, 350);
        setTimeout(() => {
            document.getElementById('search').focus();
        }, 500);
        document.getElementById('search').addEventListener('input', function () {
            search(this.value);
        });
    });
});
$(document).on('click', '[href="#view:day"]', function (e) {
    e.preventDefault();
    view_day();
});
$(document).on('click', '[href="#view:week"]', function (e) {
    e.preventDefault();
    view_week();
});

document.getElementById('force_update').addEventListener('click', function () {
    if (this.classList.contains('disabled')) return;
    this.classList.add('disabled');
    update(view_day, true);
});

$('#lang_selector').on('change', function () {
    lang_set($(this).val());
    preference('language', $(this).val());
    update(view_day);
});
$('#lightmode_selector').on('change', function () {
    var value = $(this).val();
    lightmode_set(value == 'light' || (value == 'system' && !(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)));
    if ($(this).is('.init')) return;
    preference('theme', value);
});
$('#update_time_selector').on('change', function () {
    var value = Number($(this).val());
    UPDATE_TIMEOUT = value;
    preference('update_time', value);
});
$('#lightmode_selector').addClass('init').trigger('change').removeClass('init');

OVERLAY.on('click', function () {
    if (OVERLAY.find('div:hover').length < 1) {
        OVERLAY.removeClass('active');
    }
});

function update(onDone, force, attempt = 1) {
    console.log('Updating');
    if (onDone == undefined) onDone = function () {};
    if (force == undefined) force = false;
    LAST_UPDATE = new Date();
    loader(true, LANG.schedule_updating);
    $.post('', {
        action: 'update',
        force: force ? 1 : 0,
    }, function (data) {
        //console.log(data);
        CLASSES = [];
        CLASSES_BY_ID = {};
        CLASS_NAMES = [];
        TEACHERS = {};
        DATES = [];
        DATE_TO_INDEX = {};
        var CLASS_ID = 0;
        console.log(data);
        try {
            data = JSON.parse(data);
        } catch (error) {
            if (attempt > 5) {
                location.reload();
                return;
            }
            update(onDone, force, attempt + 1);
            return;
        }
        const version = new Date(data.loaded);
        document.getElementById('last_updated').innerText = version.toLocaleDateString(LANG.locale, DATE_TIME_FORMAT);
        data = data.classes;
        var first = true;
        var realToday = dateString(new Date());
        var today = new Date();
        var todayString = dateString(today);
        var todayClasses = [];
        var minDate = new Date();
        var maxDate = new Date();
        console.log('Processing classes');
        for (let i = 0; i < data.length; i++) {
            CLASS_ID++;
            const x = data[i];
            var start = dte(x.start);
            var date = dateString(start);
            if (i == 0) {
                minDate = dte(x.start);
            }
            if (i == data.length - 1) {
                maxDate = dte(x.start);
            }
            if (first) {
                first = false;
                today = start;
                todayString = dateString(today);
            }
            if (date == todayString) {
                var aud = str(x.auditorium);
                if (aud.includes('(')) {
                    aud = aud.split('(');
                    const bld = '(' + aud.pop();
                    aud = [aud.join('('), bld];
                } else {
                    aud = [aud, ''];
                }
                var type = str(x.activityType);
                if (LANG.class_types[type] != undefined) type = LANG.class_types[type];
                let teacher = str(x.teachers);
                let prof = {
                    name: '',
                    type: '',
                };
                for (const token in LANG.teacher_types) {
                    if (Object.hasOwnProperty.call(LANG.teacher_types, token)) {
                        const type = LANG.teacher_types[token];
                        prof.type = type;
                        teacher = teacher.replace(token, '');
                    }
                }
                prof.name = teacher.trim();
                let prof_name_ru = prof.name;
                let prof_name_eng = englishify(prof_name_ru);
                if (LANG.locale == 'en-US') prof.name = prof_name_eng;
                if (TEACHERS[prof.name] == undefined) {
                    TEACHERS[prof.name] = [
                        prof_name_ru,
                        prof_name_eng,
                    ];
                }
                let building = trimAny(aud[1].replace(',', ' ').replace('  ', ' '), '()');
                for (const token in LANG.buildings) {
                    if (Object.hasOwnProperty.call(LANG.buildings, token)) {
                        const name = LANG.buildings[token];
                        building = building.replace(token, name);
                    }
                }
                let auditorium = replaceAll(aud[0].replace('ауд.', '').trim(), '.', '. ').trim();
                if (auditorium == 'Тимс') auditorium = LANG.teams;
                else {
                    if (LANG.locale == 'en-US') auditorium = englishify(auditorium);
                    auditorium = LANG.auditorium + ' ' + auditorium;
                }
                if (building == auditorium) building = '';
                let name = str(x.discipline);
                if (!CLASS_NAMES.includes(name)) CLASS_NAMES.push(name);
                const cl = {
                    id: CLASS_ID,
                    type: type,
                    aud: auditorium,
                    bld: building,
                    name: name,
                    prof: prof,
                    comment: str(x.teacherComment),
                    groups: str(x.stream),
                    //time: str(x.fulltime),
                    date: start,
                    start: start,
                    end: dte(x.end),
                };
                todayClasses.push(cl);
                CLASSES_BY_ID[CLASS_ID] = cl;

            } else {
                CLASSES.push(todayClasses);
                DATES.push(new Date(today.getTime()));
                DATE_TO_INDEX[todayString] = CLASSES.length - 1;
                if (todayString == realToday) {
                    TODAY_INDEX = DATE_TO_INDEX[todayString];
                }
                today.setDate(today.getDate() + 1);
                todayString = dateString(today);
                todayClasses = [];
                i--;
            }
        }
        console.log('Classes processed');
        create_calendar();
        if (false) {
            console.log(CLASSES);
            console.log(DATES);
            console.log(DATE_TO_INDEX);
        }
        setTimeout(() => {
            loader(false);
        }, 200);
        onDone();
    });
}

function reupdate() {
    const now = new Date();
    if (now - LAST_UPDATE > UPDATE_TIMEOUT * 3600000) {
        update();
    }
}

function redate() {
    const today = new Date();
    const todayString = dateString(today);
    if (TODAY != todayString) {
        console.log(`Today changed from '${TODAY}' to '${todayString}'`);
        const index = DATE_TO_INDEX[todayString];
        const offset = index - TODAY_INDEX;
        console.log(`Today Index changed from '${TODAY_INDEX}' to '${index}'`);
        TODAY = todayString;
        TODAY_INDEX = index;
        CURRENT_DAY_OFFSET = CURRENT_DAY + offset;
        if (CURRENT_VIEW == 'DAY') {
            console.log(`Reloading Current Day ${CURRENT_DAY}`);
            day_by_index(CURRENT_DAY, true);
        }
        return true;
    }
    return false;
}

function toggle_overlay(name, html, onOpen, onClose) {
    if (OVERLAY.hasClass('active')) {
        if (CURRENT_OVERLAY == name) {
            CURRENT_OVERLAY = 'NONE';
            OVERLAY.removeClass('active');
            if (onClose != undefined) onClose();
            return;
        } else {
            CURRENT_OVERLAY = name;
            OVERLAY.removeClass('active');
            if (onClose != undefined) onClose();
            setTimeout(() => {
                $('#overlay').html(html);
                if (onOpen != undefined) onOpen();
                setTimeout(() => {
                    OVERLAY.addClass('active');
                }, 100);
            }, 200);
        }
    } else {
        CURRENT_OVERLAY = name;
        $('#overlay').html(html);
        if (onOpen != undefined) onOpen();
        setTimeout(() => {
            OVERLAY.addClass('active');
        }, 100);
    }
    OVERLAY.attr('data-overlay', CURRENT_OVERLAY.toLowerCase());
}

function preference(name, value) {
    $.post('?pref', {
        name: name,
        value: value,
    }, function (data) {
        if (data == 'ok') {
            console.log(`Preference '${name}' updated to '${value}'`)
        } else {
            console.log(data);
        }
    });
}


function search(query) {
    const now = new Date();
    const num = Number(query);
    var results = [];
    if (!isNaN(num)) {
        let date = guess_date_from_delimer(query, '.', false);
        if (date == undefined) date = guess_date_from_delimer(query, '/', true);
        if (date != undefined) {
            if (date < DATES[0] || date > DATES[DATES.length - 1]) date.setFullYear(date.getFullYear() - 1);
            if (date < DATES[0] || date > DATES[DATES.length - 1]) date.setFullYear(date.getFullYear() + 2);
            if (date >= DATES[0] && date <= DATES[DATES.length - 1]) {
                results.push({
                    html: `${LANG.schedule_for} <strong>${format_date_ordinal(date)}</strong>`,
                    onClick: function (e) {
                        day_by_date(date);
                        toggle_overlay('SEARCH');
                    },
                });
            }
        } else
        if (!query.includes('.')) {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            if (num >= 1 && num <= daysInMonth) {
                const date = new Date(now.getFullYear(), now.getMonth(), num);
                results.push({
                    html: `${LANG.schedule_for} <strong>${format_date_ordinal(date)}</strong>`,
                    onClick: function (e) {
                        day_by_date(date);
                        toggle_overlay('SEARCH');
                    },
                });
            }
        }
    } else {
        if (LANG.today.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                html: `${LANG.schedule_for} <strong>${LANG.today}, ${format_date_ordinal(now)}</strong>`,
                onClick: function (e) {
                    day_by_index_relative(0);
                    toggle_overlay('SEARCH');
                },
            });
        }
        if (LANG.tomorrow.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                html: `${LANG.schedule_for} <strong>${LANG.tomorrow}, ${format_date_ordinal(new Date(now.getTime() + DAY))}</strong>`,
                onClick: function (e) {
                    day_by_index_relative(1);
                    toggle_overlay('SEARCH');
                },
            });
        }
        if (query.length >= 2) {
            for (let i = 0; i < CLASS_NAMES.length; i++) {
                const name = CLASS_NAMES[i];
                if (name.toLowerCase().includes(query.toLowerCase())) {
                    //TODO
                    // results.push({
                    //     html: `<strong>${name}</strong>: ${LANG.next_class}`,
                    //     onClick: function (e) {
                    //         console.log(123);
                    //     },
                    // });
                    // results.push({
                    //     html: `<strong>${name}</strong>: ${LANG.all_classes}`,
                    //     onClick: function (e) {
                    //         console.log(123);
                    //     },
                    // });
                }
            }
            for (const key in TEACHERS) {
                if (Object.hasOwnProperty.call(TEACHERS, key)) {
                    const arr = TEACHERS[key];
                    if (arr[0].toLowerCase().includes(query.toLowerCase()) || arr[1].toLowerCase().includes(query.toLowerCase())) {
                        let name = arr[0];
                        if (LANG.locale == 'en-US') name = arr[1];
                        //TODO
                        // results.push({
                        //     html: `<strong>${name}</strong>: ${LANG.next_class}`,
                        //     onClick: function (e) {
                        //         console.log(123);
                        //     },
                        // });
                        // results.push({
                        //     html: `<strong>${name}</strong>: ${LANG.all_classes}`,
                        //     onClick: function (e) {
                        //         console.log(123);
                        //     },
                        // });
                    }
                }
            }
        }
        let dates = guess_date_from_weekday(query);
        if (dates.length > 0) {
            for (let i = 0; i < dates.length; i++) {
                const date = dates[i];
                if (LANG.locale == 'ru-RU') date[1] = date[1].toLowerCase();
                results.push({
                    html: `${LANG.schedule_for} <strong>${date[1]}, ${format_date_ordinal(date[0])}</strong>`,
                    onClick: function (e) {
                        day_by_date(date[0]);
                        toggle_overlay('SEARCH');
                    },
                });
            }
        }
    }
    const container = document.getElementById('search_results');
    container.innerHTML = '';
    for (let i = 0; i < results.length; i++) {
        const x = results[i];
        var el = document.createElement('div');
        el.classList.add('search-result');
        el.innerHTML = x.html;
        el.addEventListener('click', function (e) {
            x.onClick(e);
        });
        container.append(el);
    }
}

function format_date_ordinal(date) {
    var formatted = date.toLocaleDateString(LANG.locale, DATE_FORMAT);
    if (LANG.locale == 'en-US') {
        return formatted.replace(date.getDate(), ordinal(date.getDate()));
    }
    return formatted;
}

function guess_date_from_delimer(query, delimer, american) {
    const now = new Date();
    if (query.includes(delimer)) {
        const split = query.split(delimer);
        if (split.includes('')) return undefined;
        if (split.length == 2) {
            const day = Number(split[american ? 1 : 0]);
            if (day < 1) return undefined;
            const month = Number(split[american ? 0 : 1]) - 1;
            if (month < 0) return undefined;
            const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();
            if (day > daysInMonth) return undefined;
            if (!isNaN(day) && !isNaN(month)) return new Date(now.getFullYear(), month, day);
        } else
        if (split.length == 3) {
            const day = Number(split[american ? 1 : 0]);
            if (day < 1) return undefined;
            const month = Number(split[american ? 0 : 1]) - 1;
            if (month < 0) return undefined;
            var year = Number(split[2]);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                if (year < 100) year += 2000;
                if (year < 2021 || year > now.getFullYear() + 1) return undefined;
                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth) return undefined;
                return new Date(year, month, day);
            }
        }
    }
    return undefined;
}

function guess_date_from_weekday(query) {
    let result = [];
    const now = new Date();
    for (let i = 0; i < LANG.weekdays.length; i++) {
        const w = LANG.weekdays[i];
        if (w.toLowerCase().includes(query.toLowerCase())) {
            let monday = new Date(now.getTime() - DAY * (now.getDay() - 1));
            let sunday = new Date(now.getTime() + DAY * (7 - now.getDay()));
            for (let j = monday.getTime(); j <= sunday.getTime(); j += DAY) {
                let date = new Date(j);
                if (date.getDay() == i) {
                    result.push([date, LANG.weekdays_ordinal[i]]);
                }
            }
        }
    }
    return result;
}

function reping() {
    $.get('?ping', function (data) {
        KIU = data == 'ok';
        document.getElementById('kiu_services').classList.toggle('red', !KIU);
        document.getElementById('kiu_services').classList.toggle('green', KIU);
        if (KIU) {
            setTimeout(() => {
                $id('force_update').classList.remove('disabled');
            }, 30000);
        }
    });
}

function get_date_by_index(index) {
    return CLASSES[Object.keys(CLASSES)].date;
}

function get_classes_by_index(index) {
    return CLASSES[index];
}

function get_classes_by_date(date) {
    return CLASSES[DATE_TO_INDEX[dateString(date)]];
}

var _dragged_ = [];

function enable_dragging(el, vertical, horizontal, onDragged, additionalTransform) {
    var x = {
        dragged: false,
        element: el,
        startPosition: {
            x: 0,
            y: 0
        },
        currentPosition: {
            x: 0,
            y: 0,
        },
        offset: {
            x: 0,
            y: 0,
        },
        velocity: {
            x: 0,
            y: 0,
        },
        multiplier: {
            x: 1,
            y: 1,
        },
        speed: 0,
        lastProcessed: new Date(),
        justStarted: true,
        processTimeoutDesktop: 10,
        processTimeoutMobile: 50,
        vertical: vertical,
        horizontal: horizontal,
        additionalTransform: additionalTransform,
        onDragged: onDragged,
    };
    _dragged_.push(x);
    return x;
}

function process_dragging(x, y, mob) {
    const now = new Date();
    for (let i = 0; i < _dragged_.length; i++) {
        const d = _dragged_[i];
        const timeout = mob ? d.processTimeoutMobile : d.processTimeoutDesktop;
        if (d.dragged && now - d.lastProcessed >= timeout) {
            var oldX = d.currentPosition.x;
            var oldY = d.currentPosition.y;
            if (d.justStarted) {
                d.startPosition = {
                    x: x,
                    y: y,
                };
                oldX = x;
                oldY = y;
            }
            d.currentPosition = {
                x: x,
                y: y,
            };
            if (!d.vertical) d.currentPosition.y = d.startPosition.y;
            if (!d.horizontal) d.currentPosition.x = d.startPosition.x;
            d.velocity = {
                x: x - oldX,
                y: y - oldY,
            };
            d.velocity = {
                x: x - oldX,
                y: y - oldY,
            };
            d.justStarted = false;
            d.lastProcessed = new Date();
            const result = d.onDragged.call(d);
            if (result === false) continue;
            var add = d.additionalTransform();
            if (add == null || add == undefined || add == false || isNaN(add)) add = '';
            else add = ' ' + add;
            var trX = d.offset.x * d.multiplier.x;
            if (trX == null || trX == undefined || trX == false || isNaN(trX)) trX = 0;
            var trY = d.offset.y * d.multiplier.y;
            if (trY == null || trY == undefined || trY == false || isNaN(trY)) trY = 0;
            d.element.transform = 'translate(' + Math.round(trX) + 'px, ' + Math.round(trY) + 'px)' + add;
        }
    }
}

window.addEventListener('mousemove', function (e) {
    process_dragging(e.clientX, e.clientY, false);
});
window.addEventListener('touchmove', function (e) {
    if (e.touches.length != 1) return;
    process_dragging(e.touches[0].clientX, e.touches[0].clientY, true);
});


function create_calendar() {
    const today = new Date();
    const current = DATES[CURRENT_DAY];
    today.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);
    if (CALENDAR != null) CALENDAR.remove();
    const firstDay = new Date(DATES[0].getTime() - DATES[0].getDay() * DAY);
    const lastDay = new Date(DATES[DATES.length - 1].getTime() + (6 - DATES[0].getDay()) * DAY);
    if (LANG.locale == 'ru-RU') {
        firstDay.setTime(firstDay.getTime() + DAY);
        lastDay.setTime(lastDay.getTime() + DAY);
    }
    const calendar = document.createElement('div');
    calendar.classList.add('calendar');
    calendar.classList.add('bg');
    const header = document.createElement('div');
    header.classList.add('calendar-header');
    const weekdays = document.createElement('div');
    weekdays.classList.add('calendar-weekdays');
    const scroller = document.createElement('div');
    scroller.classList.add('calendar-scroller');
    calendar.appendChild(header);
    calendar.appendChild(weekdays);
    calendar.appendChild(scroller);
    for (let i = 0; i < LANG.weekdays_calendar.length; i++) {
        const str = LANG.weekdays_calendar[i];
        const el = document.createElement('div');
        el.classList.add('calendar-day');
        el.classList.add('calendar-weekday');
        if (i == LANG.locale == 'ru-RU' ? 6 : 0) {
            el.classList.add('calendar-weekend');
        }
        el.textContent = str;
        weekdays.appendChild(el);
    }
    var oldMonth = null;
    var oldMonthEnd = 0;
    var oldDate = null;
    for (let t = firstDay.getTime(); t <= lastDay.getTime(); t += DAY) {
        const date = new Date(t);
        if (date.getMonth() != oldMonth) {
            if (oldDate != null) {
                for (let i = 0; i < 6 - oldDate.getDay(); i++) {
                    const day = document.createElement('div');
                    day.classList.add('calendar-day');
                    day.classList.add('disabled');
                    scroller.appendChild(day);
                }
            }
            oldMonth = date.getMonth();
            oldMonthEnd = date.getDay();
            const month = document.createElement('div');
            month.classList.add('calendar-month');
            month.textContent = capitalizeFirstLetter(date.toLocaleDateString(LANG.locale, {
                month: 'long',
            }));
            scroller.appendChild(month);
            if (oldDate != null) {
                for (let i = 0; i < oldMonthEnd - (LANG.locale == 'ru-RU' ? 1 : 0); i++) {
                    const day = document.createElement('div');
                    day.classList.add('calendar-day');
                    day.classList.add('disabled');
                    scroller.appendChild(day);
                }
            }
        }
        const day = document.createElement('div');
        day.classList.add('calendar-day');
        if (date.getDay() == 0) {
            day.classList.add('calendar-weekend');
        }
        if (t < DATES[0].getTime() || t > DATES[DATES.length - 1].getTime()) {
            day.classList.add('disabled');
        } else {
            day.addEventListener('click', function () {
                day_by_date(date);
                toggle_overlay('CALENDAR');
            });
        }
        day.setAttribute('data-date', dateString(date));
        day.textContent = date.getDate();
        scroller.appendChild(day);
        oldDate = date;
    }
    CALENDAR = calendar;
}

function reonline() {
    var platform = 'Other';
    if (IS_APP_INSTALLED && IS_IOS) platform = 'iOS';
    if (IS_APP_INSTALLED && IS_ANDROID) platform = 'Android';
    $.get('?online&app=' + (IS_APP_INSTALLED ? 1 : 0) + '&platform=' + platform);
    console.log('Online Status Updated');
}