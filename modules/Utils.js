export function highlight(text, keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}

export function getTagClass(tag) {
    switch (tag.toLowerCase()) {
        case 'free':
            return 'border-teal-500 text-teal-500';
        case 'free/paid':
            return 'border-orange-500 text-orange-500';
        case 'repository':
            return 'border-blue-400 text-blue-400';
        case 'article':
            return 'border-indigo-400 text-indigo-400';
        case 'video':
            return 'border-red-500 text-red-500';
        case 'site':
            return 'border-gray-200 text-gray-200';
        default:
            return 'border-gray-500 text-gray-500';
    }
}

export function fetchWithRetry(url, retries = 3) {
    return fetch(url).catch(err => {
        if (retries > 0) return fetchWithRetry(url, retries - 1);
        throw err;
    });
}