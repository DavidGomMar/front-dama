token = sessionStorage.getItem('token')
decodedToken = jwt_decode(token)
console.log(decodedToken)
if (decodedToken?.data.rol != 2) {
 window.location = 'index_admin.html'
}