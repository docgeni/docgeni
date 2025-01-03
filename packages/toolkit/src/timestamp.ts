const dateRegex = /(?=(YYYY|YY|MM|DD|HH|mm|ss|ms))\1([:\/]*)/g;
const timespan = {
    YYYY: ['getFullYear', 4],
    YY: ['getFullYear', 2],
    MM: ['getMonth', 2, 1], // getMonth is zero-based, thus the extra increment field
    DD: ['getDate', 2],
    HH: ['getHours', 2],
    mm: ['getMinutes', 2],
    ss: ['getSeconds', 2],
    ms: ['getMilliseconds', 3],
};
function timestamp(date?: Date): string;
function timestamp(str: string, date?: Date, utc?: boolean): string;
function timestamp(str: string | Date, date?: Date, utc?: boolean): string {
    if (typeof str !== 'string') {
        date = str;
        str = 'YYYY-MM-DD';
    }

    if (!date) {
        date = new Date();
    }
    return str.replace(dateRegex, (match, key, rest) => {
        const args = timespan[key];
        let name = args[0];
        const chars = args[1];
        if (utc === true) {
            name = 'getUTC' + name.slice(3);
        }
        const val = '00' + String(date[name]() + (args[2] || 0));
        return val.slice(-chars) + (rest || '');
    });
}

timestamp.utc = (str: string, date: Date) => {
    return timestamp(str, date, true);
};

export { timestamp };
