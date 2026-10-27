import '../../css/drafting-details.css';

/** Construction marks inherit the bounds of the content they describe. */
export function DraftingDetails({ variant }: { variant: 'hero' | 'about' | 'journey' | 'works' | 'contact' }) {
  const labels = { hero:'TYPE / 01', about:'IDEA / 02', journey:'PROCESS / 03', works:'ARCHIVE / 04', contact:'CONNECT / 05' };
  return <span className={`drafting-details drafting-details--${variant}`} aria-hidden="true">
    <span className="drafting-dimension"><span>{labels[variant]}</span></span>
    <span className="drafting-ruler"/>
    <span className="drafting-cross drafting-cross--start"/>
    <span className="drafting-cross drafting-cross--end"/>
    <span className="drafting-arc"/>
  </span>;
}
