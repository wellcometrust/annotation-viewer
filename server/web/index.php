<?php

namespace Web;

use Wellcome\IIIF\Annotation;
use Wellcome\IIIF\AnnotationList;
use Wellcome\IIIF\Resource;
use Wellcome\IIIF\Selector\SvgSelector;
use Wellcome\IIIF\TargetResource;
use Wellcome\IIIF\Type\Image;
use Silex\Application;

// web/index.php
require_once __DIR__ . '/../vendor/autoload.php';

$app = new Application();
// Debug.
$app['debug'] = TRUE;

function mapSelector($svg) : SvgSelector {
  return new SvgSelector($svg['chars']);
}

function mapImage($image) : Image {
  return new Image($image['@id'], $image['@type']);
}

function mapTargetResource($on) : TargetResource {
  return new TargetResource($on);
}

function mapResource($resource) : Resource {
  return new Resource($resource['@type'], mapImage($resource['full']), mapSelector($resource['selector']), mapTargetResource($resource['on']));
}

function mapAnnotation($annotation) : Annotation {
  return new Annotation($annotation['@id'], $annotation['@type'], $annotation['motivation'], mapResource($annotation['resource']));
}

function mapAnnotationList($data) {
  return new AnnotationList(...array_map(function($annotation) : Annotation {
    return mapAnnotation($annotation);
  }, $data['resources']));
}

$app->get('/', function () {
  $json = file_get_contents(__DIR__ . '/annotations.json');
  $data = json_decode($json, true);
  $resources = mapAnnotationList($data);

  $w3cResources = $resources->toW3c();

  $w3c = [
    "@context" => "http://www.w3.org/ns/anno.jsonld",
    "id" => "https://dlcs.io/iiif-img/4/21/quilt/list/1",
    "type" => "AnnotationCollection",
    "items" => $w3cResources
  ];

  return pg_unescape_bytea(json_encode($w3c, JSON_PRETTY_PRINT));

});

$app->run();
