import { ScrollProgress } from '../components/ScrollProgress';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Journey } from '../components/Journey';
import { Works } from '../components/Works';
import { Showcase } from '../components/Showcase';
import { Contact } from '../components/Contact';
import { useSections } from '../hooks/useSections';

export function App() {
  const active = useSections();
  return <><a className="skip-link" href="#about">跳到主要内容</a><Header active={active} /><main><Hero /><About /><Journey /><Works /><Showcase /><Contact /></main><ScrollProgress active={active} /></>;
}
