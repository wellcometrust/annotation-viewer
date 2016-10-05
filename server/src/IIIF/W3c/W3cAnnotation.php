<?php

namespace Wellcome\IIIF\W3c;

/*
{
  "id": "https://dlcs.io/iiif-img/4/21/quilt/annotation/svg1",
  "type": "Annotation",
  "body": [ ],
  "target": {
    "source": "https://dlcs.io/iiif-img/4/21/quilt/sequence/1/canvas/1",
    "type": "sc:Canvas",
    "within": "https://dlcs.io/iiif-img/4/21/quilt",
    "sc:naturalAngle": 47,
    "selector": {
      "type": "SvgSelector",
      "value": "<svg xmlns='http://www.w3.org/2000/svg'><polygon points='2832,3695 4050,3935 2880,5405' /></svg>"
    }
  }
}
*/
class W3cAnnotation {

  public $id;
  public $type = 'Annotation';
  public $body = [];
  public $target;

  public function __construct(string $id, array $body, W3cTarget $target) {
    $this->id = $id;
    $this->body = $body;
    $this->target = $target;
  }

}
