import memoize from "lodash/memoize";
import { Subject, from } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { type Texture, TextureLoader } from "three";

export class TextureCache {
  private readonly textureLoader = new TextureLoader();
  private readonly cancelSubject = new Subject();

  private readonly memoizedPromise = memoize((url: string): Promise<Texture> => this.textureLoader.loadAsync(url));

  load(url: string): Promise<Texture> {
    return from(this.memoizedPromise(url)).pipe(takeUntil(this.cancelSubject)).toPromise();
  }

  destroy(): void {
    this.cancelSubject.next();
    this.memoizedPromise.cache.clear?.();
    this.cancelSubject.complete();
  }
}
