import { animate, style, transition, trigger } from '@angular/animations';

/**
 * 淡入淡出动画
 */
export const fadeAnimation = trigger('fadeAnimation', [
    transition(':enter', [
        style({
            transform: 'scale3d(1.075, 1.075, 1)',
            opacity: 0,
        }),
        animate('250ms ease-out', style({
            transform: 'scale3d(1, 1, 1)',
            opacity: 1
        })),
    ]),
    transition(':leave', [
        animate('250ms ease-out', style({
            transform: 'scale3d(0.95, 0.95, 1)',
            opacity: 0
        }))
    ])
]);