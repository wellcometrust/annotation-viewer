<?php

namespace Wellcome\IIIF\W3c;


class W3cSvgSelector implements W3cSelector {

  public $type = 'SvgSelector';
  public $value = '';

  public function __construct(string $value) {
    $this->value = $value;
  }

}
