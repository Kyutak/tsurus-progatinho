import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import Matter from "matter-js";
import { tsuruDataUrl } from "@/lib/tsuruSvg";
import { playPaperDrop } from "@/lib/sounds";

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type TsuruSceneHandle = {
  addOne: () => void;
  removeOne: () => void;
  fillToLimit: (count: number) => void;
};

type Props = {
  color: string;
  baseCount: number;
  maxBodies?: number;
};

const TSURU_SIZE = 38;
const WALL_THICKNESS = 60;

// Geometria da caixa (em proporção do container, 0..1)
// A caixa tem perspectiva: topo mais largo (frente em baixo), tampa aberta no topo
// Coordenadas em % do retângulo total
const BOX = {
  // Borda interna (área onde os tsurus caem)
  innerLeft: 0.08,
  innerRight: 0.92,
  innerTop: 0.12, // entrada (tampa aberta)
  innerBottom: 0.92,
  // Borda externa frontal (perspectiva)
  frontBottom: 0.99,
  frontLeft: 0.02,
  frontRight: 0.98,
};

export const TsuruScene = forwardRef<TsuruSceneHandle, Props>(function TsuruScene(
  { color, baseCount, maxBodies = 80 },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [popPositions, setPopPositions] = useState<{ x: number; y: number; id: number }[]>([]);
  const popIdRef = useRef(0);

  // Atualiza a textura quando a cor muda — re-tinta tudo
  useEffect(() => {
    if (!bodiesRef.current.length) return;
    const url = tsuruDataUrl(color, TSURU_SIZE * 2);
    bodiesRef.current.forEach((b) => {
      if (b.render.sprite) {
        b.render.sprite.texture = url;
      }
    });
  }, [color]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    sizeRef.current = { w, h };

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0012 },
    });
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: container,
      engine,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    renderRef.current = render;
    render.canvas.style.filter = `drop-shadow(0 0 18px ${hexToRgba(color, 0.65)})`;
    render.canvas.style.willChange = "filter";

    addWalls(engine, w, h);

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Som ao colidir tsuru com qualquer coisa
    const collisionHandler = (evt: Matter.IEventCollision<Matter.Engine>) => {
      for (const pair of evt.pairs) {
        const speed = Math.max(
          Math.abs(pair.bodyA.velocity.y),
          Math.abs(pair.bodyB.velocity.y),
        );
        if (speed > 2.5) {
          playPaperDrop();
          break; // um som por evento, evita poluir
        }
      }
    };
    Matter.Events.on(engine, "collisionStart", collisionHandler);

    // Resize
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      sizeRef.current = { w: nw, h: nh };
      render.canvas.width = nw * (window.devicePixelRatio || 1);
      render.canvas.height = nh * (window.devicePixelRatio || 1);
      render.canvas.style.width = `${nw}px`;
      render.canvas.style.height = `${nh}px`;
      render.options.width = nw;
      render.options.height = nh;
      Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: nw, y: nh },
      });
      // Refaz as paredes pro novo tamanho
      Matter.Composite.clear(engine.world, true, false);
      // Recria estáticos e mantém corpos vivos
      const dynamic = bodiesRef.current.filter((b) => !b.isStatic);
      Matter.Composite.add(engine.world, dynamic);
      addWalls(engine, nw, nh);
    });
    ro.observe(container);

    return () => {
      Matter.Events.off(engine, "collisionStart", collisionHandler);
      ro.disconnect();
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      bodiesRef.current = [];
    };
  }, []);

  function addWalls(engine: Matter.Engine, w: number, h: number) {
    const left = BOX.innerLeft * w;
    const right = BOX.innerRight * w;
    const bottom = BOX.innerBottom * h;
    const wallOpts = {
      isStatic: true,
      render: { visible: false },
    } as const;
    const walls = [
      // Fundo
      Matter.Bodies.rectangle(
        (left + right) / 2,
        bottom + WALL_THICKNESS / 2,
        right - left + WALL_THICKNESS,
        WALL_THICKNESS,
        wallOpts,
      ),
      // Esquerda (interna)
      Matter.Bodies.rectangle(
        left - WALL_THICKNESS / 2,
        h / 2,
        WALL_THICKNESS,
        h * 2,
        wallOpts,
      ),
      // Direita (interna)
      Matter.Bodies.rectangle(
        right + WALL_THICKNESS / 2,
        h / 2,
        WALL_THICKNESS,
        h * 2,
        wallOpts,
      ),
    ];
    Matter.Composite.add(engine.world, walls);
  }

  function spawnTsuru(animated = true) {
    const engine = engineRef.current;
    if (!engine) return;
    const { w, h } = sizeRef.current;

    if (bodiesRef.current.length >= maxBodies) {
      const oldest = bodiesRef.current.shift();
      if (oldest) Matter.Composite.remove(engine.world, oldest);
    }

    // Spawna dentro da boca da caixa
    const left = BOX.innerLeft * w;
    const right = BOX.innerRight * w;
    const inset = (right - left) * 0.15;
    const x = left + inset + Math.random() * (right - left - inset * 2);
    const y = animated
      ? BOX.innerTop * h - 20
      : BOX.innerBottom * h - 30 - Math.random() * (h * 0.3);

    const body = Matter.Bodies.circle(x, y, TSURU_SIZE / 2.4, {
      restitution: 0.25,
      friction: 0.4,
      density: 0.0009,
      frictionAir: 0.015,
      render: {
        sprite: {
          texture: tsuruDataUrl(color, TSURU_SIZE * 2),
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });
    if (animated) {
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
    } else {
      Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.6);
    }
    Matter.Composite.add(engine.world, body);
    bodiesRef.current.push(body);
  }

  useImperativeHandle(ref, () => ({
    addOne: () => spawnTsuru(true),
    removeOne: () => {
      const engine = engineRef.current;
      if (!engine || !bodiesRef.current.length) return;
      const body = bodiesRef.current.pop();
      if (!body) return;
      const pos = { x: body.position.x, y: body.position.y, id: ++popIdRef.current };
      Matter.Composite.remove(engine.world, body);
      setPopPositions((p) => [...p, pos]);
      setTimeout(() => {
        setPopPositions((p) => p.filter((x) => x.id !== pos.id));
      }, 400);
    },
    fillToLimit: (count: number) => {
      const target = Math.min(count, maxBodies);
      const need = target - bodiesRef.current.length;
      for (let i = 0; i < need; i++) spawnTsuru(false);
    },
  }));

  const baseSilhouettes = Math.min(baseCount, 40);

  return (
    <div className="relative h-full w-full">
      {/* Camada de fundo: silhuetas estáticas dentro da caixa */}
      <div
        className="pointer-events-none absolute left-[8%] right-[8%] bottom-[6%] flex items-center justify-center gap-0.5 overflow-hidden opacity-90"
        style={{
          height: 4.5 * 1.1 + "rem",
        }}
      >
        {Array.from({ length: baseSilhouettes }).map((_, i) => (
          <img
            key={i}
            src={tsuruDataUrl(color, 32)}
            alt=""
            style={{
              width: 22,
              height: 22,
              transform: `rotate(${(i * 17) % 40 - 20}deg)`,
            }}
          />
        ))}
      </div>

      {/* Canvas matter.js */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Animações de pop ao remover */}
      {popPositions.map((p) => (
        <img
          key={p.id}
          src={tsuruDataUrl(color, 40)}
          alt=""
          className="tsuru-pop pointer-events-none absolute"
          style={{
            left: p.x - 20,
            top: p.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </div>
  );
});
