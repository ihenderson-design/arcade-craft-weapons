namespace OmegaBattle {
    export interface Weapon {
        name: string;
        ammo: number;
        fireRate: number;
        isAutomatic: boolean;
        projectileType: number; // SpriteKind
        sway: number;
    }

    export class WeaponManager {
        public currentWeapon: Weapon;
        private lastFireTime: number;
        private weaponSprite: Sprite;

        constructor(private player: Sprite) {
            this.lastFireTime = 0;
        }

        public equip(weapon: Weapon) {
            this.currentWeapon = weapon;
            game.showLongText("EQUIPPED: " + weapon.name, DialogLayout.Bottom);
        }

        public fire() {
            if (!this.currentWeapon || game.runtime() - this.lastFireTime < this.currentWeapon.fireRate) return;
            
            this.lastFireTime = game.runtime();
            let projectile = sprites.createProjectileFromSprite(img`1`, this.player, 100, 0);
            
            // Apply Sway (Trajectory Randomization)
            projectile.vy = Math.randomRange(-this.currentWeapon.sway, this.currentWeapon.sway);
            
            // Muzzle Flash Logic
            this.player.image.fill(1); // Brief flicker
            timer.after(50, () => {
                // Restore original image logic here
            });
        }
    }
}
