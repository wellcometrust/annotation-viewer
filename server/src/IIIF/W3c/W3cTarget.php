<?php

namespace Wellcome\IIIF\W3c;

use JsonSerializable;

class W3cTarget implements JsonSerializable {

  public $source;
  public $type;
  public $within;
  public $scNaturalAngle;
  public $selector;

  public function __construct(string $source, string $type, string $within, int $rotation, W3cSelector $selector) {
    $this->source = $source;
    $this->type = $type;
    $this->within = $within;
    $this->scNaturalAngle = $rotation;
    $this->selector = $selector;
  }

  function jsonSerialize() {
    return [
      'source' => $this->source,
      'type' => $this->type,
      'within' => $this->within,
      'sc:naturalAngle' => $this->scNaturalAngle,
      'selector' => $this->selector
    ];
  }
}
