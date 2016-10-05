# Wellcome Quilt Prototype
This is going to cover the initial prototype stage for Wellcome Quilt project.

## High level overview
![osd with annotations](https://cloud.githubusercontent.com/assets/8266711/17297674/994b2c38-57fe-11e6-9982-5c0489a95fe2.png)

## Store
The store is a small redux implementation. This was chosen for its upfront contracts to the UI layer that can be designed prior to either implementation of an API or the UI itself. This serves as a source of truth for both parties and intermediate data structure that fits the business requirements.

The store uses a variation on the command-control pattern to ensure scalability of data/actions and also reduce complexity as pieces are rebuilt in the short and long term.

## View
Designed to be changed, implemented in React for this demo. It requires a constructor that accepts a annotation view model and Redux store, and a mountTo() implementation for rendering. The rest is completely open.

## Viewer
This CAN be changed, but it is not advised. To change it you must replace the viewer actions to talk to the other viewer.

## Annotation Handler (name TBC)
The exact implementation is to be confirmed, but this will compute the annotations from the server and digest the information into a data store for the UI to consume. It will also potentially render a d3 layer that contains polygons etc for viewing. This Polygon data will be used regardless for calculating the x, y, positions and also the optimal zoom level to contain the whole image.

### Based on Front end starter kit
[View project on GitHub](https://github.com/digirati-co-uk/digirati-front-end-starter)
