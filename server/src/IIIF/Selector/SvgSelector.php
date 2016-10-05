<?php

namespace Wellcome\IIIF\Selector;

use SimpleXMLElement;

class SvgSelector implements Selector {

  const X = 0;
  const Y = 1;
  private $chars;
  private $points;
  private $centroid;
  private $svg;
  private $boundingBox;
  private $rotated;
  private $rotated_bounds;
  private $bounds;
  private $rotated_top_left;
  private $_source;

  public function __toString() {
    return $this->_source;
  }

  public function __construct(string $chars) {
    $this->_source = $chars;
    $this->svg = new SimpleXMLElement($chars);
    $this->svg->registerXPathNamespace('svg', 'http://www.w3.org/2000/svg');
    $this->points = $this->parsePoints($this->svg->polygon);
    // Create immutable copy of the points, and close the polygon.
    $points            = array_values(array_merge([], $this->points, [$this->points[0]]));
    $this->centroid    = $this->centroid($points);
    $this->chars       = $chars;
    $this->boundingBox = $this->boundingBox($this->points);
    $this->bounds            = $this->getBounds($this->boundingBox);

    $this->rotated        = $this->rotatePolygon($points, 180, 13038 / 2, 12916 / 2);
    $this->rotated_bounds = $this->getBounds($this->boundingBox($this->rotated));

    $this->rotated_top_left = $this->rotated_bounds[0];

  }

  public function getBounds($boundingBox) {
    $bottom_right = $boundingBox[1];
    $top_left     = $boundingBox[3];
    $width        = $bottom_right[0] - $top_left[0];
    $height       = $bottom_right[1] - $top_left[1];

    $middle_x = $top_left[0] + ($width / 2);
    $middle_y = $top_left[1] + ($height / 2);

    $centroid = $this->centroid;

    // bottom left point.
    $points = [
      $centroid[self::Y] - $width / 2,
      $centroid[self::X] - $height / 2,
    ];

    $padding = 1;

    $po = [
      abs($points[0] - $top_left[0]) * $padding,
      abs($points[1] - $top_left[1]) * $padding,
    ];


    $padded = implode(',', [
      $points[0],
      $points[1],
      $width + $po[0],
      $height + $po[1],
    ]);
    $bound  = implode(',', [$top_left[0], $top_left[1], $width, $height]);
    return $bound;

    return $padded;
  }

  private function boundingBoxWithCenter() {
    // @todo
  }

  private function boundingBox($points) {
    $all_x = array_column($points, self::X);
    $all_y = array_column($points, self::Y);
    $min_x = min($all_x);
    $min_y = min($all_y);
    $max_x = max($all_x);
    $max_y = max($all_y);
    return [
      [$min_x, $max_y], // Top left
      [$max_x, $max_y], // Top right
      [$max_x, $min_y], // Bottom right
      [$min_x, $min_y] // Bottom left
    ];
  }

  private function parsePoints($polygon) {
    return array_map(function ($xy) {
      return explode(',', $xy);
    }, explode(' ', (string) $polygon['points']));
  }

  ###################################################################
  #####               ROTATE POLYGON FUNCTION                   #####
  #####                                                         #####
  #####               PLEASE DO REMOVE THIS NOTICE              #####
  #####               by Steve Burgess - 2015                   #####
  ###################################################################
  # $polygon - points of the polygon in a 1 dimensional array
  #            e.g. (x1,y1,x2,y2,x3,y3.... etc)
  # $angle   - rotation angle in degrees
  # $centre_x - x coordinate of centre of rotation
  # $centre_y - y coordinate of centre of rotation
  # $scale   - scale for resizing the polygon
  #
  # The function returns a new array of scaled/rotated values that can
  ###################################################################
  public function rotatePolygon($polygon, $angle = 0, $centre_x, $centre_y, $scale = 1) {
    $rotated = [];

    # PHP Trigonometric Functions (e.g. cosine, sine) require the angle to
    # be in radians rather than degrees - hence the deg2rad() conversion.
    $angle = deg2rad(-$angle);
    $count = count($polygon);

    for ($i = 0; $i < $count; $i++) {
      # Using the array map function to perform these transformations was beyond me.
      # If anyone has any bright ideas about this, please drop me a line

      # Original coordinates of each point
      $x = $polygon[$i][0];
      $y = $polygon[$i][1];

      # As image polygon requires a 1 dimensional array, the new x and the new y
      # coordinates are simply added to the rotated array one after the other
      $rotated[$i][self::X] = ($centre_x + (($x - $centre_x) * cos($angle)) - (($y - $centre_y) * sin($angle)));
      $rotated[$i][self::Y] = ($centre_y + (($x - $centre_x) * sin($angle)) + (($y - $centre_y) * cos($angle)));
    }

    return $rotated;
  }

  public function scale($value, $scale) {
    # This function is essential for the polygon rotate function.
    # Make sure you copy/paste this into your code as well as the main function.
    return ($value * $scale);
  }

  public function centroid($points) {
    $sumY = 0;
    $sumX = 0;
    $sum  = 0;

    $n = sizeof($points);

    for ($i = 0; $i < $n - 1; $i++) {
      // ( XnYn+1 - Xn+1Yn )
      $bourke = $points[$i][self::X] * $points[$i + 1][self::Y] - $points[$i + 1][self::X] * $points[$i][self::Y];
      $sum += $bourke;
      // ( Xn + Xn+1 )( XnYn+1 - Xn+1Yn )
      $sumX += ($points[$i][self::X] + $points[$i + 1][self::X]) * $bourke;
      // ( Yn + Yn+1 )( YnXn+1 - Yn+1Xn )
      $sumY += ($points[$i][self::Y] + $points[$i + 1][self::Y]) * $bourke;
    }

    $area = 0.5 * $sum;
    // sumY(1 / 6 * area)
    // sumX(1 / 6 * area)
    return [(int) round($sumY / 6 / $area), (int) round($sumX / 6 / $area)];
  }

}
