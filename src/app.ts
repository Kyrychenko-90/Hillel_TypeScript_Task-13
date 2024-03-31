showHello('greeting', 'TypeScript');

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt!.innerText = `Hello from ${name}`;
}

/*
1. Cтворити декоратор Memoize для методу класу,
  який буде на основі отриманих аргументів метода повертати закешоване значення
 */

function Memoize() {
    const cache: Record<string, number> = {};
    return function <T>(
        originalMethod: (value: number) => number,
        context: { kind: string },
    ) {
        if (context.kind !== 'method') throw new Error('Decorator is only for methods');
        function replaceWithValue(this: T, value: number): number {
            const key = String(value);
            if (key in cache) {
                return cache[key];
            } else {
                const calculate: number = originalMethod.apply(this, [value]);
                cache[key] = calculate;
                return calculate;
            }
        }
        return replaceWithValue;
    };
}

export class CachedCalculations {
    @Memoize()
    double(value: number): number {
        return value * 2;
    }
}

const memoize = new CachedCalculations();
console.log(memoize.double(2));
console.log(memoize.double(2));
console.log(memoize.double(4));
console.log(memoize.double(4));

/*
2. Cтворити декоратор Debounce для методу класу,
  який за отриманим значенням буде відтерміновувати запуск методу
 */

function Debounce(delay: number = 0) {
    let timer: ReturnType<typeof setTimeout>;
    return function <T>(
        originalMethod: (...args: any[]) => void,
        context: { kind: string },
    ): (...args: any[]) => void {
        if (context.kind !== 'method') throw new Error('Decorator is only for methods');
        return function(this: T, ...args: any[]): void {
            clearTimeout(timer);
            timer = setTimeout(() => originalMethod.apply(this, args), delay);
        };
    };
}

export class DebouncedActions {
    @Debounce(5000)
    executeAfterDelay(): void {
        console.log('Debounced');
    }
}

const actions = new DebouncedActions();
actions.executeAfterDelay();

