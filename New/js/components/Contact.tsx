import { lazy, Suspense, useState } from 'react';
import { ContactTitle } from './ContactTitle';
const Showcase = lazy(() => import('./Showcase').then(m => ({ default: m.Showcase })));

function ContactIcon({ copy = false }: { copy?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {copy ? <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M15 8V4H4v11h4" /></> : <><path d="M6 18 18 6M6 6h12v12" /></>}
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
        <p>有想法，欢迎聊聊。</p>
        <ul className="contact-methods" aria-label="联系方式">
          <li><a href="mailto:zyg203320@163.com" aria-label="发送邮件至 zyg203320@163.com"><span className="contact-method-label">MAIL</span><span className="contact-method-value">zyg203320@163.com</span><ContactIcon /></a></li>
          <li><a href="tel:+8615248120655" aria-label="拨打电话 15248120655"><span className="contact-method-label">TEL</span><span className="contact-method-value">15248120655</span><ContactIcon /></a></li>
          <li><button type="button" onClick={copyWechat} aria-label="复制微信号 YoungSlikera"><span className="contact-method-label">WX</span><span className="contact-method-value">YoungSlikera</span><ContactIcon copy /></button></li>
          <li><a href="https://wpa.qq.com/msgrd?v=3&uin=3187134482&site=qq&menu=yes" target="_blank" rel="noopener noreferrer" aria-label="打开 QQ 会话 3187134482" title="打开 QQ 会话（需安装 QQ）"><span className="contact-method-label">QQ</span><span className="contact-method-value">3187134482</span><ContactIcon /></a></li>
        </ul>
        <span className="contact-copy-status" role="status">{copyStatus}</span>
      </div>
      <button type="button" className="contact-link contact-experience-toggle" aria-expanded={showExperience} aria-controls="contact-experience" onClick={() => setShowExperience(open => !open)}>浏览体验 · 多设备演示 <span aria-hidden="true">{showExperience ? "−" : "+"}</span></button>
    </div>
    <div id="contact-experience" hidden={!showExperience}>{showExperience && <Suspense fallback={<p role="status">正在载入浏览体验…</p>}><Showcase /></Suspense>}</div>
    <footer><span>YOUNGSLIKER® — CREATIVE ARCHIVE</span><a href="#hero">BACK TO TOP ↑</a></footer>
  </section>;
}
