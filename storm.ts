namespace OmegaBattle {
    export class Storm {
        private zone: rect;
        private damageTick: number = 500;

        constructor(public width: number, public height: number) {
            this.zone = Array.create(0, 0, width, height); // Simplified for Meowbit RAM
            
            // The Survival Loop
            game.onUpdateInterval(this.damageTick, function() {
                let p = sprites.allOfKind(SpriteKind.Player)[0];
                if (!p) return;

                // Check if outside bounds
                if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) {
                    info.changeLifeBy(-1);
                    screen.shake(2, 200);
                }
            });
        }

        public shrink(amount: number) {
            this.width -= amount;
            this.height -= amount;
        }
    }
}
