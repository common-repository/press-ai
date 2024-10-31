export function goToPage(pageName) {
    const baseUrl = window.location.pathname.split('/wp-admin/')[0];
    window.location.href = `${baseUrl}/wp-admin/admin.php?page=pressai#/${pageName}`;
}
