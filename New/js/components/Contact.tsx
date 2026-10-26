import { lazy, Suspense, useState, useId } from 'react';
import { ContactTitle } from './ContactTitle';
const Showcase = lazy(() => import('./Showcase').then(m => ({ default: m.Showcase })));

function ContactIcon({ copy = false }: { copy?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {copy ? <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M15 8V4H4v11h4" /></> : <><path d="M6 18 18 6M6 6h12v12" /></>}
  </svg>;
}

function ContactArtwork({ kind }: { kind: 'mail' | 'phone' | 'wechat' | 'qq' }) {
  const id = useId().replace(/:/g, '');
  const colors = { mail: ['#85f7ff', '#459dff'], phone: ['#ffd79a', '#ff782e'], wechat: ['#60ffef', '#05c477'], qq: ['#8dbfff', '#7674ff'] }[kind];
  return <svg className="contact-artwork" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-color`} x2=".8" y2="1"><stop stopColor={colors[0]}/><stop offset="1" stopColor={colors[1]}/></linearGradient>
      <linearGradient id={`${id}-glass`} x2="1" y2=".8"><stop stopColor="white" stopOpacity=".65"/><stop offset=".5" stopColor={colors[0]} stopOpacity=".3"/><stop offset="1" stopColor="white" stopOpacity=".8"/></linearGradient>
      <filter id={`${id}-blur`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <ellipse cx="55" cy="80" rx="27" ry="9" fill={colors[1]} opacity=".24" stroke="none" filter={`url(#${id}-blur)`}/>
    <rect x="12" y="13" width="61" height="65" rx="19" fill={`url(#${id}-color)`} stroke="none" transform="rotate(-12 42 45)"/>
    <rect x="31" y="38" width="47" height="42" rx="15" fill={colors[1]} stroke="none" opacity=".6" filter={`url(#${id}-blur)`}/>
    <rect x="28" y="24" width="61" height="64" rx="20" fill={`url(#${id}-glass)`} strokeOpacity=".75" strokeWidth=".8"/>
    <g transform="translate(31 28) scale(.67)">
    {kind === 'mail' && <><rect x="12" y="23" width="56" height="39" rx="7"/><path d="m14 26 26 20 26-20M13 59l18-19m36 19L49 40M24 14h32"/></>}
    {kind === 'phone' && <><rect x="23" y="9" width="34" height="62" rx="9"/><path d="M34 16h12M36 63h8M64 24q10 16 0 32M16 29q-6 11 0 22"/><circle cx="40" cy="39" r="10"/></>}
    {kind === 'wechat' && <><path d="M44 47c-4 3-9 4-14 4l-11 7 2-11C5 35 15 17 33 17c15 0 25 11 22 23"/><path d="M60 65l-9-5c-15 2-24-8-20-18s20-14 30-6 10 19-2 24z"/><circle cx="26" cy="32" r="2"/><circle cx="40" cy="32" r="2"/><circle cx="44" cy="46" r="1.5"/><circle cx="57" cy="46" r="1.5"/></>}
    {kind === 'qq' && <><path d="M24 37c-3-29 35-29 32 0l7 16-8-3c7 18-37 18-30 0l-8 3z"/><path d="M24 38q16 9 32 0M27 44l-3 10M30 66l-10 4m30-4 10 4"/><ellipse cx="40" cy="31" rx="7" ry="3"/><path d="M33 23v2m14-2v2"/></>}
    </g>
  </svg>;
}

export function Contact() {
  const [showExperience, setShowExperience] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText('YoungSlikera');
      setCopyStatus('微信号已复制，可在微信中搜索添加。');
    } catch {
      setCopyStatus('未能自动复制，请长按或选中微信号复制。');
    }
  };
  return <section id="contact" className="section contact" aria-label="联系与结束">
    <p className="eyebrow">05 / WHAT'S NEXT</p><ContactTitle />
    <div className="contact-row">
      <div className="contact-details">
        <p>联系我</p>
        <ul className="contact-methods" aria-label="联系方式">
          <li><a href="mailto:zyg203320@163.com" aria-label="发送邮件至 zyg203320@163.com"><ContactArtwork kind="mail" /><span className="contact-method-label">MAIL</span><span className="contact-method-value">zyg203320@163.com</span><ContactIcon /></a></li>
          <li><a href="tel:+8615248120655" aria-label="拨打电话 15248120655"><ContactArtwork kind="phone" /><span className="contact-method-label">TEL</span><span className="contact-method-value">15248120655</span><ContactIcon /></a></li>
          <li><button type="button" onClick={copyWechat} aria-label="复制微信号 YoungSlikera"><ContactArtwork kind="wechat" /><span className="contact-method-label">WX</span><span className="contact-method-value">YoungSlikera</span><ContactIcon copy /></button></li>
          <li><a href="https://wpa.qq.com/msgrd?v=3&uin=3187134482&site=qq&menu=yes" target="_blank" rel="noopener noreferrer" aria-label="打开 QQ 会话 3187134482" title="打开 QQ 会话（需安装 QQ）"><ContactArtwork kind="qq" /><span className="contact-method-label">QQ</span><span className="contact-method-value">3187134482</span><ContactIcon /></a></li>
        </ul>
        <span className="contact-copy-status" role="status">{copyStatus}</span>
      </div>
      <button type="button" className="contact-link contact-experience-toggle" aria-expanded={showExperience} aria-controls="contact-experience" onClick={() => setShowExperience(open => !open)}>浏览体验 · 多设备演示 <span aria-hidden="true">{showExperience ? "−" : "+"}</span></button>
    </div>
    <div id="contact-experience" hidden={!showExperience}>{showExperience && <Suspense fallback={<p role="status">正在载入浏览体验…</p>}><Showcase /></Suspense>}</div>
    <footer><span>YOUNGSLIKER® — CREATIVE ARCHIVE</span><a href="#hero">BACK TO TOP ↑</a></footer>
  </section>;
}
