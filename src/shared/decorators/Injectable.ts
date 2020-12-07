//
// TypeScript decorator: Marks a class as injectable.
//

const log = console;


function resolvePropertyDependencies(obj: any, injections: any[]): void {

    if (injections) {
        for (const injection of injections) {
            const dependencyId = injection[1];

            // Creates a new dependency instance or reuses the existing one.
            const singleton = instantiateSingleton(dependencyId);
            if (!singleton) {
                throw new Error("Failed to instantiate singleton " + dependencyId);
            }

            const propertyName = injection[0];

            // Inject the dependency into the object.
            obj[propertyName] = singleton;
        }
    }
}

function makeConstructorInjectable(origConstructor: Function): Function{

    if (!origConstructor.prototype.__injections__){
        // Record properties to be injected against the constructor prototype.
        origConstructor.prototype.__injections__ = [];
    }

    const proxyHandler = {
        // Intercepts the call to the original class constructor.
        construct(target: any, args: any[], newTarget: any){


            // Construct the object ...
            const obj = Reflect.construct(target, args, newTarget);

            try{
                // ... and then resolve property dependencies.
                const injections = origConstructor.prototype.__injections__;
                resolvePropertyDependencies(obj, injections);
            } catch (err){
                // ... log the error ...
                throw err;
            }

            return obj;
        }
    };



    // Wrap the original constructor in a proxy.
    // Use the proxy to inject dependencies.
    // Returns the proxy constructor to use in place of the original constructor.
    return new Proxy(origConstructor, proxyHandler);
}

export function instantiateSingleton<T = any>(dependencyId: string): T {
    try {
        const existingSingleton = instantiatedSingletons.get(dependencyId);
        if (existingSingleton) {
            // The singleton has previously been instantiated.
            return existingSingleton;
        }


        const singletonConstructor = singletonConstructors.get(dependencyId);
        if (!singletonConstructor) {
            // The requested constructor was not found.
            const msg = "No constructor found for singleton " + dependencyId;
            throw new Error(msg);
        }


        // Construct the singleton.
        const instantiatedSingleton =
            Reflect.construct(makeConstructorInjectable(singletonConstructor), []);

        // Cache the instantiated singleton for later reuse.
        instantiatedSingletons.set(dependencyId, instantiatedSingleton);
        return instantiatedSingleton;
    }
    catch (err) {
        log.error("Failed to instantiate singleton " + dependencyId);
        log.error(err && err.stack || err);
        throw err;
    }
}


//
// Constructors that can be called to instantiate singletons.
//
const singletonConstructors = new Map<string, Function>();

//
// Collection of all singletons objects that can be injected.
//
const instantiatedSingletons = new Map<string, any>();





export function registerSingleton(dependencyId: string, singleton: any): void {
    instantiatedSingletons.set(dependencyId, singleton);
}

//
// TypeScript decorator:
// Marks a class as an automatically created singleton that's available for injection.
// Makes a singleton available for injection.
//
const verbose = true;

export function InjectableSingleton(dependencyId: string): Function {
    if (verbose) {
        log.info("@@@@ Registering singleton " + dependencyId);
    }

    // Returns a factory function that records the constructor of the class so that
    // it can be lazily created later as as a singleton when required as a dependency.
    return (target: Function): void => {
        if (verbose) {
            log.info("@@@@ Caching constructor for singleton: " + dependencyId);
        }

        // Adds the target constructor to the set of lazily createable singletons.
        singletonConstructors.set(dependencyId, target);
    }
}

export function Injectable(): Function {

    //
// Takes a constructor and makes it 'injectable'.
// Wraps the constructor in a proxy that handles injecting dependencies.
//


    // Returns a factory function that creates a proxy constructor.
    return makeConstructorInjectable;
}