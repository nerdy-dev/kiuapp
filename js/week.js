function view_week() {
    CURRENT_VIEW = 'WEEK';
    $('.view-toggle').show();
    $('#view_week').hide();
    CONTAINER.html(``);
}