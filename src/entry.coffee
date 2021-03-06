$ ->
  $('#code').val(Examples[location.hash] ? Examples["#hello"])

  $('.example').on 'click', ->
    $('#code').val Examples[$(this).attr('href')]

  $('#launch').on 'click', ->
    util.font.name = $('#font').val()
    util.font.weight = "bold" if util.font.name == "helvetiker"
    new Main $('#code').val(), $('#inputchar').val(), $('#inputnumber').val(), $('#step').val()
    $('#entry').remove()
    $('#back').show()
    false

Examples =
  "#hello": """
    v @_       v
    >0"!dlroW"v
    v  :#     <
    >" ,olleH" v
       ^       <
  """

  "#fizzbuzz": """
    >1+"."05pv
    ,        >:3%!v
    +    v,,"Fizz"_v
    5    >,,"$"05p v
    5         v!%5:<
    .v,,"Buzz"_v
    :>,,"$"05p v
    ^_@#-+"22":<
  """

  "#lifegame": """
    v>>31g> ::51gg:2v++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    9p BXY|-+<v3*89<%+ *                                                      *   +
    21 >98 *7^>+\\-0|<+ *                                                     *    +
    *5 ^:+ 1pg15\\,:< + *                                                     ***  +
    10^  <>$25*,51g1v+                                                            +
    -^ p<| -*46p15:+<+                                                            +
    > 31^> 151p>92*4v+                                                            +
     ^_ ".",   ^ vp1<+                                                            +
    >v >41p      >0 v+                                                            +
    :5! vg-1g15-1g14<+                                                            +
    +1-+>+41g1-51gg+v+                                                            +
    1p-1vg+1g15-1g14<+                                                            +
    g61g>+41g51g1-g+v+                                                            +
    14*1v4+g+1g15g14<+                           * *                              +
    5>^4>1g1+51g1-g+v+                           * *                              +
    ^ _^v4+gg15+1g14<+                           ***                              +
    >v! >1g1+51g1+g+v+                                                            +
    g8-v14/*25-*4*88<+                                                            +
    19+>g51gg" "- v  +                                                            +
    4*5  v<   v-2:_3v+                                                            +
     >^   |!-3_$  v<-+                                                            +
    ^    < <      <|<+                                                         ***+
    >g51gp ^ >51gp^>v+                                                            +
    ^14"+"<  ^g14"!"<++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  """

  "#bottles": """
    5:*4*1-           >:1    v
               v.:<
               #  |:\\<       <
    >v"No more "0 <          0
    ,:                       :
    ^_$        v             |!-1       <
    >v"bottle"0<      | :,*25<
    ,:           >"s"v@
    ^_$1-        |   ,
    >v" of beer"0<   <
    ,:               >v
    ^_$            :!|
    >v" on the wall"0<
    ,:                     >"."v
    ^_$               >:2-!|
                           >",">,25*,:  |
    >v"Take one down, pass it around,"0$<
    ,:
    ^_$25*,1-      :2v
  """

  "#aturley": """
    >84*>:#v_55+"ude.ub@yelruta">:#,_@>188*+>\\02p\\12p\\:22p#v_$    55+,1-         v
        ^  0 v +1\\                   _^#-+*<               >22g02g*"_@"*-!1- #v_v>
           >:>::3g: ,\\188                  ^^               -1\\g21\\g22<p3\\"_":<
    ________________________________@_________________________________^  p3\\"@":<
  """

