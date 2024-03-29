import * as THREE from './lib/three.js/build/three.module.js';
import CSG from './lib/three-csgmesh/three-csg.js';

// FIXME-2016: do we need some better polymorphism here?
//Part.prototype = new THREE.Mesh();
//Part.prototype.constructor = Part;

function freeform(geometry, color, selectable, selectionColor, highlightColor) {
    var material = new THREE.MeshLambertMaterial({ color : color });
    var part = new THREE.Mesh(geometry, material);

    part.selectable = selectable;
    if (selectable) {
        part.selected = false;
        part.originalMaterial = material;
        part.selectionMaterial = new THREE.MeshLambertMaterial({ color : selectionColor });

        if (!highlightColor)
            highlightColor = Utils.averageColor(color, selectionColor);
        part.highlightMaterial = new THREE.MeshLambertMaterial({ color : highlightColor });

        part.select = function() {
            this.material = this.selectionMaterial;
            this.selected = true;

            // console.log(this.getWorldPosition(this.petrovich.position));
            if (part.onSelected)
                part.onSelected();
        };
        part.deselect = function() {
            this.material = this.originalMaterial;
            this.selected = false;
        };

        part.highlight = function() {
            this.material = this.selected ? this.selectionMaterial : this.highlightMaterial;
            this.highlighted = true;
        };
        part.fadetoblack = function() {
            this.material = this.selected ? this.selectionMaterial : this.originalMaterial;
            this.highlighted = false;
        };
    }

    part.castShadow = true;
    // part.receiveShadow = true; // TODO-2016

    return part;
}

function box(width, height, depth, color, selectable, selectionColor, highlightColor) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    return freeform(geometry, color, selectable, selectionColor, highlightColor);
}

export { freeform, box };
