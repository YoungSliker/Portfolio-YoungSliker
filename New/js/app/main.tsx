import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '../../css/tokens.css';
import '../../css/base.css';
import '../../css/sections.css';
import '../../css/hero.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

import '../../css/scroll-progress.css';
import '../../css/background-grain.css';
