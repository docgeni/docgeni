import { NavigationItem, Locale } from './interfaces';
import { toolkit } from '@docgeni/toolkit';
import * as Prism from 'node-prismjs';

export const DOCS_ENTRY_FILE_NAMES = ['index', 'readme'];

Prism.languages.bash.function.pattern = /(^|\s|;|\||&)(?:ng|npx|docgeni|alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/;

type ExtractLocaleItem<T> = T extends {
    locales?: {
        [key: string]: infer TPart;
    };
}
    ? TPart
    : never;

export function getItemLocaleProperty<
    T extends { locales?: { [key: string]: ExtractLocaleItem<T> } },
    TProperty extends keyof ExtractLocaleItem<T>
>(item: T, locale: string, property: TProperty): ExtractLocaleItem<T>[TProperty] {
    if (item.locales && item.locales[locale] && item.locales[locale][property]) {
        return item.locales[locale][property];
    } else {
        return (item as any)[property];
    }
}

export function buildNavsForLocale(locale: Locale, navs: NavigationItem[]): NavigationItem[] {
    return (navs || []).map(rawNav => {
        const nav: NavigationItem = {
            ...rawNav,
            title: getItemLocaleProperty(rawNav, locale.key, 'title'),
            subtitle: getItemLocaleProperty(rawNav, locale.key, 'subtitle')
        };
        if (rawNav.items) {
            nav.items = buildNavsForLocale(locale, rawNav.items);
        }
        delete nav.locales;
        return nav;
    });
}

export function buildNavsMapForLocales(locales: Locale[], navs: NavigationItem[]): Record<string, NavigationItem[]> {
    const localeNavsMap: Record<string, NavigationItem[]> = {};
    locales.forEach(locale => {
        localeNavsMap[locale.key] = buildNavsForLocale(locale, navs);
    });
    return localeNavsMap;
}

export function getDocTitle(metaTitle: string, name: string) {
    if (metaTitle) {
        return metaTitle;
    }
    const title = toolkit.strings.titleCase(name);
    return title.replace(/-/g, ' ');
}

export function isEntryDoc(name: string) {
    return DOCS_ENTRY_FILE_NAMES.includes(name);
}

export function highlight(sourceCode: string, lang: string) {
    const language = Prism.languages[lang] || Prism.languages.autoit;
    return `<div>${Prism.highlight(sourceCode, language)}</div>`;
}

export function ascendingSortByOrder<T extends { order?: number }>(items: T[]) {
    return items.sort((a, b) => {
        return a.order > b.order ? 1 : a.order === b.order ? 0 : -1;
    });
}

export function getSummaryStr(...details: [string]): string {
    return details
        .map(detail => {
            return `...${detail.substr(detail.length - 29)}`;
        })
        .join(' ');
}
