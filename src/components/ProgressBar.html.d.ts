export declare class ProgressBar extends Svelte {
    start(): () => void // Set the width to the minimum and increment until maximum width.
    complete(): () => void // Set the width to 100% and then hide after settleTime.
    reset(): () => void // Set the width to minimum but do not start incrementing.
    continue(): () => void // Start incrementing from whatever the current width is.
    stop(): () => void // Stop incrementing and take no further action.
}

export default ProgressBar;
/*
minimum (number, range: 0-1, default: 0.08): 
    The starting percent width to use when the bar starts. Starting at 0 doesn't usually look very good.
maximum (number, range: 0-1, default: 0.994): 
    The maximum percent width value to use when the bar is at the end but not marked as complete. Letting the bar stay at 100% width for a while doesn't usually look very good either.
intervalTime (number, default: 800): 
    Milliseconds to wait between incrementing bar width when using the start (auto-increment) method.
settleTime (number, default: 700): 
    Milliseconds to wait after the complete method is called to hide the progress bar. Letting it sit at 100% width for a very short time makes it feel more fluid.
*/



