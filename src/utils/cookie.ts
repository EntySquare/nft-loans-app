export function getCookieValue(name: string): string {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return "";
}

export function setCookieValue(name: string, value: string, expirationDays: number = 30): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
}

export function checkCookieAuthorization(): boolean {
    const cookieAuthorized = localStorage.getItem('cookieAuthorized');
    if (cookieAuthorized === 'true') {
        return true;
    }
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'cookieAuthorization' && value === 'true') {
            localStorage.setItem('cookieAuthorized', 'true');
            return true;
        }
    }
    return false;
}
export function askForCookieAuthorization() {
    const confirmation = confirm('我们需要授权您的浏览器cookie以继续使用本应用程序。您是否同意授权？');
    if (confirmation) {
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天后过期
        document.cookie = 'cookieAuthorization=true;expires=' + date.toUTCString() + ';path=/';
        localStorage.setItem('cookieAuthorized', 'true');
        location.reload();

    }
}
