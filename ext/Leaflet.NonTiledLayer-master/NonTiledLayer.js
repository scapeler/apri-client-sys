﻿/*
 * L.NonTiledLayer is an addon for leaflet which renders dynamic image overlays
 */
//L.NonTiledLayer = L.Layer.extend({
L.NonTiledLayer = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
        attribution: '',
        opacity: 1.0,
        zIndex: undefined,
        minZoom: -99,
        pointerEvents: null
    },
    url: '',

    // override this method in the inherited class
    //getImageUrl: function (world1, world2, width, height) {},
    //getImageUrlAsync: function (world1, world2, width, height, f) {},

    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;

        if (!this._div) {
            this._div = L.DomUtil.create('div', 'leaflet-image-layer');
            if (this.options.pointerEvents) {
                this._div.style['pointer-events'] = this.options.pointerEvents;
            }
        }

        this.getPane().appendChild(this._div);

        this._bufferImage = this._initImage();
        this._currentImage = this._initImage();

        this._update();
    },

    onRemove: function (map) {
        this.getPane().removeChild(this._div);

        this._div.removeChild(this._bufferImage);
        this._div.removeChild(this._currentImage);
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    getEvents: function () {
        var events = {
            moveend: this._update,
            zoom: this._viewreset
        };

        if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },

    getElement: function () {
        return this._div;
    },

    setOpacity: function (opacity) {
        this.options.opacity = opacity;

        if (this._currentImage)
            this._updateOpacity(this._currentImage);
        if (this._bufferImage)
            this._updateOpacity(this._bufferImage);

        return this;
    },

    // TODO remove bringToFront/bringToBack duplication from TileLayer/Path
    bringToFront: function () {
        if (this._div) {
            this._pane.appendChild(this._div);
        }
        return this;
    },

    bringToBack: function () {
        if (this._div) {
            this._pane.insertBefore(this._div, this._pane.firstChild);
        }
        return this;
    },


    getAttribution: function () {
        return this.options.attribution;
    },


    _initImage: function (_image) {
        var _image = L.DomUtil.create('img', 'leaflet-image-layer');

        if (this.options.zIndex !== undefined)
            _image.style.zIndex = this.options.zIndex;
        this._div.appendChild(_image);

        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            L.DomUtil.addClass(_image, 'leaflet-zoom-animated');
        } else {
            L.DomUtil.addClass(_image, 'leaflet-zoom-hide');
        }

        this._updateOpacity(_image);

        //TODO createImage util method to remove duplication
        L.extend(_image, {
            galleryimg: 'no',
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.bind(this._onImageLoad, this)
        });

        return _image;
    },

    redraw: function () {
        if (this._map) {
            this._update();
        }
        return this;
    },

    _animateZoom: function (e) {
        if (this._currentImage._bounds)
            this._animateImage(this._currentImage, e);
        if (this._bufferImage._bounds)
            this._animateImage(this._bufferImage, e);
    },

    _animateImage: function (image, e) {
        var map = this._map,
		    scale = map.getZoomScale(e.zoom),
		    nw = image._bounds.getNorthWest(),
		    offset = map._latLngToNewLayerPoint(nw, e.zoom, e.center);

        L.DomUtil.setTransform(image, offset, scale);
    },

    _resetImage: function (image) {
        var bounds = new L.Bounds(
		        this._map.latLngToLayerPoint(image._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(image._bounds.getSouthEast())),
		    size = bounds.getSize();

        L.DomUtil.setPosition(image, bounds.min);

        image.style.width = size.x + 'px';
        image.style.height = size.y + 'px';
    },

    _getClippedBounds: function () {
        var wgsBounds = this._map.getBounds();

        // truncate bounds to valid wgs bounds
        var lon1 = wgsBounds.getNorthWest().lng;
        var lat1 = wgsBounds.getNorthWest().lat;
        var lon2 = wgsBounds.getSouthEast().lng;
        var lat2 = wgsBounds.getSouthEast().lat;
        lon1 = (lon1 + 180) % 360 - 180;
        if (lat1 > 85.05) lat1 = 85.05;
        if (lat2 < -85.05) lat2 = -85.05;
        if (lon1 < -180) lon1 = -180;
        if (lon2 > 180) lon2 = 180;
        var world1 = new L.LatLng(lat1, lon1);
        var world2 = new L.LatLng(lat2, lon2);

        return new L.LatLngBounds(world1, world2);
    },

    _viewreset: function () {
        if (this._map.getZoom() < this.options.minZoom) {
            this._div.style.visibility = 'hidden';
            return;
        }
        else {
            this._div.style.visibility = 'visible';
        }

        if (this._bufferImage._bounds)
            this._resetImage(this._bufferImage);
    },

    _update: function () {
        this._viewreset();

        var bounds = this._getClippedBounds();

        // re-project to corresponding pixel bounds
        var pix1 = this._map.latLngToContainerPoint(bounds.getNorthWest());
        var pix2 = this._map.latLngToContainerPoint(bounds.getSouthEast());

        // get pixel size
        var width = pix2.x - pix1.x;
        var height = pix2.y - pix1.y;

        // resulting image is too small
        if (width < 32 || height < 32)
            return;

        this._currentImage._bounds = bounds;

        this._resetImage(this._currentImage);

        var i = this._currentImage;
        if (this.getImageUrl)
            i.src = this.getImageUrl(bounds.getNorthWest(), bounds.getSouthEast(), width, height);
        else
            this.getImageUrlAsync(bounds.getNorthWest(), bounds.getSouthEast(), width, height, function (url, tag) {
                i.src = url;
                i.tag = tag;
            });

        this.url = i.src;

        L.DomUtil.setOpacity(this._currentImage, 0);
    },

    _onImageLoad: function (e) {
        if (e.target.src != this.url) { // obsolete image
            return;
        }

        if (this._addInteraction)
            this._addInteraction(this._currentImage.tag)

        L.DomUtil.setOpacity(this._currentImage, this.options.opacity);
        L.DomUtil.setOpacity(this._bufferImage, 0);

        var tmp = this._bufferImage;
        this._bufferImage = this._currentImage;
        this._currentImage = tmp;

        this.fire('load');
    },

    _updateOpacity: function (image) {
        L.DomUtil.setOpacity(image, this.options.opacity);
    }
});

L.nonTiledLayer = function () {
    return new L.NonTiledLayer();
};
