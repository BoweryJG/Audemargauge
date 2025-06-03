import * as THREE from 'three';

export class TapisserieTexture {
    constructor(size = 512) {
        this.size = size;
        this.pyramidSize = 16; // Size of each pyramid in pixels
        
        this.heightMap = this.createHeightMap();
        this.normalMap = this.createNormalMap();
    }

    createHeightMap() {
        const canvas = document.createElement('canvas');
        canvas.width = this.size;
        canvas.height = this.size;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.size, this.size);

        // Create pyramid pattern
        const pyramidsPerRow = Math.floor(this.size / this.pyramidSize);
        
        for (let row = 0; row < pyramidsPerRow; row++) {
            for (let col = 0; col < pyramidsPerRow; col++) {
                this.drawPyramid(
                    ctx,
                    col * this.pyramidSize,
                    row * this.pyramidSize,
                    this.pyramidSize
                );
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        
        return texture;
    }

    drawPyramid(ctx, x, y, size) {
        const halfSize = size / 2;
        const centerX = x + halfSize;
        const centerY = y + halfSize;

        // Create gradient from center (white) to edges (black)
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, halfSize * 0.7
        );
        
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#808080');
        gradient.addColorStop(1, '#000000');

        // Draw pyramid shape
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add sharp edges
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(centerX, centerY);
        ctx.moveTo(x + size, y);
        ctx.lineTo(centerX, centerY);
        ctx.moveTo(x + size, y + size);
        ctx.lineTo(centerX, centerY);
        ctx.moveTo(x, y + size);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
    }

    createNormalMap() {
        const canvas = document.createElement('canvas');
        canvas.width = this.size;
        canvas.height = this.size;
        const ctx = canvas.getContext('2d');

        // Base normal color (pointing up)
        ctx.fillStyle = '#8080ff';
        ctx.fillRect(0, 0, this.size, this.size);

        const pyramidsPerRow = Math.floor(this.size / this.pyramidSize);
        
        for (let row = 0; row < pyramidsPerRow; row++) {
            for (let col = 0; col < pyramidsPerRow; col++) {
                this.drawPyramidNormals(
                    ctx,
                    col * this.pyramidSize,
                    row * this.pyramidSize,
                    this.pyramidSize
                );
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        
        return texture;
    }

    drawPyramidNormals(ctx, x, y, size) {
        const halfSize = size / 2;
        const centerX = x + halfSize;
        const centerY = y + halfSize;

        // Top face (tilted towards viewer)
        ctx.fillStyle = '#a0a0ff';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(x + size, y);
        ctx.closePath();
        ctx.fill();

        // Right face (tilted right)
        ctx.fillStyle = '#ff8080';
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(x + size, y + size);
        ctx.closePath();
        ctx.fill();

        // Bottom face (tilted away)
        ctx.fillStyle = '#6060ff';
        ctx.beginPath();
        ctx.moveTo(x + size, y + size);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.fill();

        // Left face (tilted left)
        ctx.fillStyle = '#80ff80';
        ctx.beginPath();
        ctx.moveTo(x, y + size);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
    }
}