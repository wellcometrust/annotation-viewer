<?php

namespace Wellcome\IIIF;

use Wellcome\IIIF\Selector\Selector;
use Wellcome\IIIF\Type\DcType;

class Resource {

  private $type;
  private $full;
  private $selector;
  private $on;

  public function __construct(string $type, DcType $full, Selector $selector, TargetResource $on) {
    $this->type = $type;
    $this->full = $full;
    $this->selector = $selector;
    $this->on = $on;
  }

  public function getFull() : DcType {
    return $this->full;
  }

  public function getSelector() : Selector {
    return $this->selector;
  }

  public function getOn() : string {
    return (string) $this->on;
  }

}
