import * as THREE from '../../libs/three/three.module.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { CanvasUI } from '../../libs/CanvasUI.js'
import { VRButton } from '../../libs/VRButton.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
                
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 0 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );
        this.scene.add( this.camera );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    initScene(){
        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
					new THREE.LineBasicMaterial( { color: 0x808080 } )
				);
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );
        
        this.createUI();
    }
    
    createUI() {
        this.ui = new CanvasUI(  );
        this.ui.updateElement("body", "Hello World" );
        this.ui.update();
        this.ui.mesh.position.set( 0, 1.5, -1.2 );
        this.scene.add( this.ui.mesh );
    }
    
    setupXR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        
        const btn = new VRButton( this.renderer );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };