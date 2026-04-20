namespace OmegaBattle {
    export class BattleBus {
        public busSprite: Sprite;
        private isDeploying: boolean;

        constructor() {
            this.busSprite = sprites.create(img`
                . . . f f f f f f . . .
                . . f 8 8 8 8 8 8 f . .
                . f 8 1 1 8 8 1 1 8 f .
                f 8 8 8 8 8 8 8 8 8 8 f
                f f f f f f f f f f f f
            `, SpriteKind.Player);
            this.busSprite.vx = 50;
            this.busSprite.setFlag(SpriteFlag.Ghost, true);
            scene.cameraFollowSprite(this.busSprite);
            this.isDeploying = true;
        }

        public jump(player: Sprite) {
            if (!this.isDeploying) return;
            this.isDeploying = false;
            
            player.setPosition(this.busSprite.x, this.busSprite.y);
            player.ay = 50; // Reduced gravity for "Gliding"
            scene.cameraFollowSprite(player);
            this.busSprite.destroy();
        }
    }
}
