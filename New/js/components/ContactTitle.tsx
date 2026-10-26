import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const TechText = lazy(() => import('./TechText'));
const lines = ['STAY CURIOUS.', 'KEEP CREATING.'];

export function ContactTitle() {
  const heading = useRef<HTMLHeadingElement>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNear(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    if (heading.current) observer.observe(heading.current);
    return () => { observer.disconnect(); preference.removeEventListener('change', update); };
  }, []);
  return <h2 ref={heading} className="contact-tech-heading" aria-label={lines.join(' ')}>
    {lines.map(text => <span className="contact-tech-line" key={text} aria-hidden="true">
      {near && !reduced ? <Suspense fallback={<span className="contact-tech-fallback">{text}</span>}>
        <TechText text={text} fontWeight={700} fontSize={160} letterSpacing={-.07} align="center"
          color="#303d35" accentColor="#d86a42" reveal="letter" dashLength={2} dashGap={2}
          specks={24} intro="assemble" introDuration={2.2} clickKick guides={false} strokeWidth={1} />
      </Suspense> : <span className="contact-tech-fallback">{text}</span>}
    </span>)}
  </h2>;
}
