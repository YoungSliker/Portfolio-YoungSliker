import type { MutableRefObject } from 'react';
export interface PaperController {
  fold: (amount:number)=>Promise<boolean>;
  image: (src:string)=>Promise<void>;
  reset: ()=>void;
}
export interface PaperCrumpleProps {
  src:string;
  autoRef?:MutableRefObject<PaperController|null>;
  onReady?:()=>void;
  onError?:(error:Error)=>void;
  [key:string]:unknown;
}
