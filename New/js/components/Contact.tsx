import { legacyAsset } from '../lib/assets';

export function Contact() {
  return <section id="contact" className="section contact" aria-label="联系与结束">
    <p className="eyebrow">06 / WHAT'S NEXT</p><h2>STAY CURIOUS.<br />KEEP CREATING<span>.</span></h2>
    <div className="contact-row"><p>有想法，欢迎聊聊。<br /><span><a href="mailto:zyg203320@163.com">zyg203320@163.com</a></span></p><a className="contact-link" href={legacyAsset('index.html', import.meta.env.BASE_URL)}>查看已有作品 <span aria-hidden="true">↗</span></a></div>
    <footer><span>YOUNGSLIKER® — CREATIVE ARCHIVE</span><a href="#hero">BACK TO TOP ↑</a></footer>
  </section>;
}
