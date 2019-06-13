
// the following functionality was borrowed from
// https://css-tricks.com/scrollfollow-sidebar/

$(function(){

    var selections = $("#selections")
    console.log("selections", selections)

    var offset = selections.offset()
    console.log(offset)

    var topPadding = 15;

    $(window).scroll(function(){
        var y = $(this).scrollTop();
        console.log(y)

    if($(window).scrollTop()> offset.top){
        //console.log(">")
        selections.stop().animate({
            marginTop: $(window).scrollTop() - offset.top + topPadding
        })
    } else{
        selections.stop().animate({
            marginTop:0
        })
    }
    })
})


