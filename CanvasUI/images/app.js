import * as THREE from '../../libs/three/three.module.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { CanvasUI } from '../../libs/CanvasUI.js'
import { VRButton } from '../../libs/VRButton.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
                
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
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
        const config = {
            image: { type: "img", position: { left: 20, top: 20 }, width: 472 },
            info: { type: "text", position: { top: 300 } }
        }
        const content = {
            image: "../../assets/promo.png",
            info: "The promo image from the course: Learn to create WebXR, VR and AR, experiences using Three.JS"
        }
        this.ui = new CanvasUI( content, config );
    }
    
    setupXR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        
        function onSessionStart(){
            self.ui.mesh.position.set( 0, 1.5, -1.2 );
            self.camera.attach( self.ui.mesh );
        }
        
        function onSessionEnd(){
            self.camera.remove( self.ui.mesh );
        }
        
        const btn = new VRButton( this.renderer, { onSessionStart, onSessionEnd } );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        if ( this.renderer.xr.isPresenting ) this.ui.update();
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };