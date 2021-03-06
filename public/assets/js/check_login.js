$(document).ready(function() {
    $.ajax({
        method: 'GET',
        url: '../user/me',
        contentType: 'application/json',
        statusCode: {
            200: function(data) {
                console.log("Autorizzato")
                $('#login-navbar').hide();
                $('#signup-navbar').hide();
                var template =
                `
                <li id='myreservation-navbar' class='nav-item'>
                    <a class='nav-link' href='../pages/my_reservation.html'>My reservation</a>
                </li>
                <li id='logout-navbar' class='nav-item'>
                    <a class='nav-link' href='#' onclick='logout();'>Logout</a>
                </li>
                `
                $('#right-navbar').append(template);
            },
            401: function(){
                console.log("Non autorizzato");
                $('#bookNowButton').hide();
            }
        }
    })
})