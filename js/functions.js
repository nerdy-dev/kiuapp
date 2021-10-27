function str(x) {
    if (x == undefined || x == null) return '';
    return String(x);
}

function dte(x) {
    var d = new Date(x);
    return d;
}

function dateString(x) {
    var mm = x.getMonth() + 1;
    var dd = x.getDate();
    return [
        x.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
}

function ordinal(number) {
    let selector;

    if (number <= 0) {
        selector = 4;
    } else if ((number > 3 && number < 21) || number % 10 > 3) {
        selector = 0;
    } else {
        selector = number % 10;
    }

    return number + ['th', 'st', 'nd', 'rd', ''][selector];
};


function JSONSyntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function clamp(num, min, max) {
    return num <= min ?
        min :
        num >= max ?
        max :
        num
}

function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}

function trimAny(str, chars) {
    var start = 0,
        end = str.length;

    while (start < end && chars.indexOf(str[start]) >= 0)
        ++start;

    while (end > start && chars.indexOf(str[end - 1]) >= 0)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function get_random(list) {
    return list[Math.floor((Math.random() * list.length))];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const _englishify_ = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'kh',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
};

function englishify(str) {
    str = replaceAll(str, '№', '#');
    str = replaceAll(str, 'Комп', 'Comp');
    str = replaceAll(str, 'Класс', 'Class');
    str = replaceAll(str, 'класс', 'class');
    let result = '';
    for (var i = 0; i < str.length; i++) {
        const char = str[i];
        const trans = _englishify_[char.toLowerCase()];
        if (trans != undefined) {
            if (char == char.toLowerCase()) {
                result += trans;
            } else {
                result += capitalizeFirstLetter(trans);
            }
        } else {
            result += char;
        }
    }
    return result;
}