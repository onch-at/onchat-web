import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

const options = {
    optional: true
};

/**
 * 水平滑动动画
 */
export const horizontalSlideAnimation = trigger('horizontalSlideInAnimation', [
    transition('1 => *, 2 => 3', [
        style({
            position: 'relative'
        }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
            })
        ], options),
        query(':enter', [
            style({
                left: '100%'
            })
        ], options),
        query(':leave', animateChild(), options),
        group([
            query(':leave', [
                animate('250ms ease-out', style({ left: '-100%' }))
            ], options),
            query(':enter', [
                animate('250ms ease-out', style({ left: '0%' }))
            ], options)
        ]),
        query(':enter', animateChild(), options),
    ]),

    transition('2 => 1, 3 => *', [
        style({
            position: 'relative'
        }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
            })
        ], options),
        query(':enter', [
            style({
                left: '-100%'
            })
        ], options),
        query(':leave', animateChild(), options),
        group([
            query(':leave', [
                animate('300ms ease-out', style({ left: '100%' }))
            ], options),
            query(':enter', [
                animate('300ms ease-out', style({ left: '0%' }))
            ], options)
        ]),
        query(':enter', animateChild(), options),
    ]),
]);

// export const verticalSlideInAnimation = trigger('verticalSlideInAnimation', [
//     transition('1 => 2, 1 => 3, 1 => 4, 2 => 3, 2 => 4, 3 => 4', [
//         style({
//             position: 'relative'
//         }),
//         query(':enter, :leave', [
//             style({
//                 position: 'absolute',
//                 top: '3rem',
//                 left: '3rem',
//                 width: 'calc(100vw - 3rem)'
//             })
//         ]),
//         query(':enter', [
//             style({
//                 top: '100vh'
//             })
//         ]),
//         query(':leave', animateChild()),
//         group([
//             query(':leave', [
//                 animate('250ms ease-out', style({ top: '-100vh' }))
//             ]),
//             query(':enter', [
//                 animate('250ms ease-out', style({ top: '3rem' }))
//             ])
//         ]),
//         query(':enter', animateChild()),
//     ]),

//     transition('2 => 1, 3 => 2, 3 => 1, 4 => 3, 4 => 2, 4 => 1', [
//         style({
//             position: 'relative'
//         }),
//         query(':enter, :leave', [
//             style({
//                 position: 'absolute',
//                 top: '3rem',
//                 left: '3rem',
//                 width: 'calc(100vw - 3rem)'
//             })
//         ]),
//         query(':enter', [
//             style({
//                 top: '-100vh'
//             })
//         ]),
//         query(':leave', animateChild()),
//         group([
//             query(':leave', [
//                 animate('250ms ease-out', style({ top: '100vh' }))
//             ]),
//             query(':enter', [
//                 animate('250ms ease-out', style({ top: '3rem' }))
//             ])
//         ]),
//         query(':enter', animateChild()),
//     ]),
// ]);