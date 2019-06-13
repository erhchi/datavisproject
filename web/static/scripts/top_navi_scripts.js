
$("div.navcol").mouseover(function(){
$(this).toggleClass("greybox")
$(this).find("a").removeClass("nav")
$(this).find("a").addClass("navover")
})

$("div.navcol").mouseout(function(){
$(this).removeClass("greybox")
$(this).find("a").removeClass("navover")
$(this).find("a").addClass("nav")
})
