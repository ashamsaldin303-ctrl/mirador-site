#!/usr/bin/env bash
declare -A Q=(
 [hero]="aerial view of a city skyline at night with warm amber lights"
 [act1]="city rooftops at dusk as lights switch on"
 [act2]="chef cooking with open flame in a dark restaurant kitchen"
 [act3]="elegant dining table set for dinner by a window overlooking city lights at night"
 [story]="view of a night city skyline through a restaurant window with warm interior light"
 [404]="minimal dark stairwell with warm light glowing from above"
 [ogen]="city skyline at night seen from above with warm golden lights"
 [ogar]="candlelit fine dining table in a dark elegant restaurant"
 [sky1]="dusk falling over city rooftops with warm window lights"
 [sky2]="long exposure night city light trails seen from above"
 [fire3]="chefs working the pass in a dark professional kitchen"
 [fire4]="glowing charcoal embers close up in the dark"
 [plates5]="mise en place single elegant place setting on dark linen tablecloth"
 [plates6]="first course fine dining plate with dark moody plating"
 [room7]="tall window glowing with amber light at dusk in an elegant room"
 [room8]="dark staircase leading upward toward warm light"
 [sourdough]="sourdough bread slices with cultured butter dark moody food photography"
 [ribeye]="sliced ribeye steak on a dark plate moody restaurant plating"
 [tart]="dark chocolate tart with sea salt moody food photography"
)
for k in "${!Q[@]}"; do
  ( timeout 170 z-ai image-search -q "${Q[$k]}" --count 4 --gl us --no-rank -o "$k.json" > "$k.log" 2>&1 ) &
done
wait
echo "--- searches done ---"; ls -la *.json 2>/dev/null | wc -l
