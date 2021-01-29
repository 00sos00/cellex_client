export function showNotif(notifTitle, notifTimeout) {
    window.notifT && clearTimeout(window.notifT)
    let notifElement = document.getElementById('notif');
    notifElement.textContent = notifTitle;
    window.notifT = setTimeout(() => {
        notifElement.style.opacity = 0;
    }, notifTimeout);
    notifElement.style.transition = '';
    notifElement.style.opacity = 0;
    setTimeout(() => {
        notifElement.style.transition = 'opacity 0.1s';
        notifElement.style.opacity = 1;
    }, 100);
}