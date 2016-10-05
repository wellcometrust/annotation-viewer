<?php

namespace Wellcome\IIIF;

class AnnotationList {

  private $annotations;

  public function __construct(Annotation ...$annotations) {
    $this->annotations = $annotations;
  }


  public function toW3c() {
    return array_map(function(Annotation $annotation) {
      return $annotation->toW3C();
    }, $this->annotations);
  }

}
