#!/bin/bash
find . -name '*.html' ! -path '*/fragments/*' | xargs -n 1 php -r '
foreach (["menu","footer"] as $section) {
file_put_contents($argv[1], preg_replace("/<!-- $section begins -->.*<!-- $section ends -->\s/ms", file_get_contents("fragments/$section.html"), file_get_contents($argv[1])));;
}'

