declare module 'plyr' {
  // Minimal declaration to satisfy TypeScript when using the Plyr JS package
  // This provides a default export to match common usage in the codebase.
  interface PlyrInstance {
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
    destroy(): void;
    play?(): void;
    pause?(): void;
    volume?: number;
    speed?: number;
    [key: string]: any;
  }

  const Plyr: {
    new (element: Element | HTMLVideoElement | HTMLAudioElement, options?: any): PlyrInstance;
  };

  export default Plyr;
}
