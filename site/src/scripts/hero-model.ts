import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  Group,
  Box3,
  Vector3,
  Material,
  Mesh,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  DoubleSide,
  SRGBColorSpace,
  MathUtils,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export function initHeroModel() {
  const root = document.querySelector<HTMLElement>('[data-hero-model]');
  if (!root || root.dataset.heroModelInitialized === 'true') return;

  root.dataset.heroModelInitialized = 'true';

  const canvasHost = root.querySelector<HTMLElement>('.hero-model-canvas');
  const poster = root.querySelector<HTMLElement>('.hero-model-poster');
  const modelUrl = root.dataset.modelUrl;

  if (!canvasHost || !modelUrl) return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};

  const mountModel = async () => {
    try {
      const scene = new Scene();
      const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });

      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      canvasHost.append(renderer.domElement);

      const camera = new PerspectiveCamera(32, 1, 0.1, 100);

      const ambientLight = new HemisphereLight(0xffffff, 0xd9d9d9, 2.2);
      const keyLight = new DirectionalLight(0xffffff, 2.1);
      keyLight.position.set(3.2, 2.8, 5);
      const rimLight = new DirectionalLight(0xffffff, 1);
      rimLight.position.set(-2.8, 1.4, -2.5);

      scene.add(ambientLight, keyLight, rimLight);

      const group = new Group();
      scene.add(group);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(modelUrl);
      const loadedObject = gltf.scene;

      loadedObject.traverse((child) => {
        if (child instanceof Mesh) {
          const applyMaterialFixes = (material: Material) => {
            if (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial) {
              material.side = DoubleSide;
              material.color.set(0xffffff);
              material.metalness = 0;
              material.roughness = 1;
              if (material.map) {
                material.map.colorSpace = SRGBColorSpace;
                material.map.needsUpdate = true;
              }
              material.needsUpdate = true;
            }
          };

          const childMaterial = child.material;
          if (Array.isArray(childMaterial)) {
            childMaterial.forEach(applyMaterialFixes);
          } else {
            applyMaterialFixes(childMaterial);
          }
          child.castShadow = false;
          child.receiveShadow = false;
          child.geometry.computeVertexNormals();
        }
      });

      const initialBox = new Box3().setFromObject(loadedObject);
      const initialSize = initialBox.getSize(new Vector3());
      const maxAxis = Math.max(initialSize.x, initialSize.y, initialSize.z) || 1;
      const scale = 2.9 / maxAxis;
      loadedObject.scale.setScalar(scale);
      loadedObject.updateMatrixWorld(true);

      const fittedBox = new Box3().setFromObject(loadedObject);
      const fittedSize = fittedBox.getSize(new Vector3());
      const fittedCenter = fittedBox.getCenter(new Vector3());
      loadedObject.position.sub(fittedCenter);
      loadedObject.position.y -= fittedSize.y * 0.6;
      loadedObject.rotation.x = -Math.PI / 2;
      group.add(loadedObject);

      const fitCamera = (width: number, height: number) => {
        const safeWidth = width || 1;
        const safeHeight = height || 1;
        camera.aspect = safeWidth / safeHeight;
        camera.updateProjectionMatrix();

        const fitHeightDistance =
          fittedSize.y / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)));
        const fitWidthDistance =
          fittedSize.x / (2 * camera.aspect * Math.tan(MathUtils.degToRad(camera.fov / 2)));
        const distance = 0.95 * Math.max(fitHeightDistance, fitWidthDistance, fittedSize.z);

        camera.position.set(0, fittedSize.y * 0.035, distance + fittedSize.z * 0.42);
        camera.lookAt(0, 0, 0);
      };

      const resize = () => {
        const { width, height } = canvasHost.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        fitCamera(width, height);
      };

      let frame = 0;
      let isVisible = true;
      let isInViewport = true;
      let isMounted = true;
      let pointerOffsetX = 0;
      let pointerOffsetY = 0;

      const render = () => {
        if (!isMounted || !isVisible || !isInViewport) return;

        if (!mediaQuery.matches) {
          group.rotation.y += 0.004;
        }

        group.rotation.y += (pointerOffsetX - group.rotation.y) * 0.04;
        group.rotation.x += (pointerOffsetY - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      };

      const syncAnimation = () => {
        const shouldAnimate = isVisible && isInViewport;

        if (shouldAnimate && !frame) {
          render();
        } else if (!shouldAnimate && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      };

      const onVisibility = () => {
        isVisible = !document.hidden;
        syncAnimation();
      };

      const onReducedMotionChange = () => syncAnimation();

      const viewportObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          isInViewport = Boolean(entry?.isIntersecting);
          syncAnimation();
        },
        { threshold: 0.1 }
      );

      const onPointerMove = (event: PointerEvent) => {
        const bounds = root.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;

        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

        pointerOffsetX = offsetX * 0.75;
        pointerOffsetY = offsetY * 0.3;
      };

      const onPointerLeave = () => {
        pointerOffsetX = 0;
        pointerOffsetY = 0;
      };

      resize();
      renderer.render(scene, camera);
      poster?.classList.add('is-ready');
      viewportObserver.observe(root);
      root.addEventListener('pointermove', onPointerMove);
      root.addEventListener('pointerleave', onPointerLeave);
      syncAnimation();

      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVisibility);

      if ('addEventListener' in mediaQuery) {
        mediaQuery.addEventListener('change', onReducedMotionChange);
      } else {
        mediaQuery.addListener(onReducedMotionChange);
      }

      cleanup = () => {
        isMounted = false;
        if (frame) window.cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibility);

        if ('removeEventListener' in mediaQuery) {
          mediaQuery.removeEventListener('change', onReducedMotionChange);
        } else {
          mediaQuery.removeListener(onReducedMotionChange);
        }

        root.removeEventListener('pointermove', onPointerMove);
        root.removeEventListener('pointerleave', onPointerLeave);
        viewportObserver.disconnect();
        renderer.dispose();

        loadedObject.traverse((child) => {
          if (child instanceof Mesh) {
            child.geometry.dispose();
            const childMaterial = child.material;
            if (Array.isArray(childMaterial)) {
              childMaterial.forEach((material) => material.dispose());
            } else {
              childMaterial.dispose();
            }
          }
        });
      };
    } catch (error) {
      console.error('Failed to initialize hero model', error);
    }
  };

  window.addEventListener(
    'pagehide',
    () => {
      cleanup();
    },
    { once: true }
  );

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        void mountModel();
      },
      { timeout: 250 }
    );
  } else {
    window.setTimeout(() => {
      void mountModel();
    }, 120);
  }
}
