namespace OmegaBattle {
    export enum ViewMode { TopDown, FirstPerson }
    
    export class PerspectiveEngine {
        private mode: ViewMode = ViewMode.TopDown;
        private hudGun: Sprite;

        constructor() {
            this.hudGun = sprites.create(img`8`, SpriteKind.Food); // Placeholder
            this.hudGun.setFlag(SpriteFlag.RelativeToCamera, true);
            this.hudGun.setFlag(SpriteFlag.Invisible, true);
        }

        public toggleView() {
            if (this.mode == ViewMode.TopDown) {
                this.mode = ViewMode.FirstPerson;
                // Integration with pxt-raycasting
                // raycasting.setRenderMode(true); 
                this.hudGun.setFlag(SpriteFlag.Invisible, false);
                this.hudGun.setPosition(80, 100);
            } else {
                this.mode = ViewMode.TopDown;
                this.hudGun.setFlag(SpriteFlag.Invisible, true);
            }
        }
    }
}
