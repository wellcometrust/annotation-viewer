<?php

namespace Wellcome\IIIF;


class TargetResource {

  private $target;

  public function __construct($target) {
    $this->target = $target;
  }

  public function __toString() {
    return $this->target;
  }

}
