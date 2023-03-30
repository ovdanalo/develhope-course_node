import { counterInstance } from './counter.mjs';
import './script-1.mjs';
import './script-2.mjs';

counterInstance.increment();

console.log("[count]:", counterInstance.count);
