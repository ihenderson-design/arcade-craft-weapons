/**
 * OMEGA-PROTOCOL: BATTLE ROYALE FRAMEWORK
 * HARDENED STANDALONE VERSION
 */

namespace OmegaBattle {
    // --- WEAPON SYSTEM ---
    export interface Weapon {
        name: string;
        ammo: number;
        fireRate: number;
        isAutomatic: boolean;
        projectileType: number;
        sway: number;
    }

    export class WeaponManager {
        public currentWeapon: Weapon;
        private lastFireTime: number;

        constructor(private player: Sprite) {
            this.lastFireTime = 0;
        }

        public equip(weapon: Weapon) {
            this.currentWeapon = weapon;
            this.player.say("EQUIPPED: " + weapon.name, 1000);
        }

        public fire() {
            if (!this.currentWeapon) return;
            if (control.millis() - this.lastFireTime < this.currentWeapon.fireRate) return;
            
            this.lastFireTime = control.millis();
            
            // Generate Projectile
            let projectile = sprites.createProjectileFromSprite(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 2 2 . . . . . . . 
                . . . . . . 2 4 4 2 . . . . . . 
                . . . . . . 2 4 4 2 . . . . . . 
                . . . . . . . 2 2 . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
            `, this.player, 100, 0);
            
            // Randomized Trajectory (Sway)
            projectile.vy = Math.randomRange(-this.currentWeapon.sway, this.currentWeapon.sway);
            
            // Hardware-safe Muzzle Flash
            this.player.setFlag(SpriteFlag.Invisible, true);
            pause(50);
            this.player.setFlag(SpriteFlag.Invisible, false);
        }
    }

    // --- DEPLOYMENT SYSTEM ---
    export class BattleBus {
        public busSprite: Sprite;
        public active: boolean;

        constructor() {
            this.active = true;
            this.busSprite = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . 8 8 8 8 8 8 8 . . . . . 
                . . . 8 1 1 8 8 8 1 1 8 . . . . 
                . . 8 8 8 8 8 8 8 8 8 8 8 . . . 
                . 8 8 8 8 8 8 8 8 8 8 8 8 8 . . 
                . 8 8 f f 8 8 8 8 8 f f 8 8 . . 
                . . . f f . . . . . f f . . . . 
            `, SpriteKind.Player);
            this.busSprite.setPosition(0, 20);
            this.busSprite.vx = 40;
            scene.cameraFollowSprite(this.busSprite);
        }

        public jump(player: Sprite) {
            if (!this.active) return;
            this.active = false;
            
            player.setPosition(this.busSprite.x, this.busSprite.y);
            player.ay = 50; // Gliding Gravity
            scene.cameraFollowSprite(player);
            this.busSprite.destroy();
        }
    }

    // --- THE STORM ---
    export class Storm {
        private stormBox: Sprite;
        constructor(public size: number) {
            // Visual representation of the safe zone
            this.stormBox = sprites.create(image.create(size, size), SpriteKind.Food);
            this.stormBox.image.drawRect(0, 0, size, size, 2);
            
            game.onUpdateInterval(500, function() {
                let p = sprites.allOfKind(SpriteKind.Player)[0];
                if (!p) return;
                
                // Optimized Bounds Check
                if (Math.abs(p.x - 80) > size / 2 || Math.abs(p.y - 60) > size / 2) {
                    info.changeLifeBy(-1);
                }
            });
        }
    }
}

// --- INITIALIZATION ---
let survivor = sprites.create(img`
    . . . . . 5 5 5 5 . . . . . 
    . . . . 5 5 5 5 5 5 . . . . 
    . . . . d d d d d d . . . . 
    . . . . d f d d f d . . . . 
    . . . . d d d d d d . . . . 
    . . . . d d f f d d . . . . 
    . . . . . 8 8 8 8 . . . . . 
    . . . 8 8 8 8 8 8 8 8 . . . 
    . . . 8 8 8 8 8 8 8 8 . . . 
    . . . 8 8 8 8 8 8 8 8 . . . 
    . . . 2 2 8 8 8 8 2 2 . . . 
    . . . . . 8 8 8 8 . . . . . 
    . . . . . 8 8 8 8 . . . . . 
    . . . . . 2 . . 2 . . . . . 
`, SpriteKind.Player);

let bus = new OmegaBattle.BattleBus();
let weaponSys = new OmegaBattle.WeaponManager(survivor);
let storm = new OmegaBattle.Storm(120);

// Sample Weapon Data
let rifle: OmegaBattle.Weapon = {
    name: "ARK-REAPER",
    ammo: 30,
    fireRate: 200,
    isAutomatic: true,
    projectileType: SpriteKind.Projectile,
    sway: 10
};

controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    if (bus.active) {
        bus.jump(survivor);
        weaponSys.equip(rifle);
    } else {
        weaponSys.fire();
    }
});
