import * as THREE from 'three';
import { TapisserieTexture } from './TapisserieTexture.js';

export class RoyalOakWatch {
    constructor() {
        this.group = new THREE.Group();
        
        // Materials
        this.materials = this.createMaterials();
        
        // Watch components
        this.createCase();
        this.createBezel();
        this.createScrews();
        this.createDial();
        this.createSubdials();
        this.createHands();
        this.createIndices();
        this.createCrown();
        this.createBracelet();
        
        // Time tracking for animation
        this.time = 0;
    }

    createMaterials() {
        // Rose gold material
        const roseGold = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xb76e79),
            metalness: 0.9,
            roughness: 0.15,
            clearcoat: 0.3,
            clearcoatRoughness: 0.1,
            reflectivity: 1,
            envMapIntensity: 1.5
        });

        // Polished rose gold (for certain surfaces)
        const polishedRoseGold = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xb76e79),
            metalness: 0.95,
            roughness: 0.05,
            clearcoat: 0.5,
            clearcoatRoughness: 0.05,
            reflectivity: 1,
            envMapIntensity: 2
        });

        // Blue dial material with tapisserie texture
        const tapisserieTexture = new TapisserieTexture();
        const blueDial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0x1a3a52),
            metalness: 0.3,
            roughness: 0.4,
            normalMap: tapisserieTexture.normalMap,
            normalScale: new THREE.Vector2(0.5, 0.5),
            displacementMap: tapisserieTexture.heightMap,
            displacementScale: 0.02,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1
        });

        // Subdial material (lighter rose gold)
        const subdialMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xd4a574),
            metalness: 0.7,
            roughness: 0.3,
            clearcoat: 0.2,
            clearcoatRoughness: 0.2
        });

        // Hand material
        const handMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xb76e79),
            metalness: 0.9,
            roughness: 0.1,
            emissive: new THREE.Color(0x00ff00),
            emissiveIntensity: 0.05
        });

        return {
            roseGold,
            polishedRoseGold,
            blueDial,
            subdialMaterial,
            handMaterial
        };
    }

    createCase() {
        // Main case body
        const caseGeometry = new THREE.CylinderGeometry(4, 4, 1.2, 8);
        const caseMesh = new THREE.Mesh(caseGeometry, this.materials.roseGold);
        caseMesh.rotation.y = Math.PI / 8; // Rotate to align octagon
        this.group.add(caseMesh);

        // Case middle (sides)
        const caseMiddleGeometry = new THREE.CylinderGeometry(4.1, 4.1, 0.8, 8);
        const caseMiddleMesh = new THREE.Mesh(caseMiddleGeometry, this.materials.polishedRoseGold);
        caseMiddleMesh.rotation.y = Math.PI / 8;
        this.group.add(caseMiddleMesh);
    }

    createBezel() {
        // Octagonal bezel
        const bezelShape = new THREE.Shape();
        const bezelRadius = 4.2;
        const innerRadius = 3.8;
        
        // Create octagon points
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * bezelRadius;
            const y = Math.sin(angle) * bezelRadius;
            if (i === 0) bezelShape.moveTo(x, y);
            else bezelShape.lineTo(x, y);
        }
        bezelShape.closePath();

        // Create inner hole
        const holePath = new THREE.Path();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * innerRadius;
            const y = Math.sin(angle) * innerRadius;
            if (i === 0) holePath.moveTo(x, y);
            else holePath.lineTo(x, y);
        }
        holePath.closePath();
        bezelShape.holes.push(holePath);

        const bezelGeometry = new THREE.ExtrudeGeometry(bezelShape, {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
        });

        const bezelMesh = new THREE.Mesh(bezelGeometry, this.materials.polishedRoseGold);
        bezelMesh.position.z = 0.6;
        bezelMesh.rotation.z = Math.PI / 8;
        this.group.add(bezelMesh);
    }

    createScrews() {
        const screwGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 6);
        const screwHeadGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 6);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 3.9;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Screw body
            const screwMesh = new THREE.Mesh(screwGeometry, this.materials.roseGold);
            screwMesh.position.set(x, y, 0.6);
            screwMesh.rotation.x = Math.PI / 2;
            this.group.add(screwMesh);
            
            // Screw head
            const screwHeadMesh = new THREE.Mesh(screwHeadGeometry, this.materials.polishedRoseGold);
            screwHeadMesh.position.set(x, y, 0.9);
            screwHeadMesh.rotation.x = Math.PI / 2;
            this.group.add(screwHeadMesh);
        }
    }

    createDial() {
        // Main dial with tapisserie texture
        const dialGeometry = new THREE.CircleGeometry(3.7, 64);
        dialGeometry.computeVertexNormals();
        
        const dialMesh = new THREE.Mesh(dialGeometry, this.materials.blueDial);
        dialMesh.position.z = 0.4;
        this.group.add(dialMesh);

        // AP Logo
        const logoGeometry = new THREE.PlaneGeometry(1, 0.3);
        const logoMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        logoMesh.position.set(0, 1.5, 0.41);
        this.group.add(logoMesh);

        // Text "AUDEMARS PIGUET"
        const textGeometry = new THREE.PlaneGeometry(2, 0.2);
        const textMesh = new THREE.Mesh(textGeometry, logoMaterial);
        textMesh.position.set(0, 1, 0.41);
        this.group.add(textMesh);

        // "AUTOMATIC" text
        const autoTextMesh = new THREE.Mesh(textGeometry, logoMaterial);
        autoTextMesh.scale.set(0.8, 0.8, 1);
        autoTextMesh.position.set(0, 0.7, 0.41);
        this.group.add(autoTextMesh);
    }

    createSubdials() {
        // Subdial positions
        const subdialPositions = [
            { x: 0, y: -1.8, func: 'seconds' },      // 6 o'clock - small seconds
            { x: -1.8, y: 0, func: 'minutes' },      // 9 o'clock - 30-minute counter
            { x: 1.8, y: 0, func: 'hours' }          // 3 o'clock - 12-hour counter
        ];

        subdialPositions.forEach((pos, index) => {
            // Subdial ring
            const ringGeometry = new THREE.RingGeometry(0.65, 0.8, 32);
            const ringMesh = new THREE.Mesh(ringGeometry, this.materials.subdialMaterial);
            ringMesh.position.set(pos.x, pos.y, 0.42);
            this.group.add(ringMesh);

            // Subdial face
            const subdialGeometry = new THREE.CircleGeometry(0.65, 32);
            const subdialMesh = new THREE.Mesh(subdialGeometry, this.materials.subdialMaterial);
            subdialMesh.position.set(pos.x, pos.y, 0.41);
            this.group.add(subdialMesh);

            // Subdial markers
            for (let i = 0; i < 12; i++) {
                const markerAngle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const markerRadius = 0.5;
                const markerX = pos.x + Math.cos(markerAngle) * markerRadius;
                const markerY = pos.y + Math.sin(markerAngle) * markerRadius;

                const markerGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.01);
                const markerMesh = new THREE.Mesh(markerGeometry, this.materials.roseGold);
                markerMesh.position.set(markerX, markerY, 0.43);
                markerMesh.rotation.z = markerAngle + Math.PI / 2;
                this.group.add(markerMesh);
            }

            // Subdial hand
            const handGeometry = new THREE.BoxGeometry(0.03, 0.5, 0.01);
            const handMesh = new THREE.Mesh(handGeometry, this.materials.handMaterial);
            handMesh.position.set(pos.x, pos.y, 0.44);
            handMesh.geometry.translate(0, 0.25, 0);
            
            // Store reference for animation
            handMesh.userData = { type: 'subdial', function: pos.func };
            this.group.add(handMesh);
        });

        // Date window
        const dateWindowGeometry = new THREE.PlaneGeometry(0.4, 0.3);
        const dateWindowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const dateWindowMesh = new THREE.Mesh(dateWindowGeometry, dateWindowMaterial);
        dateWindowMesh.position.set(1.3, -1.3, 0.42);
        dateWindowMesh.rotation.z = -Math.PI / 4;
        this.group.add(dateWindowMesh);
    }

    createHands() {
        // Hour hand
        const hourHandGeometry = new THREE.BoxGeometry(0.15, 2, 0.02);
        hourHandGeometry.translate(0, 1, 0);
        const hourHand = new THREE.Mesh(hourHandGeometry, this.materials.handMaterial);
        hourHand.position.z = 0.45;
        hourHand.userData = { type: 'hour' };
        this.group.add(hourHand);

        // Minute hand
        const minuteHandGeometry = new THREE.BoxGeometry(0.1, 2.8, 0.02);
        minuteHandGeometry.translate(0, 1.4, 0);
        const minuteHand = new THREE.Mesh(minuteHandGeometry, this.materials.handMaterial);
        minuteHand.position.z = 0.46;
        minuteHand.userData = { type: 'minute' };
        this.group.add(minuteHand);

        // Chronograph second hand
        const chronoHandGeometry = new THREE.BoxGeometry(0.05, 3.2, 0.02);
        chronoHandGeometry.translate(0, 1.6, 0);
        const chronoHand = new THREE.Mesh(chronoHandGeometry, this.materials.handMaterial);
        chronoHand.position.z = 0.47;
        chronoHand.userData = { type: 'chrono' };
        this.group.add(chronoHand);

        // Center cap
        const centerCapGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const centerCap = new THREE.Mesh(centerCapGeometry, this.materials.polishedRoseGold);
        centerCap.position.z = 0.48;
        centerCap.rotation.x = Math.PI / 2;
        this.group.add(centerCap);
    }

    createIndices() {
        // Hour markers
        for (let i = 0; i < 12; i++) {
            if (i % 3 === 0 && i !== 0) continue; // Skip positions with subdials
            
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const radius = 3.2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const indexGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.02);
            const indexMesh = new THREE.Mesh(indexGeometry, this.materials.roseGold);
            indexMesh.position.set(x, y, 0.42);
            indexMesh.rotation.z = angle + Math.PI / 2;
            this.group.add(indexMesh);
        }
    }

    createCrown() {
        // Crown body
        const crownGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.6, 16);
        const crownMesh = new THREE.Mesh(crownGeometry, this.materials.polishedRoseGold);
        crownMesh.position.set(4.3, 0, 0);
        crownMesh.rotation.z = Math.PI / 2;
        this.group.add(crownMesh);

        // Crown ridges
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const ridgeGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.1);
            const ridgeMesh = new THREE.Mesh(ridgeGeometry, this.materials.roseGold);
            ridgeMesh.position.set(
                4.3,
                Math.cos(angle) * 0.25,
                Math.sin(angle) * 0.25
            );
            ridgeMesh.rotation.x = angle;
            this.group.add(ridgeMesh);
        }

        // Chronograph pushers
        const pusherPositions = [
            { x: 3.8, y: 1.5 },
            { x: 3.8, y: -1.5 }
        ];

        pusherPositions.forEach(pos => {
            const pusherGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
            const pusherMesh = new THREE.Mesh(pusherGeometry, this.materials.polishedRoseGold);
            pusherMesh.position.set(pos.x, pos.y, 0);
            pusherMesh.rotation.z = Math.PI / 2;
            this.group.add(pusherMesh);
        });
    }

    createBracelet() {
        // Integrated bracelet links
        const linkGeometry = new THREE.BoxGeometry(0.8, 4, 0.3);
        const linkCount = 5;
        
        for (let side = -1; side <= 1; side += 2) {
            for (let i = 1; i <= linkCount; i++) {
                const link = new THREE.Mesh(linkGeometry, this.materials.roseGold);
                link.position.set(
                    0,
                    side * (4 + i * 0.82),
                    -0.2 - i * 0.1
                );
                
                // Taper the bracelet
                link.scale.x = 1 - i * 0.05;
                
                // Add brushed texture lines
                const lineCount = 5;
                for (let j = 0; j < lineCount; j++) {
                    const lineGeometry = new THREE.BoxGeometry(0.01, 4, 0.31);
                    const lineMesh = new THREE.Mesh(lineGeometry, this.materials.polishedRoseGold);
                    lineMesh.position.copy(link.position);
                    lineMesh.position.x += (j - lineCount / 2) * 0.15;
                    lineMesh.position.z += 0.01;
                    this.group.add(lineMesh);
                }
                
                this.group.add(link);
            }
        }
    }

    updateTime() {
        this.time += 0.01;
        
        // Animate hands
        this.group.children.forEach(child => {
            if (child.userData.type === 'hour') {
                child.rotation.z = -this.time * 0.1;
            } else if (child.userData.type === 'minute') {
                child.rotation.z = -this.time * 1.2;
            } else if (child.userData.type === 'chrono') {
                child.rotation.z = -this.time * 10;
            } else if (child.userData.type === 'subdial') {
                if (child.userData.function === 'seconds') {
                    child.rotation.z = -this.time * 10;
                } else if (child.userData.function === 'minutes') {
                    child.rotation.z = -this.time * 0.5;
                } else if (child.userData.function === 'hours') {
                    child.rotation.z = -this.time * 0.05;
                }
            }
        });
    }
}