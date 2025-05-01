function IDin () {
    ID = document.getElementById("loginID").value;
    let link = window.location.href + 'ed?id=' + ID
    window.location.replace(link)
}
