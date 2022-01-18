import { SafeAny } from './app/common/interfaces';

/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
(window as SafeAny).__Zone_disable_customElements = true;
