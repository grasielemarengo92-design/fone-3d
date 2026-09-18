import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, useProgress, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Scene } from './three/Experience';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import {
  RotateSection,
  ZoomSection,
  DisassemblyStartSection,
  InternalsSection,
  ReassemblySection,
  FinalSection,
} from './components/Narrative';
import { TechnologySection } from './components/TechnologySection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AudioSection } from './components/AudioSection';
import { BatterySection } from './components/BatterySection';
import { ConnectivitySection } from './components/ConnectivitySection';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { InteractionHint } from './components/InteractionHint';
import { ComponentInfoPanel } from './components/ComponentInfoPanel';
import { AccessibilityControls } from './components/AccessibilityControls';
import { CursorLabelProvider } from './hooks/useCursorLabel';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIsMobile } from './hooks/useIsMobile';
import { TOTAL_PAGES } from './data/timeline';
import type { PartId } from './data/content';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function LoaderBridge({ onProgress }: { onProgress: (p: number, active: boolean) => void }) {
  const { progress, active } = useProgress();
  useEffect(() => {
    onProgress(progress, active);
  }, [progress, active, onProgress]);
  return null;
}

function StaticFallback() {
  return (
    <div className="webgl-fallback">
      <h1>Auravox</h1>
      <p>Som. Tecnologia. Redefinidos.</p>
      <p className="muted-note">
        Seu navegador ou dispositivo não suporta a experiência 3D interativa (WebGL). Aqui está uma
        versão simplificada do conceito.
      </p>
    </div>
  );
}

export default function App() {
  const [reducedMotion, setReducedMotion] = useReducedMotion();
  const [selectedPart, setSelectedPart] = useState<PartId | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const isMobile = useIsMobile();
  const webglSupported = useMemo(() => hasWebGL(), []);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loadProgress >= 100 && minTimeElapsed) {
      setLoading(false);
    }
  }, [loadProgress, minTimeElapsed]);

  const scrollElementRef = (el: HTMLDivElement | null) => {
    if (el) el.scrollTo({ top: 0 });
  };

  if (!webglSupported) {
    return (
      <CursorLabelProvider>
        <Header />
        <main id="main-content">
          <StaticFallback />
          <TechnologySection reducedMotion />
          <HowItWorksSection />
          <AudioSection />
          <BatterySection />
          <ConnectivitySection />
        </main>
        <Footer />
      </CursorLabelProvider>
    );
  }

  return (
    <CursorLabelProvider>
      <LoadingScreen visible={loading} progress={loadProgress} />
      <AccessibilityControls reduced={reducedMotion} onToggle={setReducedMotion} />
      {!isMobile && <CustomCursor />}
      <Header />

      <main id="main-content" style={{ height: '100vh' }}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 5.4], fov: 38 }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#fafaf9']} />
          <AdaptiveDpr pixelated={false} />
          <AdaptiveEvents />
          <Suspense fallback={null}>
            <LoaderBridge onProgress={(p) => setLoadProgress(p)} />
            <ScrollControls pages={TOTAL_PAGES} damping={0.25}>
              <Scene
                reducedMotion={reducedMotion}
                selectedPart={selectedPart}
                onSelectPart={setSelectedPart}
              />
              <Scroll html>
                <div ref={scrollElementRef} style={{ width: '100vw' }}>
                  <Hero reducedMotion={reducedMotion} />
                  <RotateSection />
                  <ZoomSection />
                  <DisassemblyStartSection />
                  <InternalsSection />
                  <TechnologySection reducedMotion={reducedMotion} />
                  <HowItWorksSection />
                  <AudioSection />
                  <BatterySection />
                  <ConnectivitySection />
                  <ReassemblySection />
                  <FinalSection />
                </div>
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </main>

      <InteractionHint
        onExplore={() => {
          const target = document.querySelector('.internals-section');
          target?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
      />
      <ComponentInfoPanel selected={selectedPart} onClose={() => setSelectedPart(null)} />

      <Footer />
    </CursorLabelProvider>
  );
}
