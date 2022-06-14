/* affix the navbar after scroll below header */
$('#nav').affix({
      offset: {
        top: $('header').height()
      }
});

/* highlight the top nav as scrolling occurs */
$('body').scrollspy({ target: '#nav' })

/* smooth scrolling for scroll to top */
$('.scroll-top').click(function(){
  $('body,html').animate({scrollTop:0},1000);
})


/* smooth scrolling for nav sections */
$('#nav .navbar-nav li>a').click(function(){
  var link = $(this).attr('href');
  var posi = $(link).offset().top+20;
  $('body,html').animate({scrollTop:posi},700);
})

/*$(window).scroll(function(){ need a fix for this
    var fromTop = $(window).scrollTop();
    var hei = $(".nv").height() + $(".jumbotron").outerHeight();
    if (fromTop > hei)
      $(".content").css("margin-top", "70px");
    else 
      $(".content").css("margin-top", "0px");
});*/

// Instantiate the Bootstrap carousel
$('.multi-item-carousel').carousel({
  interval: 3600
});

(function(){
  $('.multi-item-carousel .item').each(function(){
    var itemToClone = $(this);

    for (var i=1;i<3;i++) {
      itemToClone = itemToClone.next();

      // wrap around if at end of item collection
      if (!itemToClone.length) {
        itemToClone = $(this).siblings(':first');
      }

      // grab item, clone, add marker class, add to collection
      itemToClone.children(':first-child').clone()
        .addClass("cloneditem-"+(i))
        .appendTo($(this));
    }
  });
}());

function shorten(){
	var showChar = 300;
	var ellipsestext = "...";
	var moretext = "more";
	var lesstext = "less";
	$('.more').each(function() {
		var content = $(this).html();

		if(content.length > showChar) {

			var c = content.substr(0, showChar);
			var h = content.substr(showChar-1, content.length - showChar);

			var html = c + '<span class="moreelipses">'+ellipsestext+'</span>&nbsp;<span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">'+moretext+'</a></span>';

			$(this).html(html);
		}

	});

	$(".morelink").click(function(){
		if($(this).hasClass("less")) {
			$(this).removeClass("less");
			$(this).html(moretext);
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
		$(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});
}

function addRow(entry, count)
{  
  var table = document.getElementById("catalogue");
  var row = table.insertRow(count);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
                  
  cell1.innerHTML = count;
  cell2.innerHTML = "<img src=" + entry.fields.image + "></img>";
  cell3.innerHTML = entry.fields.Title;
  cell4.innerHTML = entry.fields.Author;
  cell5.innerHTML = "<div class=\"more\">"+entry.fields.description+"</div>"; 
  cell6.innerHTML = "<div class=\"star-ratings-sprite\"><span style=\"width:" + parseFloat(entry.fields.rating)*20 + "%\" class=\"star-ratings-sprite-rating\"></span></div>";
  cell7.innerHTML = entry.fields.Genre;
}

function cat_search(concept, que){
  $("#quote").css({"position":"fixed","bottom":"0","width":"100%","margin":"0"});
  if(concept === null || que === null);
  else{
  document.getElementById("wait").innerHTML = "Results may take a few seconds to load.";
  document.getElementById("catalogue").innerHTML = "<tr><thead><th>#</th><th>Cover</th><th>Title</th><th>Author</th><th>Description</th><th>Rating</th><th>Genre</th></thead></tr>";
  var query = new RegExp(que, "i");
  $.ajax({
          dataType: "json",
          url: "./data.json",
          mimeType: "application/json",
          success: function(result){
            var len = result.length;
            var table = document.getElementById("catalogue");
            var count = 1;
            if (concept == "Title" || concept == "Filter by"){
              for (var index = 0; index < len; index++) {
                if ((result[index].fields.Title).search(query) !== -1)
                  {addRow(result[index], count); count++}
              }
            }
            if (concept == "Author" || concept == "Filter by"){
              for (var index = 0; index < len; index++) {
                if ((result[index].fields.Author).search(query) !== -1)
                  {addRow(result[index], count); count++}
              }
            }
            if (concept == "Genre" || concept == "Filter by"){
              for (var index = 0; index < len; index++) {
                if ((result[index].fields.Genre).search(query) !== -1)
                  {addRow(result[index], count); count++}
              }
            }
            shorten();
            if (count > 1)
                $("#quote").css({"position":"","bottom":"","width":"","margin":""});
            document.getElementById("wait").innerHTML = (count - 1) + " results found.";
        }
      }); 
    }
}

//Search bar
$(document).ready(function(e){
    var concept = $('span#search_concept').text();
    if ((window.location.pathname).indexOf("catalogue") != -1)
    {
      var con = sessionStorage.getItem("concept");
      var que = sessionStorage.getItem("query");
      $('#query').innerHTML = que;
      cat_search(con, que);
    }
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
		  e.preventDefault();
	    var param = $(this).attr("href").replace("#","");
	    concept = $(this).text();
	    $('.search-panel span#search_concept').text(concept);
	    $('.input-group #search_param').val(param);
	  });
    $('#search-btn').click(function(){
        sessionStorage.setItem("query", $('#query').val());
        sessionStorage.setItem("concept", concept);
        if ((window.location.pathname).indexOf("catalogue") == -1)
          window.location.assign("./catalogue.html");
        else
          cat_search(concept, $('#query').val());
    });
  });
    
  
