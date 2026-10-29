import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, input, signal, viewChild } from '@angular/core';
import {
  Box3,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Visor 3D de una prenda. Se carga con @defer (ver producto.component.html), así three.js
 * solo se descarga cuando el visor entra en pantalla.
 */
@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewerComponent {
  /** Ruta del .glb, relativa al <base href> (ej. 'models/camiseta-corte-recto.glb'). */
  readonly src = input.required<string>();
  /** Color de la tela (hex). El modelo no lleva textura: se tiñe aquí. */
  readonly color = input('#fafafa');
  readonly label = input('Modelo 3D de la prenda');

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private materials: MeshStandardMaterial[] = [];
  private requestRender: () => void = () => { };
  private teardown: () => void = () => { };

  constructor() {
    afterNextRender(() => this.init());

    // Cambiar de color en la ficha tiñe el modelo sin recargarlo.
    effect(() => this.applyColor(this.color()));

    inject(DestroyRef).onDestroy(() => this.teardown());
  }

  private applyColor(hex: string): void {
    this.materials.forEach((m) => m.color.set(hex));
    this.requestRender();
  }

  private init(): void {
    const canvas = this.canvas().nativeElement;
    const host = this.host.nativeElement;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Renderer: fondo transparente (se ve el degradado del CSS), píxel ratio limitado a 2 para ahorrar GPU
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = NeutralToneMapping; // pensado para producto: respeta el color real de la tela

    // --- Luz: entorno de estudio generado por código (0 KB de red) + una luz de apoyo
    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    scene.environment = environment;

    const key = new DirectionalLight(0xffffff, 1.1);
    key.position.set(1.5, 2, 2.5);
    scene.add(key);

    // --- Cámara y controles
    const camera = new PerspectiveCamera(32, 1, 0.01, 50);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 1.2;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.addEventListener('start', () => (controls.autoRotate = false)); // al tocarlo, deja de girar solo
    canvas.style.touchAction = 'pan-y'; // en móvil, el gesto vertical sigue haciendo scroll de la página

    // --- Bucle: solo dibuja si algo cambió y solo mientras el visor se ve
    let frame = 0;
    let visible = true;
    let dirty = true;

    const render = () => {
      frame = 0;
      if (!visible) return;
      const moved = controls.update();
      if (moved || dirty) {
        dirty = false;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);
    };

    this.requestRender = () => {
      dirty = true;
      if (visible && !frame) frame = requestAnimationFrame(render);
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) this.requestRender();
    });
    intersection.observe(host);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      this.requestRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // --- Carga del modelo (comprimido con meshopt)
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader
      .loadAsync(this.src())
      .then((gltf) => {
        const model = gltf.scene;

        const box = new Box3().setFromObject(model);
        const size = box.getSize(new Vector3());
        model.position.sub(box.getCenter(new Vector3())); // centra la prenda en el origen
        scene.add(model);

        model.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const m of materials) {
            if (m instanceof MeshStandardMaterial) {
              m.side = DoubleSide;
              this.materials.push(m);
            }
          }
        });
        this.applyColor(this.color());

        // Encuadre: la cámara se coloca a la distancia justa para que quepa entera
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = (maxDim / 2 / Math.tan((camera.fov * Math.PI) / 360)) * 1.35;
        camera.position.set(0, size.y * 0.04, distance);
        controls.minDistance = distance * 0.5;
        controls.maxDistance = distance * 1.8;
        controls.update();

        this.status.set('ready');
        this.requestRender();
      })
      .catch(() => this.status.set('error'));

    resize();

    this.teardown = () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        object.geometry.dispose();
        [object.material].flat().forEach((m) => m.dispose());
      });
      environment.dispose();
      renderer.dispose();
    };
  }
}