<?php

namespace Wellcome\IIIF;

use Wellcome\IIIF\W3c\W3cAnnotation;
use Wellcome\IIIF\W3c\W3cSvgSelector;
use Wellcome\IIIF\W3c\W3cTarget;
use Wellcome\IIIF\Resource;

class Annotation {

  private $id;
  private $type;
  private $motivation;
  private $resource;

  public function __construct(string $id, string $type, string $motivation, Resource $resource) {
    $this->id = $id;
    $this->type = $type;
    $this->motivation = $motivation;
    $this->resource = $resource;
  }

  public function toW3C() {
    return new W3cAnnotation(
      $this->id,
      [],
      new W3cTarget($this->resource->getFull()->getId(), 'sc:Canvas', $this->resource->getOn(), 0, new W3cSvgSelector((string) $this->resource->getSelector()))
    );

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
    return [



    ];


  }

}
