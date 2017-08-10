//GIPHY API
var searchInput = $('#search-input')
var searchButton = $('#search-button')

searchButton.on('click', function() {
  console.log('giphy click')

  var requestSettings = {
    method: 'get',
    url: '/search' +searchInput.val()
  }

  function cb(d) {
    $('#results').empty()
    for (i = 0; i < d.data.length; i ++) {
      var imgUrl = d.data[i].images.downsized.url
      var imgTag = $('<img>')
      imgTag.attr('src', imgUrl)
      $('#results').append(imgTag)
  }
})
