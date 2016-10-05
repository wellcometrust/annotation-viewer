<?php

namespace Wellcome\IIIF\Type;

class Image implements DcType {

  private $id;
  private $type;

  public function __construct(string $id, string $type) {
    $this->id = $id;
    $this->type = $type;
  }

  public function getId() : string {
    return $this->id;
  }

}
