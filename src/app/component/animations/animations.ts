import { AnimationController, Animation } from "@ionic/angular"

const animationCtrl = new AnimationController();
export const DURATION = 300;
const MAX_BACKDROP_OPACITY = .3;

export const enterPageAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
    if (opts.direction === 'forward') {
        return animationCtrl.create()
            .addElement(opts.enteringEl)
            .duration(DURATION)
            .easing('ease-in')
            .fromTo('opacity', 0, 1);
    } else {
        const rootAnimation = animationCtrl.create()
            .addElement(opts.enteringEl)
            .duration(DURATION)
            .easing('ease-in')
            .fromTo('opacity', 0, 1);
        const leavingAnimation = animationCtrl.create()
            .addElement(opts.leavingEl)
            .duration(DURATION)
            .easing('ease-out')
            .fromTo('opacity', 1, 0);
        return animationCtrl.create()
            .addAnimation(
                [
                    rootAnimation,
                    leavingAnimation
                ]
            );
    }
}

export const enterAlertAnimation = (baseEl: any, opts?: any) => {
    const wrapperAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('.alert-wrapper'))
        .fromTo('opacity', 0, 1)
        .fromTo('transform', `translateY(-${baseEl.clientHeight}px)`, 'translateY(0px)');
    const backdropAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0, MAX_BACKDROP_OPACITY);
    return animationCtrl.create()
        .addAnimation(
            [
                wrapperAnimation,
                backdropAnimation
            ]
        )
        .duration(DURATION);
}

export const leaveAlertAnimation = (baseEl: any, opts?: any) => {
    const wrapperAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('.alert-wrapper'))
        .fromTo('opacity', 1, 0)
        .fromTo('transform', 'translateY(0px)', `translateY(-${baseEl.clientHeight}px)`);
    const backdropAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', MAX_BACKDROP_OPACITY, 0);
    return animationCtrl.create()
        .addAnimation(
            [
                wrapperAnimation,
                backdropAnimation
            ]
        ).duration(DURATION);
}

export const enterLoading = (baseEl: any, opts?: any) => {
    const wrapperAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('.loading-wrapper'))
        .fromTo('opacity', 0, 1);
    const backdropAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0, MAX_BACKDROP_OPACITY);
    return animationCtrl.create()
        .addAnimation(
            [
                wrapperAnimation,
                backdropAnimation
            ]
        )
        .duration(DURATION);
}

export const leaveLoading = (baseEl: any, opts?: any) => {
    const wrapperAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('.loading-wrapper'))
        .fromTo('opacity', 1, 0);
    const backdropAnimation = animationCtrl.create()
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', MAX_BACKDROP_OPACITY, 0);
    return animationCtrl.create()
        .addAnimation(
            [
                wrapperAnimation,
                backdropAnimation
            ]
        )
        .duration(DURATION);
}